const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');
const progressService = require("../../../../services/progress");

class progressController {
    static async UserProgress(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code };
            const srvRes = await progressService.getUserProgress(req.params.userId);

            if (srvRes.data.length) {
                response.data = srvRes.data;
                response.message = Message.dataFound.message;
                response.code = Message.dataFound.code;
            }
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataFetchingError, err));
        }
    }
}

module.exports = progressController;
