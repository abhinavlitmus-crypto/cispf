const mongoose = require('mongoose');

const assessmentSubmissionSchema = new mongoose.Schema(
    {
        assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'assessmentAssignmentDetails', required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'userDetails', required: true },
        answers: { type: mongoose.Schema.Types.Mixed },
        score: { type: Number, default: 0 },
        maxScore: { type: Number, default: 0 },
        percentage: { type: Number, default: 0 },
        isPassed: { type: Boolean, default: false },
        attemptNumber: { type: Number, default: 1 },
        submittedAt: { type: Date },
        status: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

assessmentSubmissionSchema.index({ assignmentId: 1, userId: 1 });

module.exports = mongoose.model('assessmentSubmissionDetails', assessmentSubmissionSchema);
