import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  category: { 
    type: String, 
    required: true,
    trim: true
  },
  rating: { 
    type: Number, 
    required: true,
    min: 0,
    max: 5,
    default: 0
  },
  description: { 
    type: String, 
    required: true,
    trim: true
  },
  reviews: [reviewSchema],
  imageUrl: { 
    type: String, 
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Product', productSchema, 'products5');