const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    material: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: {
      data: { type: Buffer, required: true },
      contentType: { type: String, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
