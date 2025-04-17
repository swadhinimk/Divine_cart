const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // Ensure the correct path to upload.js
const Product = require('../models/Product');

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    const formatted = products.map((p) => ({
      _id: p._id,
      name: p.name,
      category: p.category,
      material: p.material,
      price: p.price,
      description: p.description,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      imageUrl: `data:${p.image.contentType};base64,${p.image.data.toString('base64')}`,
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Error fetching products' });
  }
});

// GET product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const formatted = {
      ...product._doc,
      imageUrl: `data:${product.image.contentType};base64,${product.image.data.toString('base64')}`,
    };

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// POST new product
router.post('/', upload.single('image'), async (req, res) => {
  try {
    // Log incoming data for debugging
    console.log('Request Body:', req.body);
    console.log('Uploaded File:', req.file);

    const { name, category, material, price, description } = req.body;

    // Check if the image was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    // Create a new product
    const newProduct = new Product({
      name,
      category,
      material,
      price,
      description,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });

    // Save the new product to the database
    await newProduct.save();

    res.status(201).json(newProduct); // Respond with the newly created product
  } catch (error) {
    console.error('Error saving product:', error);
    res.status(500).json({ error: 'Error saving product' });
  }
});

// UPDATE product
router.put('/:id', async (req, res) => {
  try {
    const { name, category, material, price, description } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, category, material, price, description },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({ error: error.message });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
