const newsletterSubscriberModel = require("../models/newsletterSubscriber");
const mailchimpService = require("./mailchimp");

// A sync stuck in "syncing" longer than this (e.g. the server restarted mid-request) can be claimed again.
const SYNC_LOCK_MS = 60 * 1000;

class newsletterSubscriberService {
    /**
     * Saves the subscriber in MongoDB first, then syncs with Mailchimp.
     * The record keeps the Mailchimp result, so a failed sync is retried the next time the visitor submits.
     * Returns { outcome } — see mailchimpService.syncSubscriber, plus "processing" and "failed".
     */
    static async subscribe({ name, email, source = "website-footer" }) {
        email = email.trim().toLowerCase();
        name = (name || "").trim();
        const now = new Date();

        const update = {
            $set: { consent: true, consentAt: now, ...(name ? { name } : {}) },
            $setOnInsert: { email, source },
        };
        let subscriber;
        try {
            subscriber = await newsletterSubscriberModel.findOneAndUpdate({ email }, update, { upsert: true, new: true });
        } catch (err) {
            // Two first-time submissions raced on the unique email index; the other one created the record.
            if (err.code !== 11000) throw err;
            subscriber = await newsletterSubscriberModel.findOneAndUpdate({ email }, { $set: update.$set }, { new: true });
        }

        // Claim the sync so duplicate submissions in flight don't call Mailchimp twice.
        const claimed = await newsletterSubscriberModel.findOneAndUpdate(
            {
                _id: subscriber._id,
                $or: [
                    { "mailchimp.status": { $ne: "syncing" } },
                    { "mailchimp.lastAttemptAt": { $lt: new Date(now.getTime() - SYNC_LOCK_MS) } },
                ],
            },
            { $set: { "mailchimp.status": "syncing", "mailchimp.lastAttemptAt": now }, $inc: { "mailchimp.attempts": 1 } },
            { new: true }
        );
        if (!claimed) return { outcome: "processing" };

        try {
            const result = await mailchimpService.syncSubscriber({ email, name: claimed.name });
            await newsletterSubscriberModel.updateOne({ _id: claimed._id }, {
                $set: {
                    "mailchimp.status": ["unsubscribed", "ineligible"].includes(result.outcome) ? "skipped" : "synced",
                    "mailchimp.outcome": result.outcome,
                    "mailchimp.memberStatus": result.memberStatus || "",
                    "mailchimp.tagged": result.tagged,
                    "mailchimp.syncedAt": new Date(),
                    "mailchimp.lastError": "",
                },
            });
            return { outcome: result.outcome };
        } catch (err) {
            const outcome = err.kind === "ineligible" ? "ineligible" : "failed";
            await newsletterSubscriberModel.updateOne({ _id: claimed._id }, {
                $set: {
                    "mailchimp.status": outcome === "ineligible" ? "skipped" : "failed",
                    "mailchimp.outcome": outcome,
                    // Status code and Mailchimp's error title only — no key or personal data.
                    "mailchimp.lastError": err.message || "Unknown error",
                },
            });
            if (err.kind === "config") console.error(`Newsletter: Mailchimp configuration problem - ${err.message}`);
            return { outcome, errorKind: err.kind };
        }
    }
}

module.exports = newsletterSubscriberService;
