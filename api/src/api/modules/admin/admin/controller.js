const adminService = require('../../../../services/admin');
const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');

class controller {
    static async login(req, res) {


        try {
            const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
            const srvRes = await adminService.login({ code: req.body.code, password: req.body.password });

            if (srvRes.status) {
                response.data = srvRes.data;
                response.message = 'Loggedin successfully';
                response.code = 200;
            }
            
            response.extra = srvRes.extra;
            Response.success(res, response);
        } catch (err) {
			Response.fail(res, err);
        }
    }
    static async validateToken(req, res) {
        console.log("validation token ",req.__cuser);
        try {
            // Response.success(res, { message: 'Authorizedsss', data: { type: req.__cuser } });
            Response.success(res, { message: 'Authorizedsss', data: {
                type: req.__cuser.userType,
                _id: req.__cuser._id,
                name: req.__cuser.name,
                moduleAccess: req.__cuser.moduleAccess
            } });
        } catch (e) {
            Response.fail(res, e);
        }
    }
    static async updatePassword(req, res) {
        try {
            const srvRes = await adminService.updatePassword({ ...req.body, _id: req.__cuser._id });
            Response.success(res, srvRes);
        } catch (e) {
            Response.fail(res, e);
        }
    }
    static async profile(req, res) {
        try {
            const srvRes = await adminService.profile(req.__cuser);
            Response.success(res, srvRes);
        } catch (e) {
            Response.fail(res, e);
        }
    }
    static async saveProfile(req, res) {
        try {
            const srvRes = await adminService.saveProfile(req.body, req.__cuser);
            Response.success(res, srvRes);
        } catch (e) {
            Response.fail(res, e);
        }
    }



     static async list(req,res){
        try {
            const response = {data:[],message:Message.noContent.message,code:Message.noContent.code,extra:{}};
            const srvRes = await adminService.list(req.query);
            if(srvRes.data.length){
                response.data = srvRes.data;
                response.message=Message.dataFound.message;
                response.code=Message.dataFound.code;
            }
            response.extra = srvRes.extra;
            Response.success(res,response);
        } catch (error) {
            Response.fail(res,Response.createError(Message.dataFetchingError,error))
        }
    }
    static async save(req,res){
       try{
        const response = {message:Message.internalServerError.message,code:Message.internalServerError.code};
        const srvRes = await adminService.save({...req.body});
        if(srvRes.status){
            response.message= Message.dataSaved.message;
            response.code= Message.dataSaved.code
        }
        Response.success(res,response);
       }catch(err){
        console.log("error",err)
        Response.fail(res,Response.createError(Message.dataDeletionError,err));
       }
    }
    static async delete(req,res){
         try{
            const response = {message:Message.dataDeletionError.message,code:Message.dataDeletionError.code};
            console.log('insidecontroller', response, req.body.ids)
            const srvRes = await adminService.delete(req.body.ids);
            console.log(srvRes)
            if(srvRes.status){
                response.message = Message.dataDeleted.message;
                response.code = Message.dataDeleted.code;
            }
            Response.success(res,response);
         }catch(err){
            Response.fail(res,Response.createError(Message.dataDeletionError,err))
         }
    }
}

module.exports = controller;