'use client';

import React, { useState } from 'react';
import { ShoppingBag, ChevronRight, Leaf } from 'lucide-react';
import NavBar from '@/components/NavBar';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  points: number;
  ecoImpact: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const SponsorProducts: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const products: Product[] = [
    {
      id: 1,
      name: 'Eco-friendly Water Bottle',
      description: 'Reduce plastic waste with this reusable bottle',
      price: 25,
      points: 150,
      ecoImpact: 'Saves 300 plastic bottles per year',
    },
    {
      id: 2,
      name: 'Solar Power Bank',
      description: 'Charge your devices with solar energy',
      price: 45,
      points: 250,
      ecoImpact: '100% renewable energy source',
    },
    {
      id: 3,
      name: 'Bamboo Cutlery Set',
      description: 'Sustainable alternative to plastic utensils',
      price: 15,
      points: 100,
      ecoImpact: 'Biodegradable materials',
    },
  ];

  const handleProductClick = (product: Product): void => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleConfirmPurchase = (): void => {
    if (selectedProduct) {
      alert(`Purchased ${selectedProduct.name} for $${selectedProduct.price} USD`);
      handleCloseModal();
    }
  };

  return (
    <div className='min-h-screen bg-gray-900 p-6 text-white'>
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-2xl font-semibold'>Eco Store</h1>
          <p className='text-gray-400'>Support sustainable products</p>
        </div>
        <div className='bg-gray-800 px-4 py-2 rounded-full flex items-center'>
          <ShoppingBag className='w-4 h-4 text-emerald-500 mr-2' />
          <span className='text-sm'>550 points</span>
        </div>
      </div>

      <div className='space-y-4'>
        {products.map((product) => (
          <div
            key={product.id}
            className='bg-gray-800 rounded-lg p-4 shadow-lg hover:bg-gray-800/80 transition-colors cursor-pointer'
            onClick={() => handleProductClick(product)}
          >
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center'>
                <div className='w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mr-4'>
                  <Leaf className='w-6 h-6 text-emerald-500' />
                </div>
                <div>
                  <h3 className='font-medium'>{product.name}</h3>
                  <p className='text-sm text-gray-400'>{product.description}</p>
                </div>
              </div>
              <ChevronRight className='w-5 h-5 text-gray-400' />
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-emerald-500'>{product.ecoImpact}</p>
                <p className='text-sm text-gray-400'>{product.points} points</p>
              </div>
              <button className='bg-emerald-500 px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors'>
                ${product.price} USD
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className='fixed bottom-0 left-0 right-0 bg-gray-800 p-4'>
        <div className='flex justify-between items-center max-w-md mx-auto'>
          <div>
            <p className='text-sm text-gray-400'>Total available</p>
            <p className='font-medium'>550 points</p>
          </div>
          <button className='bg-emerald-500 px-6 py-3 rounded-lg font-medium hover:bg-emerald-600 transition-colors'>
            View Cart
          </button>
        </div>
      </div>

      {isModalOpen && selectedProduct && (
        <div className='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn'>
          <div className='bg-gray-800 p-8 rounded-2xl text-white max-w-md w-full mx-4 shadow-2xl transform animate-slideUp'>
            <div className='flex flex-col items-center text-center mb-6'>
              <div className='w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4'>
                <Leaf className='w-8 h-8 text-emerald-500' />
              </div>
              <h2 className='text-2xl font-semibold mb-2'>Confirm Purchase</h2>
              <p className='text-gray-400'>You&apos;re about to purchase:</p>
              <p className='text-xl font-medium mt-2'>{selectedProduct.name}</p>
              <p className='text-emerald-500 text-2xl font-bold mt-4'>
                ${selectedProduct.price} USD
              </p>
            </div>

            <div className='space-y-3'>
              <button
                className='w-full bg-emerald-500 px-4 py-3 rounded-xl font-medium hover:bg-emerald-600 transition-colors'
                onClick={handleConfirmPurchase}
              >
                Confirm Purchase
              </button>
              <button
                className='w-full bg-gray-700 px-4 py-3 rounded-xl font-medium hover:bg-gray-600 transition-colors'
                onClick={handleCloseModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <NavBar />
    </div>
  );
};

export default SponsorProducts;
