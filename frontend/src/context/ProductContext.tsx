import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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
  createdAt: string;
}

interface ProductContextType {
  products: Product[];
  loading: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, '_id' | 'createdAt'>) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'https://shophub-nrma.onrender.com/api';

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product: Omit<Product, '_id' | 'createdAt'>) => {
    try {
      const response = await axios.post(`${API_URL}/products`, product);
      setProducts(prev => [response.data, ...prev]);
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const value = {
    products,
    loading,
    fetchProducts,
    addProduct
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
