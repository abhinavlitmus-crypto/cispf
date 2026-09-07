
const router = require('express').Router({ mergeParams: true });
const controller = require('./controller');
const validation = require("../../../middlewares/validation/client");



router.post('/save',controller.Save);
router.post('/logout',controller.Update);
router.get('/list',controller.List);
router.get('/details/:_id', controller.Details);
router.post('/delete',  controller.Delete);


module.exports = router