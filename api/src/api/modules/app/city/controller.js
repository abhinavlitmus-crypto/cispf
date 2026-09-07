const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');
const cityService = require("../../../../services/city");

class cityController {
    // author controller functions :
    static async Details(req, res) {
        try {
            const response = { data: null, message: Message.noContent.message, code: Message.noContent.code };
            const srvRes = await cityService.details(req.params._id);

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
            const srvRes = await cityService.list({ ...req.query, });
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

module.exports = cityController;
