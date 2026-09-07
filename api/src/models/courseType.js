const mongoose = require('mongoose');

const courseTypeSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    slug: {
        type: String,
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

module.exports = mongoose.model('courseTypeDetails', courseTypeSchema);
