const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');
const assessmentSubmissionService = require("../../../../services/assessmentSubmission");

class appAssessmentController {
    static async List(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code };
            const srvRes = await assessmentSubmissionService.listForTarget(req.query, req.__cuser._id);
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

    static async Details(req, res) {
        try {
            const response = { data: null, message: Message.noContent.message, code: Message.noContent.code };
            const srvRes = await assessmentSubmissionService.details(req.params._id);
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

    static async Submit(req, res) {
        try {
            const response = { data: null, message: Message.internalServerError.message, code: Message.internalServerError.code };
            const srvRes = await assessmentSubmissionService.submit({
                assignmentId: req.body.assignmentId,
                userId: req.__cuser._id,
                answers: req.body.answers,
            });
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

    static async Submissions(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code };
            const srvRes = await assessmentSubmissionService.mySubmissions(req.params.assignmentId, req.__cuser._id);
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

module.exports = appAssessmentController;
