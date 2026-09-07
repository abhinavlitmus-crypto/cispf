const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');
const stateService = require("../../../../services/state");

class stateController {
    // author controller functions :
    static async Details(req, res) {
        try {
            const response = { data: null, message: Message.noContent.message, code: Message.noContent.code };
            const srvRes = await stateService.details(req.params._id);

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

            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = await stateService.list({ ...req.query, });
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
}

module.exports = stateController;
