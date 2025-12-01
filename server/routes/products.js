import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Get all products OR search by one/multiple names
router.get('/', async (req, res) => {
  const searchQuery = req.query.q;

  try {
    let products;

    if (searchQuery) {
      // Split comma-separated search terms
      const searchTerms = searchQuery.split(',').map(term => term.trim());

      // Case-insensitive search for any term
      products = await Product.find({
        name: { $regex: searchTerms.join('|'), $options: 'i' }
      }).lean().sort({ createdAt: -1 });
    } else {
      products = await Product.find().lean().sort({ createdAt: -1 });
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/location', (req, res) => {
  res.json({ location: 'Model Town Lahore' });
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new product
router.post('/', async (req, res) => {
  try {
    const { name, price, category, description, imageUrl, store, brand, email } = req.body;

    const product = new Product({
      name,
      price,
      category,
      description,
      imageUrl,
      store,
      brand,
      email
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
