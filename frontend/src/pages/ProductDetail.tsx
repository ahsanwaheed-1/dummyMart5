import React from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { Star, MessageCircle, Loader2 } from 'lucide-react';

const ProductDetail: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const { products, loading } = useProducts(); // ✅ include loading from context

  // If still loading products, show spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <span className="ml-3 text-lg font-medium text-gray-700">
          Loading product...
        </span>
      </div>
    );
  }

  // Find product by name (case-insensitive, slugified)
  const product = products.find(
    (p) => p.name.toLowerCase().replace(/\s+/g, '-') === name?.toLowerCase()
  );

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-800">Product not found</h2>
        <p className="text-gray-600">
          Go back to{' '}
          <a href="/" className="text-blue-600 hover:underline">
            Home
          </a>
        </p>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < Math.round(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 bg-yellow-200">
      {/* Product Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-96 object-cover rounded-xl shadow-md"
        />

        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-lg text-gray-600 mb-4">{product.category}</p>
          <div className="flex items-center space-x-2 mb-4">
            {renderStars(product.rating)}
            <span className="text-sm text-gray-500">
              ({product.rating.toFixed(1)})
            </span>
          </div>
          <p className="text-2xl font-bold text-green-600 mb-6">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-gray-700 mb-6">{product.description}</p>

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            Buy Now
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <MessageCircle className="h-6 w-6 mr-2 text-blue-600" />
          Reviews ({product.reviews.length})
        </h2>
        {product.reviews.length === 0 ? (
          <p className="text-gray-600">No reviews yet.</p>
        ) : (
          <div className="space-y-6">
            {product.reviews.map((review, idx) => (
              <div key={idx} className="border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800">{review.name}</span>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <div className="flex items-center mb-1">
                  {renderStars(review.rating)}
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
