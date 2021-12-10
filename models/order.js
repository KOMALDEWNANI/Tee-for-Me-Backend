const mongoose = require("mongoose");
const product = require("./product");
const { ObjectId } = mongoose.Schema;
const User = require("./user");

const productCartSchema = new mongoose.Schema({
  product: {
    type: ObjectId,
    ref: product,
  },
  name: String,
  count: Number,
  price: Number,
});

const productCart = mongoose.model("ProductCart", productCartSchema);

const orderSchema = new mongoose.Schema(
  {
    products: [productCartSchema],
    transaction_id: {},
    amount: Number,
    address: String,
    updated: Date,
    status: {
      type: String,
      default: " ",
      enum: ["Cancelled", "Shipped", "Received", "Processing", "Delivered"],
    },
    user: {
      type: ObjectId,
      ref: User,
    },
    
  },
  { timestamps: true }
);

const order = mongoose.model("Order", orderSchema);
module.exports = { productCart, order };
