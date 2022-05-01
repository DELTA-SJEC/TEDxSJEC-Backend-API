exports.calculateTicketCost = async (email) => {
  let amount = process.env.OTHER_AMOUNT;
  if (email.includes(process.env.ORG_DOMAIN)) {
    let checkForEmail = email.split("@")[0].split(".");
    if (checkForEmail.length > 1) amount = process.env.ORG_ST_AMOUNT;
    else amount = process.env.ORG_FT_AMOUNT;
  }

  return amount;
};
