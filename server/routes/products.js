import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Helper function to transform reviews to array of strings
const transformReviews = (reviews) => {
  if (!reviews || !Array.isArray(reviews)) {
    return [];
  }
  
  return reviews.map(review => {
    // If review is already a string, return it
    if (typeof review === 'string') {
      return review;
    }
    
    // If review is not an object, skip it
    if (typeof review !== 'object' || review === null) {
      return '';
    }
    
    // If review has a comment field (proper schema), use it
    if (review.comment && typeof review.comment === 'string') {
      return review.comment;
    }
    
    // Handle corrupted data: review stored as object with numeric keys (like "0": "A", "1": "f", etc.)
    // This happens when a string was incorrectly stored as an object
    const allKeys = Object.keys(review);
    const excludeKeys = ['_id', 'date', '__v', 'name', 'rating', 'comment'];
    
    // Check if this looks like corrupted string data (has numeric keys)
    const numericKeys = allKeys.filter(key => {
      if (excludeKeys.includes(key)) {
        return false;
      }
      // Check if key is a pure numeric string (like "0", "1", "2", etc.)
      const num = parseInt(key, 10);
      return !isNaN(num) && String(num) === String(key);
    });
    
    if (numericKeys.length > 0) {
      // Sort keys numerically and reconstruct the string
      const sortedKeys = numericKeys.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
      const reconstructedString = sortedKeys.map(key => {
        const val = review[key];
        return val != null ? String(val) : '';
      }).join('');
      if (reconstructedString && reconstructedString.trim().length > 0) {
        return reconstructedString;
      }
    }
    
    // Fallback: try to find any string value that's not a metadata field
    for (const [key, value] of Object.entries(review)) {
      if (!excludeKeys.includes(key) && typeof value === 'string' && value.length > 0) {
        return value;
      }
    }
    
    return '';
  }).filter(review => review !== '');
};

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

    // Transform reviews to array of strings
    const transformedProducts = products.map(product => ({
      ...product,
      reviews: transformReviews(product.reviews)
    }));

    res.json(transformedProducts);
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
    
    // Transform reviews to array of strings
    const transformedProduct = {
      ...product,
      reviews: transformReviews(product.reviews)
    };
    
    res.json(transformedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new product
router.post('/', async (req, res) => {
  try {
    const { name, price, category, rating, description, reviews, imageUrl, store, brand, link } = req.body;

    const product = new Product({
      name,
      price,
      category,
      rating,
      description,
      reviews: reviews || [],
      imageUrl,
      store,
      brand,
      link
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