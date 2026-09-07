const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
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
    state:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"stateDetails"
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('cityDetails', citySchema);
