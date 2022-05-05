const faculty = process.env.ORG_FT_AMOUNT;
const student = process.env.ORG_ST_AMOUNT;
const other = process.env.OTHER_AMOUNT;

const blockLongUSN = (usn) => {
  console.log(usn);
  if (usn.includes("4so16") || usn.includes("4so17")) return true;
  return false;
};

const blockShortUSN = (usn) => {
  console.log(usn, usn.slice(0, 2));
  const sliceNumber = parseInt(usn.slice(0, 2));
  if (sliceNumber >= 10 && sliceNumber <= 17) return true;
  return false;
};

exports.calculateTicketCost = async (email) => {
  if (email.includes(process.env.ORG_DOMAIN)) {
    const splitRatio = email.split("@")[0].split(".");
    if (splitRatio.length === 1) return faculty;
    else {
      verifyUSN = splitRatio[0];
      if (verifyUSN.length === 10) {
        if (blockLongUSN(verifyUSN.toLowerCase())) return other;
        else return student;
      } else if (verifyUSN.length === 7) {
        if (blockShortUSN(verifyUSN.toLowerCase())) return other;
        else return student;
      } else return student;
    }
  } else return other;
};
