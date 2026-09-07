const router = require('express').Router({ mergeParams: true });
const controller = require('./controller');



router.get('/list', controller.List);
router.get('/details/:_id', controller.Details);


module.exports = router
