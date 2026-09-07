const { Types } = require("mongoose");
const courseModel = require("../models/course")
const { paginationAggregate } = require("../utilities/pagination");
const { clearSearch } = require("../utilities/Helper");
const { getChanges } = require("../utilities/getChanges");
const historyService = require("./history");
class courseService {
    // Author service :
    static async details(_id) {
        const response = { data: {}, status: false };
        try {
            _id = Types.ObjectId(_id);
            response.data = await courseModel.findOne({ _id: _id, isDeleted: false });
            response.status = true;
            return response;
        } catch (error) {
            throw error;
        }
    }

    static async list(query = {}) {
        const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
        let response = { data: [], extra: { ...$extra }, status: false };
        const searchId = query.key?.split('-')[1] || "";
        try {
            // console.log("query in service",query);
            const regex = query.key ? new RegExp(query.key, "i") : null;

            const search = {
                ...(query._id && Types.ObjectId.isValid(query._id)
                    ? { _id: Types.ObjectId(query._id) }
                    : {}),

                ...(regex
                    ? {
                        $or: [
                            { title: regex },
                        ],
                    }
                    : {}),

                isDeleted: false,
            };


            clearSearch(search);

            if (query.cType === "trainer") {
                search.createdBy = Types.ObjectId(query.cId);
            }
            if (query.status) {
                search.status = query.status ? true : false;
            }
            const $aggregate = [
                { $match: search },

                { $sort: { createdAt: -1 } },
                {
                    $lookup: {
                        from: "languagedetails", // collection name (lowercase + plural rules depend)
                        localField: "language",
                        foreignField: "_id",
                        as: "languageData"
                    }
                },
                {
                    $unwind: {
                        path: "$languageData",
                        preserveNullAndEmptyArrays: true
                    }
                },

                {
                    $lookup: {
                        from: "coursetypedetails",
                        localField: "courseType",
                        foreignField: "_id",
                        as: "courseTypeData"
                    }
                },
                {
                    $unwind: {
                        path: "$courseTypeData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        title: 1,
                        description: 1,
                        modules: 1,
                        thumbNail: 1,
                        courseVideo: 1,
                        documentLabel: 1,
                        documentURL: 1,
                        courseType: "$courseTypeData",
                        language: "$languageData",
                        status: 1,
                        updatedAt: 1
                    },
                },
            ];

            response = await paginationAggregate(courseModel, $aggregate, $extra);
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
            const docData = _id ? await courseModel.findById(_id) : new courseModel();

            const oldData = docData.toObject()
            if (data.title !== undefined) docData.title = data.title;
            if (data.description !== undefined) docData.description = data.description;
            if (data.thumbNail !== undefined) docData.thumbNail = data.thumbNail;
            if (data.courseVideo !== undefined) docData.courseVideo = data.courseVideo;
            if (data.documentLabel !== undefined) docData.documentLabel = data.documentLabel;
            if (data.documentURL !== undefined) docData.documentURL = data.documentURL;
            if (data.modules !== undefined) docData.modules = data.modules;
            if (data.courseType !== undefined) docData.courseType = data.courseType;
            if (data.language !== undefined) docData.language = data.language;
            if (!data._id) {
                docData.createdBy = data.cid._id;
            }
            docData.status = data.status !== undefined ? data.status : true;

            // docData.status = data.status ? data.status : true;

            await docData.save();


            const changes = getChanges(oldData, docData.toObject())
            if (_id &&
                (Object.keys(changes.newData).length > 0 ||
                    Object.keys(changes.oldData).length > 0)
            ) {

                const res = await historyService.save({
                    changes,
                    editedBy: data?.cid?._id,
                    tableName: "clientDetails",
                    docId: docData._id,
                    status: true,
                });

            }

            response.data = docData;
            response.status = true;
            return response;
        } catch (err) {
            console.log("error", err)
            throw err;
        }
    }

    static async delete(ids) {
        const response = { status: false, ids: [] };
        try {
            if (Array.isArray(ids)) {
                await courseModel.updateMany(
                    { $or: [{ _id: { $in: ids } }] },
                    { isDeleted: true }
                );
            } else if (typeof ids === "string") {
                await courseModel.updateOne({ _id: ids }, { isDeleted: true });
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

module.exports = courseService;
