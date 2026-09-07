const mongoose = require('mongoose');


const videoSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    videoURL: {
        type: String,
    },
    duration: {
        type: Number,
    },
    documentLabel: {
        type: String,
    },
    documentURL: {
        type: String,
    },

});


const moduleSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "quizDetails"
    },
    duration: {
        type: Number,
    },
    documentLabel: {
        type: String,
    },
    documentURL: {
        type: String,
    },
    lessons: [videoSchema],

});

moduleSchema.pre("validate", function (next) {
    this.duration = (this.lessons || []).reduce(
        (total, lesson) => total + (lesson.duration || 0),
        0
    );
    next();
});


const courseSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    thumbNail: {
        type: String,
    },
    courseVideo: {
        type: String,
    },
    documentLabel: {
        type: String,
    },
    documentURL: {
        type: String,
    },
    language: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "languageDetails"
    },
    courseType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "courseTypeDetails"
    },
    modules: [moduleSchema],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
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


courseSchema.pre("validate", function (next) {
    (this.modules || []).forEach((module) => {
        if (!module._id) {
            module._id = new mongoose.Types.ObjectId();
        }
        (module.lessons || []).forEach((lesson) => {
            if (!lesson._id) {
                lesson._id = new mongoose.Types.ObjectId();
            }
        });
    });
    next();
});

module.exports = mongoose.model('courseDetails', courseSchema);
