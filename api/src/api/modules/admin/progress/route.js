const router = require('express').Router({ mergeParams: true });
const controller = require('./controller');

router.get('/user/:userId', controller.UserProgress);

module.exports = router
