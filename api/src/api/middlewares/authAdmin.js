const jwt = require("jsonwebtoken");
const HttpStatus = require("http-status-codes");
const Logger = require("../../utilities/Logger");
const Response = require("../../utilities/Response");
const Message = require("../../utilities/Message");
const config = require("../../config");
const masterAdminModule = require("../../models/admin");
const masterUserModule = require("../../models/user");

module.exports = {
  validateToken: async (req, res, next) => {
    try {
      if (!req.headers.authorization) {
        throw new Error();
      }

      const authorization = req.headers.authorization.trim();

      if (!authorization.startsWith("Bearer ")) {
        throw Response.createError(Message.invalidToken);
      }

      const token = authorization.split(" ")[1];
      const decode = jwt.verify(token, config.jwt.secretKey);

      let cuser = await masterAdminModule.findById(decode.sub);
      let userType = null;
      if(cuser){
        userType = "portal"
      }
      if (!cuser) {
        cuser = await masterUserModule.findById(decode.sub);
        userType = "app"
      }

      if (!cuser) {
        return Response.fail(
          res,
          "User not found",
          HttpStatus.StatusCodes.UNAUTHORIZED
        );
      }

      if (cuser.isDeleted) {
        return Response.fail(
          res,
          "User does not exist",
          HttpStatus.StatusCodes.UNAUTHORIZED
        );
      }

      if (!cuser.status) {
        return Response.fail(
          res,
          "Account is blocked. Contact Admin!!",
          HttpStatus.StatusCodes.UNAUTHORIZED
        );
      }

      req.__cuser = cuser;
      req.userType = userType;

      next();

    } catch (e) {
      Logger.error("AuthMiddleware Failed :", e);

      return Response.fail(
        res,
        "Unauthorized! Try login again.",
        HttpStatus.StatusCodes.UNAUTHORIZED
      );
    }
  }
};
