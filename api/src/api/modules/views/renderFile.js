const ejs = require("ejs");
const path = require("path");
async function renderResetPasswordForm(data) {
    return await ejs.renderFile(path.join(__dirname, 'resetPassword.ejs'), { ...data });
}

module.exports = {
    renderResetPasswordForm
}