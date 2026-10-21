const router = require('express').Router({ mergeParams: true });
const controller = require('./controller');
const validation = require("../../../middlewares/validation/newsletter");

router.post('/save', validation.newsletterValidation, controller.Save);
router.get('/list', controller.List);
router.get('/details/:_id', controller.Details);
router.post('/delete', controller.Delete);
router.get('/preview', controller.Preview);
router.get('/preview/:_id', controller.Preview);
router.post('/send', validation.sendValidation, controller.Send);

module.exports = router;
