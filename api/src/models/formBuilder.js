const mongoose = require('mongoose');

const formBuilderSchema = new mongoose.Schema(
    {
        name: { type: String },
        clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },
        details: { type: mongoose.Schema.Types.Mixed },
        status: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model('formBuilderDetails', formBuilderSchema);
