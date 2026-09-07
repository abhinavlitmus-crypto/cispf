const mongoose = require('mongoose');

const assessmentAssignmentSchema = new mongoose.Schema(
    {
        formId: { type: mongoose.Schema.Types.ObjectId, ref: 'formBuilderDetails', required: true },
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'courseDetails', required: true },
        moduleId: { type: mongoose.Schema.Types.ObjectId },
        lessonId: { type: mongoose.Schema.Types.ObjectId },
        targetType: { type: String, enum: ['course', 'module', 'lesson'], required: true },
        passPercentage: { type: Number, default: 40 },
        isMandatory: { type: Boolean, default: false },
        clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },
        status: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model('assessmentAssignmentDetails', assessmentAssignmentSchema);
