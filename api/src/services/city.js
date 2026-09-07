const { Types } = require("mongoose");
const cityModel = require("../models/city")
const { paginationAggregate } = require("../utilities/pagination");
const { clearSearch } = require("../utilities/Helper");
const { getChanges } = require("../utilities/getChanges");
const historyService = require("./history");
class cityService {
    // Author service :
    static async details(_id) {
        const response = { data: {}, status: false };
        try {
            _id = Types.ObjectId(_id);
            response.data = await cityModel.findOne({ _id: _id, isDeleted: false });
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

                ...(query.state && Types.ObjectId.isValid(query.state)
                    ? { state: Types.ObjectId(query.state) }
                    : {}),

                ...(regex
                    ? {
                        $or: [
                            { name: regex },
                        ],
                    }
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
                    $project: {
                        name: 1,
                        slug: 1,
                        state:1,
                        status: 1,
                        updatedAt: 1
                    },
                },
            ];

            response = await paginationAggregate(cityModel, $aggregate, $extra);
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
            const docData = _id ? await cityModel.findById(_id) : new cityModel();

            const oldData = docData.toObject()
            if (data.name !== undefined) docData.name = data.name.trim() ? data.name.trim().charAt(0).toUpperCase() + data.name.trim().slice(1) : "";
            if (data.slug !== undefined) docData.slug = data.slug;
            if (data.state !== undefined) docData.state = data.state;

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
                await cityModel.updateMany(
                    { $or: [{ _id: { $in: ids } }] },
                    { isDeleted: true }
                );
            } else if (typeof ids === "string") {
                await cityModel.updateOne({ _id: ids }, { isDeleted: true });
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

module.exports = cityService;
