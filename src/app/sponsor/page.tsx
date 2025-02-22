"use client";

import React, { useState } from "react";
import { ShoppingBag, ChevronRight, Leaf } from "lucide-react";
import NavBar from "@/components/NavBar";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  points: number;
  ecoImpact: string;
  imageUrl: string;
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
      name: "Eco-friendly Water Bottle",
      description: "Reduce plastic waste with this reusable bottle",
      price: 25,
      points: 150,
      ecoImpact: "Saves 300 plastic bottles per year",
      imageUrl:
        "https://sarajevski-kiseljak.com/wp-content/uploads/elementor/thumbs/FORT_Sara-Hero-qll5q38xl8ck9vqebtdsfuiw6gs9wnmfkura168q2o.jpg",
    },
    {
      id: 2,
      name: "Solar Power Bank",
      description: "Charge your devices with solar energy",
      price: 45,
      points: 250,
      ecoImpact: "100% renewable energy source",
      imageUrl:
        "https://cdn.teufelaudio.com/image/upload/c_fill,f_auto,q_auto/v1/products/VARTA/Energy_Power_Bank/varta_energy_power_bank-silver-bottom.jpg",
    },
    {
      id: 3,
      name: "Bamboo Cutlery Set",
      description: "Sustainable alternative to plastic utensils",
      price: 15,
      points: 100,
      ecoImpact: "Biodegradable materials",
      imageUrl:
        "https://www.bambuhome.com/cdn/shop/files/054600KnifeForkSpoonNP2048_1024x1024.png?v=1712005685",
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
      alert(
        `Purchased ${selectedProduct.name} for $${selectedProduct.price} USD`
      );
      handleCloseModal();
    }
  };

  return (
    <div className="min-h-screen bg-backgroundDark p-6 text-white">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Eco Store</h1>
          <p className="text-gray-400">Support sustainable products</p>
        </div>
        <div className="bg-backgroundLight px-4 py-2 rounded-full flex items-center">
          <ShoppingBag className="w-4 h-4 text-primaryColor mr-2" />
          <span className="text-sm">550 points</span>
        </div>
      </div>

      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-backgroundLight rounded-lg p-4 shadow-lg hover:bg-backgroundLight/80 transition-colors cursor-pointer"
            onClick={() => handleProductClick(product)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-lg overflow-hidden mr-4 bg-[#FFFFFF07]">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-gray-400">{product.description}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primaryColor">{product.ecoImpact}</p>
                <p className="text-sm text-gray-400">{product.points} points</p>
              </div>
              <button className="bg-primaryColor px-4 py-2 rounded-lg text-sm font-medium hover:bg-primaryColor/70 transition-colors">
                ${product.price} USD
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-backgroundLight p-8 rounded-2xl text-white max-w-md w-full mx-4 shadow-2xl transform animate-slideUp">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-24 h-24 rounded-lg overflow-hidden mb-4">
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Confirm Purchase</h2>
              <p className="text-gray-400">You&apos;re about to purchase:</p>
              <p className="text-xl font-medium mt-2">{selectedProduct.name}</p>
              <p className="text-primaryColor text-2xl font-bold mt-4">
                ${selectedProduct.price} USD
              </p>
            </div>

            <div className="space-y-3">
              <button
                className="w-full bg-primaryColor px-4 py-3 rounded-xl font-medium hover:bg-primaryColor/70 transition-colors"
                onClick={handleConfirmPurchase}
              >
                Confirm Purchase
              </button>
              <button
                className="w-full bg-[#FFFFFF07] px-4 py-3 rounded-xl font-medium hover:bg-[#FFFFFF07]/70 transition-colors"
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
