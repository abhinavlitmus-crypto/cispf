const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');
const newsletterSubscriberService = require("../../../../services/newsletterSubscriber");

const failedMessage = "We couldn't complete your subscription right now. Please try again in a few minutes.";

// `status` is returned in data (success) or extra (failure) so the website can tell the cases apart.
const outcomes = {
    subscribed: { success: true, code: 200, message: "Thank you for subscribing to the CISPF newsletter." },
    confirmation_required: { success: true, code: 200, message: "Almost done! Please check your inbox and confirm your subscription." },
    already_subscribed: { success: true, code: 200, message: "You're already subscribed to the CISPF newsletter." },
    processing: { success: true, code: 202, message: "We're already processing your subscription. Please check your inbox shortly." },
    unsubscribed: { success: false, code: 409, message: "This email address has unsubscribed from our emails. Please contact us if you'd like to subscribe again." },
    ineligible: { success: false, code: 422, message: "We couldn't subscribe this email address. Please check it or use a different one." },
    failed: { success: false, code: 503, message: failedMessage },
};

class newsletterController {
    static async Subscribe(req, res) {
        try {
            const { outcome } = await newsletterSubscriberService.subscribe({ name: req.body.name, email: req.body.email });
            const { success, code, message } = outcomes[outcome] || outcomes.failed;

            if (success) Response.success(res, { message, code, data: { status: outcome } });
            else Response.fail(res, { message, code, extra: { status: outcome } });
        } catch (err) {
            console.error(`Newsletter: subscription failed - ${err.message}`);
            Response.fail(res, Response.createError({ ...Message.internalServerError, message: failedMessage, extra: { status: "failed" } }, err));
        }
    }
}

module.exports = newsletterController;
