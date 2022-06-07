const fs = require("fs");
const util = require("util");
const Payment = require("../database/models/Payment");
const PaymentService = require("../service/payment-service");
// const ImageService = require("../service/image-service");
const { ValidatePaymentSuccess } = require("../service/validator");
const { customLogger } = require("../service/error-log-service");
const { emailViaAWS_SES_Success } = require("../service/email-service-sucess");
const { uploadFile } = require("../service/s3-service");
const unlinkFile = util.promisify(fs.unlink);
const FileName = "payment-controller";

class PaymentController {
  async FreeTicket(req, res) {
    try {
      const { name, email, phone, company } = req.body;
      if (!req.file)
        return res.status(400).json({
          message: "Bad Request, No Image Found",
        });
      const mimetype = req.file.mimetype;
      if (
        !(
          mimetype === "image/png" ||
          mimetype === "image/jpeg" ||
          mimetype === "image/jpg"
        )
      )
        return res.status(400).json({
          message: "Bad Request, Only PNG, JPG and JPEG Allowed",
        });
      const file = req.file;
      const result = await uploadFile(file);
      await unlinkFile(file.path);
      const ticketID = `${company
        .split(" ")
        .join("-")
        .toLowerCase()}-${Date.now()}`;
      await emailViaAWS_SES_Success(
        email,
        ticketID,
        `${process.env.CLIENT_ORIGIN}/ticket/${ticketID}`
      );
      const paymentDataResponse = {
        entity: "collection",
        count: 2,
        items: [
          {
            id: company,
            entity: "payment",
            amount: 0,
            currency: "INR",
            status: "captured",
            order_id: ticketID,
            invoice_id: null,
            international: false,
            method: "Sponsor Payment",
            amount_refunded: 0,
            refund_status: null,
            captured: true,
            description: "TEDxSJEC 2022",
            card_id: null,
            bank: null,
            wallet: null,
            vpa: ticketID,
            email: email,
            contact: phone,
            notes: {
              address: "TEDxSJEC 2022",
            },
            fee: "NA",
            tax: "NA",
            error_code: null,
            error_description: null,
            error_source: null,
            error_step: null,
            error_reason: null,
            acquirer_data: {
              rrn: "NA",
            },
            created_at: Math.round(Date.now() / 1000),
          },
        ],
      };
      const paymentData = await Payment({
        name,
        email,
        phone,
        image: `/images/${result.Key}`,
        qrcode: `/storage/qr/${ticketID}.png`,
        razorpay_order_id: ticketID,
        attendee_flag: false,
        response: paymentDataResponse,
        razorpay_payment_id: company,
        razorpay_signature: "NA",
      });
      await paymentData.save();
      return res.status(200).json({
        message: "Success",
        paymentData: paymentData,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error",
        error: error,
      });
    }
  }

  async PaymentSuccessNonReflect(req, res) {
    try {
      const { name, email, phone, razorpay_payment_id } = req.body;
      if (!req.file)
        return res.status(400).json({
          message: "Bad Request, No Image Found",
        });
      const mimetype = req.file.mimetype;
      if (
        !(
          mimetype === "image/png" ||
          mimetype === "image/jpeg" ||
          mimetype === "image/jpg"
        )
      )
        return res.status(400).json({
          message: "Bad Request, Only PNG, JPG and JPEG Allowed",
        });
      const razorpay_order_id =
        await PaymentService.getOrder_Id_From_Payment_Id(razorpay_payment_id);
      const response = await PaymentService.getOrderPaymentDetails(
        razorpay_order_id
      );
      if (!response.status) {
        return res.status(500).json({
          message: "Error in fetching order",
        });
      }
      if (!response.order.items.length > 0) {
        return res.status(500).json({
          message: "Error in fetching order",
        });
      }
      const file = req.file;
      const result = await uploadFile(file);
      await unlinkFile(file.path);
      // await ImageService.generateQR(razorpay_order_id);
      // await ImageService.generateUserImage(avatar, razorpay_order_id);
      await emailViaAWS_SES_Success(
        email,
        razorpay_payment_id,
        `${process.env.CLIENT_ORIGIN}/ticket/${razorpay_order_id}`
      );
      const paymentData = await Payment({
        name,
        email,
        phone,
        image: `/images/${result.Key}`,
        qrcode: `/storage/qr/${razorpay_order_id}.png`,
        razorpay_order_id,
        attendee_flag: false,
        response: response.order,
        razorpay_payment_id,
        razorpay_signature: "NA",
      });
      await paymentData.save();
      return res.status(200).json({
        message: "Success",
        paymentData: paymentData,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error",
        error: error,
      });
    }
  }

  async PaymentSuccess(req, res) {
    try {
      const {
        name,
        email,
        phone,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      } = req.body;
      if (!req.file)
        return res.status(400).json({
          message: "Bad Request, No Image Found",
        });
      const mimetype = req.file.mimetype;
      if (
        !(
          mimetype === "image/png" ||
          mimetype === "image/jpeg" ||
          mimetype === "image/jpg"
        )
      )
        return res.status(400).json({
          message: "Bad Request, Only PNG, JPG and JPEG Allowed",
        });

      const errors = ValidatePaymentSuccess(
        name,
        email,
        phone,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
      const response = await PaymentService.getOrderPaymentDetails(
        razorpay_order_id
      );
      // const signatureVerified = await PaymentService.verifyPaymentSignature(
      //   razorpay_payment_id,
      //   razorpay_order_id,
      //   razorpay_signature
      // );
      if (!response.status) {
        return res.status(500).json({
          message: "Error in fetching order",
        });
      }
      if (!response.order.items.length > 0) {
        return res.status(500).json({
          message: "Error in fetching order",
        });
      }
      const file = req.file;
      const result = await uploadFile(file);
      await unlinkFile(file.path);
      // await ImageService.generateQR(razorpay_order_id);
      // await ImageService.generateUserImage(avatar, razorpay_order_id);
      await emailViaAWS_SES_Success(
        email,
        razorpay_payment_id,
        `${process.env.CLIENT_ORIGIN}/ticket/${razorpay_order_id}`
      );
      const paymentData = await Payment({
        name,
        email,
        phone,
        image: `/images/${result.Key}`,
        qrcode: `/storage/qr/${razorpay_order_id}.png`,
        razorpay_order_id,
        attendee_flag: false,
        response: response.order,
        razorpay_payment_id,
        razorpay_signature,
      });
      await paymentData.save();
      return res.status(200).json({
        message: "Success",
        paymentData: paymentData,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error",
        error: error,
      });
    }
  }

  async AllPaymentData(req, res) {
    try {
      const paymentData = await Payment.find();
      res.status(200).json({
        message: "Success",
        paymentData: paymentData,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error",
        error: error,
      });
    }
  }

  async Ticket(req, res) {
    const { id } = req.query;
    if (!id) {
      customLogger.error(`${FileName} Ticket: Bad Request`);
      return res.status(400).json({
        message: "Bad Request",
      });
    }
    const paymentData = await Payment.findOne({
      razorpay_order_id: id,
    });
    if (!paymentData)
      return res.status(404).json({
        message: "Ticket Data Not Found",
      });
    return res.status(200).json({
      message: "Success",
      name: paymentData.name,
      email: paymentData.email,
      phone: paymentData.phone,
      image: paymentData.image,
      qrcode: paymentData.qrcode,
      razorpay_order_id: paymentData.razorpay_order_id,
    });
  }

  async FlagChange(req, res) {
    try {
      const { id } = req.query;
      if (!id)
        return res.status(400).json({
          message: "Bad Request",
        });
      const paymentData = await Payment.findOne({
        razorpay_order_id: id,
      });
      if (!paymentData)
        return res.status(404).json({
          message: "Payment Data Not Found",
        });

      if (paymentData.attendee_flag) {
        return res.status(400).json({
          message: "Already Flagged",
        });
      } else {
        paymentData.attendee_flag = true;
        await paymentData.save();
        return res.status(200).json({
          message: "Success",
          paymentData: paymentData,
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: "Error",
        error: error,
      });
    }
  }
}

module.exports = new PaymentController();
