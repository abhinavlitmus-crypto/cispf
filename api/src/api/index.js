const Response = require("../utilities/Response");
const Logger = require("../utilities/Logger");
const { validateToken } = require("./middlewares/authAdmin");


const adminAdminRoute = require("./modules/admin/admin/route");
const fileRoute = require("./modules/admin/file/route");
const adminClientRoute = require("./modules/admin/client/route")
const adminDocumentsRoute = require("./modules/admin/document/route");
const adminMeRoute = require("./modules/admin/me/route");
const adminHistoryRoute = require("./modules/admin/history/route")
const adminUserRoute = require("./modules/admin/user/route")
const adminCourseRoute = require("./modules/admin/course/route")
const adminQuizRoute = require("./modules/admin/quiz/route")
const adminFormBuilderRoute = require("./modules/admin/formBuilder/route")
const adminCityRoute = require("./modules/admin/city/route")
const adminStateRoute = require("./modules/admin/state/route")
const adminLanguageRoute = require("./modules/admin/language/route")
const adminCourseTypeRoute = require("./modules/admin/courseType/route")
const adminProgressRoute = require("./modules/admin/progress/route")
const adminAssessmentRoute = require("./modules/admin/assessment/route")
const adminNewsletterRoute = require("./modules/admin/newsletter/route")
const adminWebsitePageRoute = require("./modules/admin/websitePage/route")


// APP Route
const appCourseRoute = require("./modules/app/course/route")
const appUserRoute = require("./modules/app/user/route")
const appMeRoute = require("./modules/app/me/route")
const appLanguageRoute = require("./modules/app/languages/route")
const appStateRoute = require("./modules/app/state/route")
const appCityRoute = require("./modules/app/city/route")
const appFileRoute = require("./modules/admin/file/route")
const appProgressRoute = require("./modules/app/progress/route")
const appAssessmentRoute = require("./modules/app/assessment/route")
const appWebsitePageRoute = require("./modules/app/websitePage/route")

const api = (app) => {

  app.use("*", (req, res, next) => {
    res.set({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    });
    if (req.method === "OPTIONS") {
      res.status(200).json({ status: "Okay" });
    } else {
      next();
    }
  });

  app.all("/status", (req, res) => {
    Logger.info("checking status", { status: 1 });

    Response.success(res, {
      data: {
        headers: req.headers,
        params: req.params,
        query: req.query,
        body: req.body,
      },
    });
  });

  app.all("/validate-token", validateToken, (req, res) => {
    Response.success(res, {
      data: {
        type: req.__cuser.userType,
        adminRights: req.__cuser.rights,
        name: req.__cuser.name,
        _id: req.__cuser._id,
        avatar: req.__cuser.avatar,
        moduleAccess: req.__cuser.moduleAccess
      },
      message: "Authorized",
    });
  });

  /*
    |--------------------------------------------------------------------------
    |  Admin Urls
    |--------------------------------------------------------------------------
  */

  app.use("/admin/file", fileRoute);
  app.use("/admin", adminAdminRoute);
  app.use("/admin/documents", validateToken, adminDocumentsRoute);

  app.use("/admin/me", validateToken, adminMeRoute);

  app.use("/admin/history", adminHistoryRoute);
  app.use("/admin/client", validateToken, adminClientRoute);
  app.use("/admin/user", validateToken, adminUserRoute);
  app.use("/admin/course", validateToken, adminCourseRoute);
  app.use("/admin/quiz", validateToken, adminQuizRoute);
  app.use("/admin/form-builder", validateToken, adminFormBuilderRoute);
  app.use("/admin/city", validateToken, adminCityRoute);
  app.use("/admin/state", validateToken, adminStateRoute);
  app.use("/admin/language", validateToken, adminLanguageRoute);
  app.use("/admin/course-type", validateToken, adminCourseTypeRoute);
  app.use("/admin/progress", validateToken, adminProgressRoute);
  app.use("/admin/assessment", validateToken, adminAssessmentRoute);
  app.use("/admin/newsletter", validateToken, adminNewsletterRoute);
  app.use("/admin/website-page", validateToken, adminWebsitePageRoute);

  // App Route
  app.use("/app/course",appCourseRoute)
  app.use("/app/user",appUserRoute);
  app.use("/app/me", validateToken ,appMeRoute);
  app.use("/app/language" ,appLanguageRoute);
  app.use("/app/state", appStateRoute);
  app.use("/app/city", appCityRoute);
  app.use("/app/file", appFileRoute);
  app.use("/app/progress", validateToken, appProgressRoute);
  app.use("/app/assessment", validateToken, appAssessmentRoute);
  app.use("/app/website-page", appWebsitePageRoute);
};

module.exports = api;


