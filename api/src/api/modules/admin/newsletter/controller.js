const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');
const newsletterService = require("../../../../services/newsletter");

class newsletterController {
    static async Details(req, res) {
        try {
            const response = { data: null, message: Message.noContent.message, code: Message.noContent.code };
            const srvRes = await newsletterService.details(req.params._id);

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
            const srvRes = await newsletterService.list({ ...req.query });
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
            const srvRes = await newsletterService.save({ ...req.body, cid: req.__cuser });
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
            const srvRes = await newsletterService.delete(req.body.ids);
            if (srvRes.status) {
                response.message = Message.dataDeleted.message;
                response.code = Message.dataDeleted.code;
            }
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataDeletionError, err));
        }
    }
    static async Preview(req, res) {
        try {
            const response = { data: null, message: Message.noContent.message, code: Message.noContent.code };
            const srvRes = await newsletterService.preview(req.params._id);
            if (srvRes.status) {
                response.data = srvRes.data;
                response.message = Message.dataFound.message;
                response.code = Message.dataFound.code;
            }
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError(Message.dataFetchingError, err));
        }
    }
    static async Send(req, res) {
        try {
            const response = { message: "No active newsletter found to send", code: Message.dataNotFound.code };
            const srvRes = await newsletterService.send({
                _id: req.body._id,
                name: req.body.name,
                toEmail: req.body.toEmail,
            });
            if (srvRes.status) {
                response.data = srvRes.data;
                response.message = `Newsletter sent to ${req.body.toEmail}`;
                response.code = Message.dataSaved.code;
            }
            Response.success(res, response);
        } catch (err) {
            Response.fail(res, Response.createError({ ...Message.internalServerError, message: "Error while sending newsletter" }, err));
        }
    }
}

module.exports = newsletterController;
