const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  productName: { type: String, required: true },
  purchaseDate: { type: Date, required: true },
  productCategory: {
    type: String,
    enum: ['Fresh product', 'Dairy and eggs', 'Meat and seafood', 'Dry goods staples', 'Household and personal care', 'Other'],
    required: true
  },
  preferredBarcode: { type: String },
  purchaseQuantity: { type: Number, required: true },
  restockDate: { type: Date },
  restockQuantity: { type: Number }
});

module.exports = mongoose.model('Inventory', inventorySchema);