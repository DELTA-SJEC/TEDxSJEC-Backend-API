const AWS = require("aws-sdk");
const { TicketEmailSuccess } = require("./email-template-service");

exports.emailViaAWS_SES_Success = (email, payment_id, site_url) => {
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
          Data: TicketEmailSuccess(site_url, payment_id),
        },
        Text: {
          Charset: "UTF-8",
          Data: "Payment Success for TEDxSJEC",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Payment Success for TEDxSJEC",
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
