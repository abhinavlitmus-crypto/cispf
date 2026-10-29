const mongoose = require('mongoose');

// Visitors who signed up through the website newsletter form.
const newsletterSubscriberSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "",
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    consent: {
        type: Boolean,
        default: false,
    },
    consentAt: {
        type: Date,
    },
    source: {
        type: String,
        default: "website-footer",
    },
    mailchimp: {
        // pending: not tried yet, syncing: request in progress, synced: done,
        // skipped: Mailchimp contact is unsubscribed/cleaned, failed: retried on the next submission.
        status: {
            type: String,
            enum: ["pending", "syncing", "synced", "skipped", "failed"],
            default: "pending",
        },
        // Last outcome returned to the visitor, e.g. subscribed, confirmation_required.
        outcome: { type: String, default: "" },
        // Contact status in Mailchimp: subscribed, pending, unsubscribed, cleaned, ...
        memberStatus: { type: String, default: "" },
        tagged: { type: Boolean, default: false },
        attempts: { type: Number, default: 0 },
        lastAttemptAt: { type: Date },
        syncedAt: { type: Date },
        lastError: { type: String, default: "" },
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('newsletterSubscriber', newsletterSubscriberSchema);
