const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  password: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String },
  phone: { type: String },
  img: { type: String },
  name: { type: String },
  cart: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
  reviews: [{ type: Schema.Types.ObjectId, ref: "Product" }]
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
