const router = require('express').Router({ mergeParams: true });
const controller = require('./controller');
const validation = require("../../../middlewares/validation/course");



router.get('/list',controller.List);
// router.get('/details/:_id', controller.Details);
// router.post('/delete',  controller.Delete);


module.exports = router