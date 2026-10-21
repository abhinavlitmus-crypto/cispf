const mongoose = require('mongoose');

// Every static website page type lives in this one collection.
// Add a new type here, then add a sidebar entry for it in the admin portal.
const PAGE_TYPES = ["EVENT", "POLICY", "POLICY_DISCUSSION", "TEAM"];

const websitePageSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: PAGE_TYPES,
        required: true,
    },
    // Shape depends on `type`, see cleaners in services/websitePage.js
    // EVENT: { publishDate, mainImage, title, description, slug, insideTitle,
    //          sections: [{ image, date, description }], featureImages: [String] }
    // POLICY_DISCUSSION: { title, slug, description, mainImage,
    //          sections: [{ images: [String], date, title, authorName, authorDesignation, mainImage, mainDescription }] }
    // TEAM: { title, slug, sections: [{ images: [String], name, designation, description }] }
    details: {
        type: Object,
        default: {},
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
    minimize: false,
});

websitePageSchema.index({ type: 1, "details.slug": 1 });

module.exports = mongoose.model('websitePageDetails', websitePageSchema);
module.exports.PAGE_TYPES = PAGE_TYPES;
