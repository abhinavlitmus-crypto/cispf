const router = require('express').Router({ mergeParams: true });
const controller = require('./controller');
const validation = require("../../../middlewares/validation/newsletter");
const Response = require('../../../../utilities/Response');

// Limits signups per visitor IP so the public form can't be used to flood the audience.
// Kept in memory, so the limit applies per running server instance.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const attempts = new Map();

function subscribeRateLimit(req, res, next) {
    const now = Date.now();
    const entry = attempts.get(req.ip);

    if (!entry || now - entry.start > WINDOW_MS) {
        attempts.set(req.ip, { start: now, count: 1 });
    } else if (++entry.count > MAX_ATTEMPTS) {
        return Response.fail(res, { message: "Too many attempts. Please try again in a few minutes.", code: 429, extra: { status: "rate_limited" } });
    }

    if (attempts.size > 10000) {
        for (const [ip, value] of attempts) if (now - value.start > WINDOW_MS) attempts.delete(ip);
    }
    next();
}

router.post('/subscribe', subscribeRateLimit, validation.subscribeValidation, controller.Subscribe);

module.exports = router;
