const router = require("express").Router({ mergeParams: true });
const controller = require("./controller");

router.get("/", controller.List);

module.exports = router;