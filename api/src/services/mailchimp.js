const crypto = require("crypto");
const axios = require("axios");
const config = require("../config");

// kind: "config" (bad key/audience/merge fields), "retryable" (rate limit, Mailchimp or network outage),
// "ineligible" (Mailchimp refuses this address).
class MailchimpError extends Error {
    constructor(kind, status, title) {
        super(`Mailchimp ${status ? `${status} ` : ""}error${title ? `: ${title}` : ""}`);
        this.name = "MailchimpError";
        this.kind = kind;
        this.status = status || null;
    }
}

const INELIGIBLE_TITLES = ["Member In Compliance State", "Forgotten Email Not Subscribed"];

function toMailchimpError(err) {
    if (err instanceof MailchimpError) return err;
    const status = err.response?.status;
    const title = err.response?.data?.title || "";
    const detail = err.response?.data?.detail || "";

    if (!status) return new MailchimpError("retryable", null, err.code || "no response");
    if (status === 429 || status >= 500) return new MailchimpError("retryable", status, title);
    // e.g. "x looks fake or invalid, please enter a real email address." / "Please provide a valid email address."
    if (status === 400 && (INELIGIBLE_TITLES.includes(title) || /looks fake|valid email/i.test(detail))) {
        return new MailchimpError("ineligible", status, title);
    }
    // 401/403: wrong API key, 404: wrong audience id, other 400s: audience setup (e.g. required merge fields).
    return new MailchimpError("config", status, title);
}

function subscriberHash(email) {
    return crypto.createHash("md5").update(email.toLowerCase()).digest("hex");
}

function audienceClient() {
    const { apiKey, serverPrefix, audienceId } = config.mailchimp;
    if (!apiKey || !serverPrefix || !audienceId) throw new MailchimpError("config", null, "Mailchimp environment variables are missing");

    return axios.create({
        baseURL: `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}`,
        auth: { username: "cispf", password: apiKey },
        timeout: 10000,
    });
}

function mergeFields(name) {
    const [firstName, ...rest] = (name || "").trim().split(/\s+/);
    if (!firstName) return undefined;
    return { FNAME: firstName, LNAME: rest.join(" ") };
}

class mailchimpService {
    /**
     * Adds the contact to the audience and applies the website tag, without changing an existing contact's status.
     * Returns { outcome, memberStatus, tagged } where outcome is one of:
     * subscribed, confirmation_required, already_subscribed, unsubscribed, ineligible.
     */
    static async syncSubscriber({ email, name }) {
        try {
            const api = audienceClient();
            const hash = subscriberHash(email);

            let currentStatus = null;
            try {
                currentStatus = (await api.get(`/members/${hash}`, { params: { fields: "status" } })).data.status;
            } catch (err) {
                // 404 means the contact is new; a wrong audience id is caught by the PUT below.
                if (err.response?.status !== 404) throw err;
            }

            // Never resubscribe someone who opted out, and leave cleaned (bounced) addresses alone.
            if (currentStatus === "unsubscribed") return { outcome: "unsubscribed", memberStatus: currentStatus, tagged: false };
            if (currentStatus === "cleaned") return { outcome: "ineligible", memberStatus: currentStatus, tagged: false };

            const status = config.mailchimp.doubleOptIn ? "pending" : "subscribed";
            // Without confirmation emails, a contact still awaiting confirmation is subscribed by the consent they just gave.
            const restorable = ["archived", "transactional", ...(config.mailchimp.doubleOptIn ? [] : ["pending"])];

            let memberStatus = currentStatus;
            if (!currentStatus || restorable.includes(currentStatus)) {
                const body = { email_address: email, status_if_new: status, merge_fields: mergeFields(name) };
                // status only updates the restorable contacts above; new contacts use status_if_new.
                if (currentStatus) body.status = status;
                memberStatus = (await api.put(`/members/${hash}`, body)).data.status;
            }

            await api.post(`/members/${hash}/tags`, { tags: [{ name: config.mailchimp.tag, status: "active" }] });

            let outcome = "ineligible";
            if (memberStatus === "pending") outcome = "confirmation_required";
            else if (memberStatus === "subscribed") outcome = currentStatus === "subscribed" ? "already_subscribed" : "subscribed";

            return { outcome, memberStatus, tagged: true };
        } catch (err) {
            throw toMailchimpError(err);
        }
    }
}

module.exports = mailchimpService;
module.exports.MailchimpError = MailchimpError;
module.exports.subscriberHash = subscriberHash;
