const router = require('express').Router({ mergeParams: true });
const controller = require('./controller');

router.get('/:type/list', controller.List);
router.get('/:type/details/:slug', controller.Details);

module.exports = router;
