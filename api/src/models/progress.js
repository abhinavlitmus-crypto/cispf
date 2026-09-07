const mongoose = require('mongoose');

const lessonProgressSchema = new mongoose.Schema({
    lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    watchedSeconds: {
        type: Number,
        default: 0,
    },
    watchedPercent: {
        type: Number,
        default: 0,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    lastWatchedAt: {
        type: Date,
    },
}, { _id: false });

const moduleProgressSchema = new mongoose.Schema({
    moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    lessons: [lessonProgressSchema],
    completionPercent: {
        type: Number,
        default: 0,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
}, { _id: false });

const progressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userDetails",
        required: true,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "courseDetails",
        required: true,
    },
    modules: [moduleProgressSchema],
    completionPercent: {
        type: Number,
        default: 0,
    },
    isCompleted: {
        type: Boolean,
        default: false,
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

progressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('progressDetails', progressSchema);
