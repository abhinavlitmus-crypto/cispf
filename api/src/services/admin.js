const { Types } = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Logger = require("../utilities/Logger");
const Response = require("../utilities/Response");
const Message = require("../utilities/Message");
const userModel = require("../models/admin");
const config = require("../config");
const punchService = require("./punch");
const {
  genFileUrlFromId,
  clearSearch,
  genFileUrl,
} = require("../utilities/Helper");
const { paginationAggregate } = require("../utilities/pagination");
const punch = require("../models/punch");

class MasterService {
  static async login({ code, password }) {
    try {
      const response = { data: {}, status: false };

      const user = await userModel.findOne({ email: code });

      if (!user) {
        throw new Error("User does not exist");
      }

      let isPasswordMatched = await bcrypt.compare(password, user.password);
      if (!isPasswordMatched) {
        throw new Error("Invalid Credentials");
      } else if (!user.status) {
        throw new Error("Account is blocked. Contact Admin!!");
      } else {

        const accessToken = jwt.sign({
          sub: user._id.toString(),
          exp: Math.floor(Date.now() / 1000) + 43200 * 60,
        },
          config.jwt.secretKey
        );

        const dateOnly = () => {
          const d = new Date();
          d.setHours(0, 0, 0, 0);
          return d;
        };

        // ✅ create ONCE
        const todayDate = dateOnly();
       
        const responseUser = await punchService.save({
          userId: user._id,
          details: [
            {
              punchIn: new Date(),   // ✅ same reference
              punchOut: null
            }
          ],
          date: todayDate,         // ✅ same reference
          status: true
        });


        const type = user.type;
        response.data.accessToken = accessToken;
        response.data.type = type;
        // response.data.user = user;
        response.data.modules = user?.modules;

        response.status = true;
      }

      return response;
    } catch (e) {

      throw e;
    }
  }

  static async updatePassword(data) {
    const response = {
      resCode: Message.internalServerError.code,
      message: Message.internalServerError.message,
    };

    try {
      const docData = await userModel.findById(data._id);

      docData.password = data.newPassword;
      docData.status = data.status;

      await docData.save();

      response.message = "Password updated";
      response.resCode = Message.dataSaved.code;

      return response;
    } catch (e) {
      throw Response.createError(Message.dataSavingError, e);
    }
  }

  static async profile(cuser) {
    const response = {
      resCode: Message.noContent.code,
      message: Message.noContent.message,
      data: {
        result: {},
      },
    };

    try {
      const result = await userModel
        .findById(cuser._id)
        .select("-password -type -_id -createdAt -updatedAt -__v")
        .lean();

      response.data.result = result;
      if (response.data.result) {
        response.message = Message.dataFound.message;
        response.resCode = Message.dataFound.code;
      }
      return response;
    } catch (e) {
      throw Response.createError(Message.dataFetchingError, e);
    }
  }

  static async saveProfile(data, cuser) {
    const response = {
      resCode: Message.profileUpdateError.code,
      message: Message.profileUpdateError.message,
    };

    try {
      const docData = await userModel.findById(cuser._id);
      if (!docData) {
        throw new Error("");
      }

      docData.avatar = data.avatar;
      docData.name = data.name;
      docData.code = data.code;
      docData.email = data.email;
      docData.mobile = data.mobile;
      docData.about = data.about;

      await docData.save();

      response.message = Message.profileUpdate.message;
      response.resCode = Message.profileUpdate.code;

      return response;
    } catch (e) {
      throw Response.createError(Message.dataSavingError, e);
    }
  }

  static async list(query = {}) {
    const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
    let response = { data: [], extra: { ...$extra }, status: false };
    try {
      const search = {
        _id: query._id
          ? Array.isArray(query._id)
            ? query._id.map((v) => Types.ObjectId(v))
            : Types.ObjectId(query._id)
          : "",
        roleId: query.roleId ? Types.ObjectId(query.roleId) : "",
        $or: query.key
          ? [
            { name: { $regex: new RegExp(query.key || ""), $options: "i" } },
            { email: { $regex: new RegExp(query.key || ""), $options: "i" } },
            { phone: { $regex: new RegExp(query.key || ""), $options: "i" } },
          ]
          : "",
        userType: { $ne: "SuperAdmin" },
        isDeleted: false,
      };
      clearSearch(search);
      console.log(search);
      const $aggregate = [
        { $match: search },
        { $sort: { _id: -1 } },
        {
          $project: {
            name: 1,

            email: 1,

            avatar: 1,
            userType: 1,
            rights: 1,
            status: 1,
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
      docData.name = data.name;
      !data.password || (docData.password = data.password);
      docData.email = data.email;
      docData.rights = data.rights;
      docData.status = data.status ?? docData.status;
      docData.avatar = data.avatar;
      docData.userType = data.userType;
      await docData.save();
      console.log(docData)
      response.data = docData;
      response.status = true;
      return response;
    } catch (err) {
      throw err;
    }
  }
  static async delete(ids) {
    const response = { status: false, ids: [] };
    console.log(ids, "asdasdasd");
    try {
      if (Array.isArray(ids)) {
        await userModel.updateMany({ _id: { $in: ids } }, { isDeleted: true });
      } else if (typeof ids === "string") {
        await userModel.updateOne({ _id: ids }, { isDeleted: true });
        response.id = ids;
      }
      response.status = true;
      response.ids = ids;
      return response;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = MasterService;
