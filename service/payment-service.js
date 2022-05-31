const Razorpay = require("razorpay");
const crypto = require("crypto");
const { calculateTicketCost } = require("./ticket-cost-service");

class PaymentService {
  async createPaymentOrder(email) {
    const amount = await calculateTicketCost(email);
    const options = {
      amount: amount,
      currency: "INR",
      payment_capture: "1",
    };
    const instance = new Razorpay({
      key_id: process.env.RZR_KEY_ID,
      key_secret: process.env.RZR_KEY_SECRET,
    });
    const order = await instance.orders.create(options);
    if (!order) {
      return {
        status: false,
        message: "Error in creating order",
      };
    }
    return {
      status: true,
      orderId: order,
    };
  }

  async getOrder_Id_From_Payment_Id(razorpay_payment_id) {
    const instance = new Razorpay({
      key_id: process.env.RZR_KEY_ID,
      key_secret: process.env.RZR_KEY_SECRET,
    });
    const payment = await instance.payments.fetch(razorpay_payment_id);
    return payment.order_id;
  }

  async getOrderPaymentDetails(orderId) {
    const instance = new Razorpay({
      key_id: process.env.RZR_KEY_ID,
      key_secret: process.env.RZR_KEY_SECRET,
    });
    const order = await instance.orders.fetchPayments(orderId);

    const response = order.items.filter((item) => item.status !== "failed");
    if (!response.length > 0) {
      return {
        status: false,
        message: "Error in fetching order",
      };
    }
    return {
      status: true,
      order,
    };
  }

  async verifyPaymentSignature(
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature
  ) {
    const hmac = crypto.createHmac("sha256", process.env.RZR_KEY_SECRET);

    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");
    return generatedSignature === razorpay_signature;
  }
}

module.exports = new PaymentService();
