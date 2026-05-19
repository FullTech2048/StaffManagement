const { Resend } = require("resend");
const { resendApiKey, resendFromEmail } = require("../config/env");

const resend = resendApiKey ? new Resend(resendApiKey) : null;

const sendAdminWelcomeEmail = async ({ email, fullName }) => {
  if (!resend) {
    return;
  }

  await resend.emails.send({
    from: resendFromEmail,
    to: email,
    subject: "Your Staff Management admin account is ready",
    html: `
      <p>Hello ${fullName},</p>
      <p>Your Staff Management admin account has been created.</p>
      <p>You can now sign in with your email and password.</p>
    `,
  });
};

module.exports = {
  sendAdminWelcomeEmail,
};
