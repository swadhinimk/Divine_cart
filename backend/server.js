require('dotenv').config(); // Load .env variables

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const app = express();

// Enable CORS
app.use(cors({ origin: process.env.CLIENT }));

// Use JSON for incoming requests
app.use(express.json());

// Serve static files (like images) from the 'uploads' directory
app.use('/images', express.static(path.join(__dirname, process.env.UPLOADS_FOLDER)));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// Multer Storage Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, process.env.UPLOADS_FOLDER);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  }
});
const upload = multer({ storage });

// Mongoose Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  material: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

// API: Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).send('Error fetching products');
  }
});

// API: Get single product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) res.json(product);
    else res.status(404).send('Product not found');
  } catch (err) {
    res.status(500).send('Error fetching product');
  }
});

// API: Add new product
app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    const { name, category, material, price, description } = req.body;
    if (!req.file) return res.status(400).send('Image is required');

    const imageUrl = `/images/${req.file.filename}`;
    const newProduct = new Product({ name, category, material, price, description, imageUrl });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).send('Error adding product');
  }
});

// API: Update product by ID
app.put('/api/products/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, category, material, price, description } = req.body;
    const updateData = { name, category, material, price, description };

    if (req.file) {
      updateData.imageUrl = `/images/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).send('Product not found');
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).send('Error updating product');
  }
});

// API: Delete product by ID
app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (product) res.status(200).json({ message: 'Product deleted successfully' });
    else res.status(404).send('Product not found');
  } catch (err) {
    res.status(500).send('Error deleting product');
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
