const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema(
  {
    ip: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { strict: false, timestamps: true }
);

module.exports =
  mongoose.models.History || mongoose.model("History", HistorySchema);
