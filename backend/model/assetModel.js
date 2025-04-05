const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema({
  name: String,
  category: String,
  value: Number,
  purchase_date: Date,
  status: { type: String, enum: ["Active", "Disposed"], default: "Active" },
});

module.exports = mongoose.model("Asset", assetSchema);
