const { Types } = require("mongoose");
const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
const { paginationAggregate } = require("../utilities/pagination");
const { clearSearch } = require("../utilities/Helper");
const { getChanges } = require("../utilities/getChanges");
const historyService = require("./history");
const config = require("../config");
class userService {
    // Author service :
    static async login(data) {
        try {
            console.log("data in service", data);
            const response = { data: {}, status: false };
            let userType = "Existing";
            if (data.otp !== "123456") {
                throw new Error("Invalid OTP")
            }
            let user = await userModel.findOne({ phoneNumber: data.phoneNumber });
            if (!user) {
                user = new userModel({
                    phoneNumber: data.phoneNumber,
                    language: data.language,
                    status: true,
                    isDeleted: false,
                });

                await user.save();
                userType = "New";
            }



            const accessToken = jwt.sign(
                {
                    sub: user._id.toString(),
                    exp: Math.floor(Date.now() / 1000) + 43200 * 60,
                },
                config.jwt.secretKey
            );

            response.data.user = user;
            response.data.accessToken = accessToken;
            response.data.userType = userType;
            response.status = true;
            return response;
        } catch (e) {

            throw e;
        }
    }
    static async details(_id) {
        const response = { data: {}, status: false };
        try {
            _id = Types.ObjectId(_id);
            response.data = await userModel.findOne({ _id: _id, isDeleted: false });
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
                            { name: regex },
                            { city: regex },
                            { phoneNumber: regex },
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
                    $lookup: {
                        from: "languagedetails",
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
                    $project: {
                        name: 1,
                        phoneNumber: 1,
                        age: 1,
                        city: 1,
                        state: 1,
                        photoUrl: 1,
                        language: "$languageData",
                        status: 1,
                        updatedAt: 1
                    },
                },
            ];

            response = await paginationAggregate(userModel, $aggregate, $extra);
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
            const docData = _id ? await userModel.findById(_id) : new userModel();

            const oldData = docData.toObject()
            if (data.name !== undefined) docData.name = data.name;
            if (data.age !== undefined) docData.age = data.age;
            if (data.phoneNumber !== undefined) docData.phoneNumber = data.phoneNumber;
            if (data.language !== undefined) docData.language = data.language;
            if (data.city !== undefined) docData.city = data.city;
            if (data.state !== undefined) docData.state = data.state;
            if (data.photoUrl !== undefined) docData.photoUrl = data.photoUrl;

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
                await userModel.updateMany(
                    { $or: [{ _id: { $in: ids } }] },
                    { isDeleted: true }
                );
            } else if (typeof ids === "string") {
                await userModel.updateOne({ _id: ids }, { isDeleted: true });
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

module.exports = userService;
