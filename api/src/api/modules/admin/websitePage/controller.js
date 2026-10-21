const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');
const websitePageService = require("../../../../services/websitePage");

class websitePageController {
    static async Details(req, res) {
        try {
            const response = { data: null, message: Message.noContent.message, code: Message.noContent.code };
            const srvRes = await websitePageService.details(req.params._id);

            if (srvRes.data?._id) {
                response.data = srvRes.data;
                response.message = Message.dataFound.message;
                response.code = Message.dataFound.code;
            }
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataFetchingError, err));
        }
    }
    static async List(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = await websitePageService.list({ ...req.query });
            if (srvRes.data.length) {
                response.data = srvRes.data;
                response.message = Message.dataFound.message;
                response.code = Message.dataFound.code;
            }
            response.extra = srvRes.extra;
            Response.success(res, response);
        } catch (err) {
            console.log(err);
            Response.fail(res, Response.createError(Message.dataFetchingError, err));
        }
    }
    static async Save(req, res) {
        try {
            const response = { message: Message.internalServerError.message, code: Message.internalServerError.code };
            const srvRes = await websitePageService.save({ ...req.body, cid: req.__cuser });
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
            const response = { message: Message.dataDeletionError.message, code: Message.dataDeletionError.code };
            const srvRes = await websitePageService.delete(req.body.ids);
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

module.exports = websitePageController;
