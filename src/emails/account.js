const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
      sgMail.send({
            to:email,
            from:"vineetkme.99@gmail.com",
            subject:"First SendGrid email",
            text:`Hi ${name}. Hope you see this mail and smile :)`
      })
}

module.exports = { sendWelcomeEmail };
