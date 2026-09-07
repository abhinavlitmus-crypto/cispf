const Response = require("../../../../utilities/Response");
const Message = require("../../../../utilities/Message");
const meService = require("../../../../services/me");

class meController {
    // author controller functions :
    static async Details(req, res) {
        try {
            const response = {
                data: null,
                message: Message.noContent.message,
                code: Message.noContent.code,
            };
            const srvRes = await meService.details(req.params._id);

            if (srvRes.data?._id) {
                response.data = srvRes.data;
                response.message = Message.dataFound.message;
                response.code = Message.dataFound.code;
            }

            response.extra = srvRes.extra;
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataFetchingError, err));
        }
    }
    static async List(req, res) {
        try {
            console.log("List req", req.userType);
            const response = {
                data: [],
                message: Message.noContent.message,
                code: Message.noContent.code,
                extra: {},
            };
            // const srvRes = await meService.list(req.query);
            // if (srvRes.data.length) {
            //   response.data = srvRes.data;
            //   response.message = Message.dataFound.message;
            //   response.code = Message.dataFound.code;
            // }

            response.data = { user: req.__cuser, userType: req?.userType };


            //  response.data = req.__cuser;
            //   response.data.userType = req.userType;
            response.message = Message.dataFound.message;
            response.code = Message.dataFound.code;
            Response.success(res, response);
        } catch (err) {
            console.error("Error in List:", err);
            Response.fail(res, Response.createError(Message.dataFetchingError, err));
        }
    }
    static async Save(req, res, next) {
        try {
            const response = {
                message: Message.internalServerError.message,
                code: Message.internalServerError.code,
            };
            const srvRes = await meService.save({ ...req.body });
            if (srvRes.status) {
                response.data = srvRes.data;
                response.message = Message.dataSaved.message;
                response.code = Message.dataSaved.code;
            }
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataSavingError, err));
        }
    }
    static async Delete(req, res) {
        try {
            const response = {
                message: Message.dataDeletionError.message,
                code: Message.dataDeletionError.code,
            };
            const srvRes = await meService.delete(req.body.ids);
            if (srvRes.status) {
                response.message = Message.dataDeleted.message;
                response.code = Message.dataDeleted.code;
            }
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataDeletionError, err));
        }
    }
}

module.exports = meController;