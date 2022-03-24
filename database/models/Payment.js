const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    qrcode: {
      type: String,
      required: true,
      trim: true,
    },
    razorpay_order_id: {
      type: String,
      required: true,
      trim: true,
    },
    attendee_flag: {
      type: Boolean,
      required: true,
      trim: true,
    },
  },
  { strict: false, timestamps: true }
);

module.exports =
  mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
