const validator = require("validator");

exports.validateEmailPhone = (email, phone) => {
  let errors = [];
  switch (true) {
    case !email:
      errors.push("Email is required");
      break;
    case !validator.isEmail(email):
      errors.push("Email is invalid");
      break;
    case !phone:
      errors.push("Phone is required");
      break;
    case !validator.isMobilePhone(phone, "en-IN"):
      errors.push("Phone is invalid");
      break;
  }
  return errors;
};

exports.ValidatePaymentSuccess = (
  name,
  email,
  phone,
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature
) => {
  let errors = [];
  switch (true) {
    case !name:
      errors.push("Name is required");
      break;
    case !email:
      errors.push("Email is required");
      break;
    case !validator.isEmail(email):
      errors.push("Email is invalid");
      break;
    case !phone:
      errors.push("Phone is required");
      break;
    case !validator.isMobilePhone(phone, "en-IN"):
      errors.push("Phone is invalid");
      break;
    case !razorpay_order_id:
      errors.push("Razorpay order id is required");
      break;
    case !razorpay_payment_id:
      errors.push("Razorpay payment id is required");
      break;
    case !razorpay_signature:
      errors.push("Razorpay signature is required");
      break;
  }
  return errors;
};
