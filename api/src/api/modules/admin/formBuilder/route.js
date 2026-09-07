const router = require('express').Router({ mergeParams: true });
const controller = require('./controller');
const validation = require("../../../middlewares/validation/formBuilder");

router.post('/save', validation.formBuilderValidation, controller.Save);
router.get('/list', controller.List);
router.get('/details/:_id', controller.Details);
router.post('/delete', controller.Delete);

module.exports = router
