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
