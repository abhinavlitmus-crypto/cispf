const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');
const progressService = require("../../../../services/progress");

class progressController {
    static async Update(req, res) {
        try {
            const response = { data: {}, message: Message.internalServerError.message, code: Message.internalServerError.code };
            const srvRes = await progressService.updateLessonProgress({
                userId: req.__cuser._id,
                courseId: req.body.courseId,
                moduleId: req.body.moduleId,
                lessonId: req.body.lessonId,
                watchedSeconds: req.body.watchedSeconds,
                markCompleted: req.body.markCompleted,
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

    static async CourseProgress(req, res) {
        try {
            const response = { data: null, message: Message.noContent.message, code: Message.noContent.code };
            const srvRes = await progressService.getCourseProgress(req.__cuser._id, req.params.courseId);

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

    static async List(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code };
            const srvRes = await progressService.getUserProgress(req.__cuser._id);

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
