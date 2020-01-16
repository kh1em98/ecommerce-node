const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, index: true, unique: true },
  description: Array,
  total_reviews: { type: Number, default: 0 },
  average_review: { type: Number, default: 0 },
  pricing: {
    retail: String,
    sale: String,
    discount: String
  },
  price_history: Array,
  category: String,
  img: String
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
