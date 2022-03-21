const nodemailer = require("nodemailer");

exports.sendOtpOverEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    text: "TEDxSJEC OTP is " + otp,
    html: "<b>This is some HTML</b>",
  };

  // Send e-mail using SMTP
  mailOptions.subject = "Nodemailer SMTP transporter";
  var smtpTransporter = nodemailer.createTransport({
    port: 465,
    host: process.env.AWS_REGION,
    secure: true,
    auth: {
      user: process.env.AWS_ACCESS_KEY_ID,
      pass: process.env.AWS_SECRET_ACCESS_KEY,
    },
    debug: true,
  });

  smtpTransporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return {
        flag: false,
        message: "Error sending email",
        status: error.responseCode,
        desc: error.response,
      };
    } else {
      return {
        flag: true,
        message: "Email sent",
        status: info.responseCode,
        desc: info.response,
      };
    }
  });
};
