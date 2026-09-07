const { Types } = require("mongoose");
const assessmentAssignmentModel = require("../models/assessmentAssignment");
const assessmentSubmissionModel = require("../models/assessmentSubmission");
const formBuilderModel = require("../models/formBuilder");
const { clearSearch } = require("../utilities/Helper");

const stripAnswerKey = (details) => {
    if (!details?.sections) return details;
    return {
        ...details,
        sections: details.sections.map((section) => ({
            ...section,
            fields: (section.fields || []).map((field) => {
                const { correctAnswer, correctAnswers, ...safeField } = field;
                return safeField;
            }),
        })),
    };
};

const gradableFields = (details) => {
    const fields = [];
    (details?.sections || []).forEach((section) => {
        (section.fields || []).forEach((field) => {
            if (field.correctAnswer !== undefined || field.correctAnswers !== undefined) {
                fields.push(field);
            }
        });
    });
    return fields;
};

const isFieldCorrect = (field, submitted) => {
    if (field.correctAnswers !== undefined) {
        const expected = [...(field.correctAnswers || [])].sort();
        const given = Array.isArray(submitted) ? [...submitted].sort() : [];
        return !!expected.length && JSON.stringify(expected) === JSON.stringify(given);
    } else if (typeof field.correctAnswer === "boolean") {
        return !!submitted === field.correctAnswer;
    } else if (field.correctAnswer !== undefined) {
        return submitted === field.correctAnswer;
    }
    return false;
};

const buildReview = (form, answers = {}) => {
    return gradableFields(form.details).map((field) => {
        const submittedAnswer = answers[field.id];
        return {
            fieldId: field.id,
            label: field.label,
            type: field.type,
            options: field.options,
            points: field.points || 1,
            submittedAnswer,
            correctAnswer: field.correctAnswer,
            correctAnswers: field.correctAnswers,
            isCorrect: isFieldCorrect(field, submittedAnswer),
        };
    });
};

const scoreSubmission = (form, answers = {}) => {
    const review = buildReview(form, answers);
    const score = review.reduce((total, r) => total + (r.isCorrect ? r.points : 0), 0);
    const maxScore = review.reduce((total, r) => total + r.points, 0);
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
    return { score, maxScore, percentage, review };
};

class assessmentSubmissionService {
    static async listForTarget(query = {}, userId) {
        const response = { data: [], status: false };
        try {
            const search = {
                isDeleted: false,
                status: true,
                ...(query.courseId && Types.ObjectId.isValid(query.courseId)
                    ? { courseId: Types.ObjectId(query.courseId) }
                    : {}),
                ...(query.moduleId && Types.ObjectId.isValid(query.moduleId)
                    ? { moduleId: Types.ObjectId(query.moduleId) }
                    : {}),
                ...(query.lessonId && Types.ObjectId.isValid(query.lessonId)
                    ? { lessonId: Types.ObjectId(query.lessonId) }
                    : {}),
            };
            clearSearch(search);

            const assignments = await assessmentAssignmentModel
                .find(search)
                .populate("formId", "name")
                .sort({ createdAt: -1 });

            const data = await Promise.all(
                assignments.map(async (assignment) => {
                    const lastSubmission = await assessmentSubmissionModel
                        .findOne({ assignmentId: assignment._id, userId, isDeleted: false })
                        .sort({ attemptNumber: -1 });

                    return {
                        _id: assignment._id,
                        formId: assignment.formId?._id,
                        formName: assignment.formId?.name,
                        courseId: assignment.courseId,
                        moduleId: assignment.moduleId,
                        lessonId: assignment.lessonId,
                        targetType: assignment.targetType,
                        passPercentage: assignment.passPercentage,
                        isMandatory: assignment.isMandatory,
                        submission: lastSubmission
                            ? {
                                  score: lastSubmission.score,
                                  maxScore: lastSubmission.maxScore,
                                  percentage: lastSubmission.percentage,
                                  isPassed: lastSubmission.isPassed,
                                  attemptNumber: lastSubmission.attemptNumber,
                                  submittedAt: lastSubmission.submittedAt,
                              }
                            : null,
                    };
                })
            );

            response.data = data;
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }

    static async details(_id) {
        const response = { data: null, status: false };
        try {
            const assignment = await assessmentAssignmentModel
                .findOne({ _id: Types.ObjectId(_id), isDeleted: false })
                .populate("formId", "name details");

            if (!assignment) {
                response.status = true;
                return response;
            }

            response.data = {
                _id: assignment._id,
                courseId: assignment.courseId,
                moduleId: assignment.moduleId,
                lessonId: assignment.lessonId,
                targetType: assignment.targetType,
                passPercentage: assignment.passPercentage,
                isMandatory: assignment.isMandatory,
                form: {
                    _id: assignment.formId?._id,
                    name: assignment.formId?.name,
                    details: stripAnswerKey(assignment.formId?.details),
                },
            };
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }

    static async submit({ assignmentId, userId, answers }) {
        const response = { data: null, status: false };
        try {
            const assignment = await assessmentAssignmentModel.findOne({
                _id: Types.ObjectId(assignmentId),
                isDeleted: false,
                status: true,
            });
            if (!assignment) {
                throw new Error("Assessment assignment not found");
            }

            const form = await formBuilderModel.findOne({ _id: assignment.formId, isDeleted: false });
            if (!form) {
                throw new Error("Form not found");
            }

            const { score, maxScore, percentage, review } = scoreSubmission(form, answers);
            const isPassed = percentage >= (assignment.passPercentage || 0);

            const priorCount = await assessmentSubmissionModel.countDocuments({
                assignmentId: assignment._id,
                userId,
                isDeleted: false,
            });

            const submission = new assessmentSubmissionModel({
                assignmentId: assignment._id,
                userId,
                answers,
                score,
                maxScore,
                percentage,
                isPassed,
                attemptNumber: priorCount + 1,
                submittedAt: new Date(),
            });

            await submission.save();

            response.data = { ...submission.toObject(), review };
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }

    static async mySubmissions(assignmentId, userId) {
        const response = { data: [], status: false };
        try {
            const submissions = await assessmentSubmissionModel
                .find({ assignmentId: Types.ObjectId(assignmentId), userId, isDeleted: false })
                .sort({ attemptNumber: -1 });

            if (!submissions.length) {
                response.status = true;
                return response;
            }

            const assignment = await assessmentAssignmentModel.findOne({ _id: Types.ObjectId(assignmentId) });
            const form = assignment
                ? await formBuilderModel.findOne({ _id: assignment.formId, isDeleted: false })
                : null;

            response.data = submissions.map((submission) => ({
                ...submission.toObject(),
                review: form ? buildReview(form, submission.answers) : [],
            }));
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = assessmentSubmissionService;
