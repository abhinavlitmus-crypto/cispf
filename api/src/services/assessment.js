const { Types } = require("mongoose");
const assessmentAssignmentModel = require("../models/assessmentAssignment");
const { paginationAggregate } = require("../utilities/pagination");
const { clearSearch } = require("../utilities/Helper");
const { getChanges } = require("../utilities/getChanges");
const historyService = require("./history");

class assessmentService {
    static async details(_id) {
        const response = { data: {}, status: false };
        try {
            _id = Types.ObjectId(_id);
            response.data = await assessmentAssignmentModel
                .findOne({ _id: _id, isDeleted: false })
                .populate("formId", "name details")
                .populate("courseId", "title modules");
            response.status = true;
            return response;
        } catch (error) {
            throw error;
        }
    }

    static async list(query = {}) {
        const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
        let response = { data: [], extra: { ...$extra }, status: false };
        try {
            const search = {
                ...(query._id && Types.ObjectId.isValid(query._id)
                    ? { _id: Types.ObjectId(query._id) }
                    : {}),
                ...(query.courseId && Types.ObjectId.isValid(query.courseId)
                    ? { courseId: Types.ObjectId(query.courseId) }
                    : {}),
                isDeleted: false,
            };

            clearSearch(search);

            if (query.status) {
                search.status = query.status ? true : false;
            }

            const $aggregate = [
                { $match: search },
                { $sort: { createdAt: -1 } },
                {
                    $lookup: {
                        from: "formbuilderdetails",
                        localField: "formId",
                        foreignField: "_id",
                        as: "form",
                    },
                },
                { $unwind: { path: "$form", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: "coursedetails",
                        localField: "courseId",
                        foreignField: "_id",
                        as: "course",
                    },
                },
                { $unwind: { path: "$course", preserveNullAndEmptyArrays: true } },
                {
                    $addFields: {
                        module: {
                            $first: {
                                $filter: {
                                    input: { $ifNull: ["$course.modules", []] },
                                    as: "m",
                                    cond: { $eq: ["$$m._id", "$moduleId"] },
                                },
                            },
                        },
                    },
                },
                {
                    $addFields: {
                        lesson: {
                            $first: {
                                $filter: {
                                    input: { $ifNull: ["$module.lessons", []] },
                                    as: "l",
                                    cond: { $eq: ["$$l._id", "$lessonId"] },
                                },
                            },
                        },
                    },
                },
                {
                    $project: {
                        formId: 1,
                        courseId: 1,
                        moduleId: 1,
                        lessonId: 1,
                        targetType: 1,
                        passPercentage: 1,
                        isMandatory: 1,
                        status: 1,
                        updatedAt: 1,
                        formName: "$form.name",
                        courseTitle: "$course.title",
                        moduleTitle: "$module.title",
                        lessonTitle: "$lesson.title",
                    },
                },
            ];

            response = await paginationAggregate(assessmentAssignmentModel, $aggregate, $extra);
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }

    static async save(data) {
        const _id = data._id;
        const response = { data: {}, status: false };
        try {
            const docData = _id ? await assessmentAssignmentModel.findById(_id) : new assessmentAssignmentModel();

            const oldData = docData.toObject();
            if (data.formId !== undefined) docData.formId = data.formId;
            if (data.courseId !== undefined) docData.courseId = data.courseId;
            docData.moduleId = data.moduleId || undefined;
            docData.lessonId = data.lessonId || undefined;
            if (data.targetType !== undefined) docData.targetType = data.targetType;
            if (data.passPercentage !== undefined) docData.passPercentage = data.passPercentage;
            if (data.isMandatory !== undefined) docData.isMandatory = data.isMandatory;
            if (!_id) docData.clientId = data?.cid?._id;

            docData.status = data.status !== undefined ? data.status : true;

            await docData.save();

            const changes = getChanges(oldData, docData.toObject());
            if (_id && (Object.keys(changes.newData).length > 0 || Object.keys(changes.oldData).length > 0)) {
                await historyService.save({
                    changes,
                    editedBy: data?.cid?._id,
                    tableName: "assessmentAssignmentDetails",
                    docId: docData._id,
                    status: true,
                });
            }

            response.data = docData;
            response.status = true;
            return response;
        } catch (err) {
            console.log("error", err);
            throw err;
        }
    }

    static async delete(ids) {
        const response = { status: false, ids: [] };
        try {
            if (Array.isArray(ids)) {
                await assessmentAssignmentModel.updateMany(
                    { $or: [{ _id: { $in: ids } }] },
                    { isDeleted: true }
                );
            } else if (typeof ids === "string") {
                await assessmentAssignmentModel.updateOne({ _id: ids }, { isDeleted: true });
                response.id = ids;
            }
            response.status = true;
            response.id = ids;

            return response;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = assessmentService;
