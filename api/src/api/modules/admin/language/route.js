const router = require('express').Router({ mergeParams: true });
const controller = require('./controller');
const validation = require("../../../middlewares/validation/language");



router.post('/save', validation.languageValidation, controller.Save);
router.get('/list', controller.List);
router.get('/details/:_id', controller.Details);
router.post('/delete', controller.Delete);


module.exports = router