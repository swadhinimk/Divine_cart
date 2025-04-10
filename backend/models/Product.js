const mongoose = require('mongoose');

// Define the schema for a Product
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  material: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true, // Path to the image, e.g. "/uploads/image123.jpg"
  },
}, {
  timestamps: true, // adds createdAt and updatedAt fields
});

// Create and export the model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
