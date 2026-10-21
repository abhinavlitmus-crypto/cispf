const { Types } = require("mongoose");
const nodemailer = require("nodemailer");
const config = require("../config");
const Logger = require("../utilities/Logger");
const newsletterModel = require("../models/newsletter");
const { paginationAggregate } = require("../utilities/pagination");
const { clearSearch } = require("../utilities/Helper");
const { renderNewsletter } = require("../utilities/newsletterTemplate");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.nodemailer.nodemailerEmail,
        pass: config.nodemailer.nodemailerPasscode,
    },
});

const SOCIAL_KEYS = ["facebook", "twitter", "linkedin", "whatsapp"];

class newsletterService {
    static async details(_id) {
        const response = { data: {}, status: false };
        try {
            _id = Types.ObjectId(_id);
            response.data = await newsletterModel.findOne({ _id: _id, isDeleted: false });
            response.status = true;
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Latest active newsletter by its date
    static async latest() {
        return newsletterModel
            .findOne({ isDeleted: false, status: true })
            .sort({ date: -1, createdAt: -1 });
    }

    static async list(query = {}) {
        const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
        let response = { data: [], extra: { ...$extra }, status: false };
        try {
            const regex = query.key ? new RegExp(query.key, "i") : null;

            const search = {
                ...(query._id && Types.ObjectId.isValid(query._id)
                    ? { _id: Types.ObjectId(query._id) }
                    : {}),
                ...(regex ? { $or: [{ title: regex }, { subject: regex }, { "sections.title": regex }] } : {}),
                isDeleted: false,
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { date: -1, createdAt: -1 } },
                {
                    $project: {
                        title: 1,
                        subject: 1,
                        date: 1,
                        sections: 1,
                        socialLinks: 1,
                        status: 1,
                        updatedAt: 1,
                    },
                },
            ];

            response = await paginationAggregate(newsletterModel, $aggregate, $extra);
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }

    static async save(data) {
        const _id = data._id;
        const response = { data: {}, status: false };
        try {
            const docData = _id ? await newsletterModel.findById(_id) : new newsletterModel();

            if (data.title !== undefined) docData.title = data.title.trim();
            if (data.subject !== undefined) docData.subject = data.subject.trim();
            if (data.date !== undefined) docData.date = data.date;
            if (Array.isArray(data.sections)) {
                docData.sections = data.sections.map((s) => ({
                    image: s.image || "",
                    title: (s.title || "").trim(),
                    description: (s.description || "").trim(),
                    buttonText: (s.buttonText || "Full Story").trim(),
                    buttonLink: (s.buttonLink || "").trim(),
                }));
            }
            if (data.socialLinks) {
                SOCIAL_KEYS.forEach((key) => {
                    if (data.socialLinks[key] !== undefined) docData.socialLinks[key] = (data.socialLinks[key] || "").trim();
                });
            }
            docData.status = data.status !== undefined ? data.status : true;

            await docData.save();

            response.data = docData;
            response.status = true;
            return response;
        } catch (err) {
            console.log("error", err);
            throw err;
        }
    }

    static async delete(ids) {
        const response = { status: false, ids: [] };
        try {
            if (Array.isArray(ids)) {
                await newsletterModel.updateMany({ _id: { $in: ids } }, { isDeleted: true });
            } else if (typeof ids === "string") {
                await newsletterModel.updateOne({ _id: ids }, { isDeleted: true });
            }
            response.status = true;
            response.id = ids;
            return response;
        } catch (error) {
            throw error;
        }
    }

    static async preview(_id) {
        const newsletter = _id ? await newsletterModel.findOne({ _id, isDeleted: false }) : await newsletterService.latest();
        if (!newsletter) return { status: false, data: null };
        return { status: true, data: renderNewsletter(newsletter.toObject()) };
    }

    // Sends the given newsletter (or the latest one) to a single recipient
    static async send({ _id, name, toEmail }) {
        const response = { status: false, data: null };
        const newsletter = _id ? await newsletterModel.findOne({ _id, isDeleted: false }) : await newsletterService.latest();
        if (!newsletter) return response;

        const nl = newsletter.toObject();
        const html = renderNewsletter(nl, { name });
        try {
            const info = await transporter.sendMail({
                from: `"${nl.title || "CISPF Daily"}" <${config.nodemailer.nodemailerEmail}>`,
                to: toEmail,
                subject: nl.subject || `${nl.title || "CISPF Daily"} - ${new Date(nl.date).toDateString()}`,
                html,
            });
            response.status = true;
            response.data = { messageId: info.messageId, newsletterId: nl._id, toEmail };
            return response;
        } catch (error) {
            Logger.error(`Error while sending newsletter to ${toEmail} - ${error.message}`);
            throw error;
        }
    }
}

module.exports = newsletterService;
