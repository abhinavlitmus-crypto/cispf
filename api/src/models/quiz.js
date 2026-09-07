const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
    },
    options: [
        { type: String }
    ],
    answer: {
        type: String,
    },

}, { _id: false });

const quizSchema = new mongoose.Schema(


    {
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        slug: {
            type: String,
        },
        questionDetails: [questionSchema],


        status: {
            type: Boolean,
            default: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('quizDetails', quizSchema);