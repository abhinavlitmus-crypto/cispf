const router = require('express').Router({ mergeParams: true });
const controller = require('./controller');
const validation = require("../../../middlewares/validation/assessmentSubmission");

router.get('/list', controller.List);
router.get('/details/:_id', controller.Details);
router.post('/submit', validation.assessmentSubmitValidation, controller.Submit);
router.get('/submissions/:assignmentId', controller.Submissions);

module.exports = router
