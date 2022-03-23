const AWS = require("aws-sdk");
const { OtpEmailTemplate } = require("./email-template-service");

exports.emailViaAWS_SES = (email, otp) => {
  console.log(email, otp);
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  const ses = new AWS.SES({ apiVersion: "2010-12-01" });
  const params = {
    Destination: {
      ToAddresses: [email], // Email address/addresses that you want to send your email
    },
    Message: {
      Body: {
        Html: {
          // HTML Format of the email
          Charset: "UTF-8",
          Data: OtpEmailTemplate(otp),
        },
        Text: {
          Charset: "UTF-8",
          Data: "One Time Password(OTP) for TEDxSJEC",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "One Time Password(OTP) for TEDxSJEC",
      },
    },
    Source: process.env.EMAIL_FROM,
  };

  const sendEmailReceiver = ses.sendEmail(params).promise();

  sendEmailReceiver
    .then((data) => {
      console.log("Email sent! Message ID: ", data.MessageId);
    })
    .catch((err) => {
      console.error(err, err.stack);
    });
};
