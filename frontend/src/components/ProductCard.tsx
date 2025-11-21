import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MessageCircle } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  rating: number;
  description: string;
  reviews: Array<{
    name: string;
    rating: number;
    comment: string;
    date: string;
  }>;
  imageUrl: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.round(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleViewDetails = () => {
    // convert product name into URL-friendly string
    const productName = product.name.toLowerCase().replace(/\s+/g, '-');
    navigate(`/product/${productName}`);
  };

  return (
    <div className="bg-magenta-300 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <span className="bg-yellow-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            {product.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-green-600">
            ${product.price.toFixed(2)}
          </span>
          <div className="flex items-center space-x-1">
            {renderStars(product.rating)}
            <span className="text-sm text-gray-500 ml-1">
              ({product.rating.toFixed(1)})
            </span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-1 text-gray-500">
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm">
              {product.reviews.length} review{product.reviews.length !== 1 ? 's' : ''}
            </span>
          </div>
          <button onClick={handleViewDetails} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;