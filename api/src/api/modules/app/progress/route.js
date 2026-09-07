const router = require('express').Router({ mergeParams: true });
const controller = require('./controller');
const validation = require("../../../middlewares/validation/progress");

router.post('/update', validation.progressUpdateValidation, controller.Update);
router.get('/course/:courseId', controller.CourseProgress);
router.get('/list', controller.List);

module.exports = router
