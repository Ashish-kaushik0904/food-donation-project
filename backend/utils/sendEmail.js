const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, text) => {
  try {
    await resend.emails.send({
      from: 'FoodBridge <onboarding@resend.dev>',
      to,
      subject,
      text
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.log(`❌ Email failed to ${to}:`, error.message);
  }
};

module.exports = sendEmail;