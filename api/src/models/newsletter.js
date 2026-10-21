const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    image: { type: String, default: "" },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    buttonText: { type: String, default: "Full Story" },
    buttonLink: { type: String, default: "" },
}, { _id: false });

const newsletterSchema = new mongoose.Schema({
    title: {
        type: String,
        default: "CISPF Daily",
    },
    subject: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    sections: {
        type: [sectionSchema],
        default: [],
    },
    socialLinks: {
        facebook: { type: String, default: "" },
        twitter: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        whatsapp: { type: String, default: "" },
    },
    status: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('newsletterDetails', newsletterSchema);
