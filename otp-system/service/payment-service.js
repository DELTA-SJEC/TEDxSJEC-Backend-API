const Razorpay = require("razorpay");

class PaymentService {
  async createPaymentOrder(email) {
    let amount = process.env.OTHER_AMOUNT;
    if (email.includes(process.env.ORG_DOMAIN)) {
      let checkForEmail = email.split("@")[0].split(".");
      if (checkForEmail.length > 1) amount = process.env.ORG_ST_AMOUNT;
      else amount = process.env.ORG_FT_AMOUNT;
    }
    const instance = new Razorpay({
      key_id: process.env.RZR_KEY_ID,
      key_secret: process.env.RZR_KEY_SECRET,
    });
    const options = {
      amount: amount,
      currency: "INR",
      payment_capture: "1",
    };
    const order = await instance.orders.create(options);
    if (!order) {
      return {
        status: false,
        message: "Error in creating order",
      };
    }
    return {
      status: true,
      orderId: order.id,
    };
  }
}

module.exports = new PaymentService();
