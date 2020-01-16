const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  name: String,
  address: String,
  phone: String,
  date: {
    type: Date
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product"
    }
  ],
  prices: [
    {
      type: String
    }
  ],
  total_price: {
    type: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
