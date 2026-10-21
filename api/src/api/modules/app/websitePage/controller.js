const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');
const websitePageService = require("../../../../services/websitePage");

class websitePageController {
    // GET /app/website-page/:type/list  e.g. /app/website-page/event/list, /app/website-page/policy-discussion/list
    static async List(req, res) {
        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = await websitePageService.list({ ...req.query, type: req.params.type.toUpperCase().replace(/-/g, "_"), status: "true" });
            if (srvRes.data.length) {
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
    // GET /app/website-page/:type/details/:slug
    static async Details(req, res) {
        try {
            const response = { data: null, message: Message.noContent.message, code: Message.noContent.code };
            const srvRes = await websitePageService.detailsBySlug(req.params.type.toUpperCase().replace(/-/g, "_"), req.params.slug);
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
}

module.exports = websitePageController;
