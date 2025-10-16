import React, { useState } from "react";

export interface FurnitureProductDetailPageProps {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  overview: string;
  price: number;
  compareAtPrice?: number | null;
  stock: string;
  images: string[];
  features: string[];
  dimensions: {
    length: string;
    width: string;
    height: string;
    weight: string;
    additional?: string;
  };
  materialsFinish: {
    materials: string[];
    finish: string[];
    care: string[];
  };
  productionDelivery: {
    production: string[];
    delivery: string[];
    warranty: string[];
  };
  variants?: { name: string; image: string }[];
  rating?: number;
  reviewCount?: number;
}

export const FurnitureProductDetailPage: React.FC<FurnitureProductDetailPageProps> = ({
  id,
  name,
  slug,
  category,
  shortDescription,
  overview,
  price,
  compareAtPrice = null,
  stock,
  images,
  features,
  dimensions,
  materialsFinish,
  productionDelivery,
  variants = [],
  rating = 0,
  reviewCount = 0,
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("overview");

  const formatPrice = (price: number) => `R${price.toFixed(2)}`;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">{name}</h1>
        </div>
      </header>

      <main className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden">
                <img
                  src={images[selectedImage]}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>

              {images.length > 1 && (
                <div className="flex gap-3">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index
                          ? "border-pink-400"
                          : "border-gray-200"
                      }`}
                      aria-label={`View image ${index + 1}`}
                    >
                      <img
                        src={image}
                        alt={`${name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1" aria-label={`Rating: ${rating} out of 5`}>
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-yellow-400 ${
                          i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="text-sm text-gray-600 ml-2">
                      {rating} ({reviewCount} reviews)
                    </span>
                  </div>
                </div>

                <p className="text-lg text-gray-600">{shortDescription}</p>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(price)}
                </span>
                {compareAtPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(compareAtPrice)}
                  </span>
                )}
              </div>

              {/* Variants */}
              {variants.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Choose Finish:
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {variants.map((variant, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedVariant(variant.name)}
                        className={`px-4 py-2 rounded-full border-2 transition-colors ${
                          selectedVariant === variant.name
                            ? "border-pink-400 bg-pink-50 text-pink-600"
                            : "border-gray-200 text-gray-700 hover:border-pink-300"
                        }`}
                      >
                        {variant.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-lg font-semibold text-gray-900">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-50"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-gray-50"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  className="w-full bg-pink-400 hover:bg-pink-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-lg"
                  aria-label={`Add ${quantity} ${name} to cart for ${formatPrice(price * quantity)}`}
                >
                  Add to Cart - {formatPrice(price * quantity)}
                </button>
              </div>

              {/* Features */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Key Features:
                </h3>
                <ul className="space-y-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <span className="text-green-500">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Product Information Tabs - FURNITURE SECTIONS */}
          <div className="mt-12">
            <div className="flex flex-wrap gap-2 mb-8">
              {[
                "overview",
                "features",
                "dimensions",
                "materials-finish",
                "production-delivery",
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-full font-semibold transition-colors ${
                    activeTab === tab
                      ? "bg-pink-400 text-white"
                      : "bg-white text-gray-700 hover:bg-pink-50"
                  }`}
                  aria-pressed={activeTab === tab}
                >
                  {tab
                    .replace("-", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              {activeTab === "overview" && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Product Overview
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{overview}</p>
                </div>
              )}

              {activeTab === "features" && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Features & Benefits
                  </h3>
                  <ul className="space-y-3">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-green-500 mt-1">✓</span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === "dimensions" && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Dimensions
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="text-pink-400">📏</span>
                        <div>
                          <span className="text-gray-600">Length:</span>
                          <span className="ml-2 font-semibold text-gray-900">
                            {dimensions.length}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-pink-400">📏</span>
                        <div>
                          <span className="text-gray-600">Width:</span>
                          <span className="ml-2 font-semibold text-gray-900">
                            {dimensions.width}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-pink-400">📏</span>
                        <div>
                          <span className="text-gray-600">Height:</span>
                          <span className="ml-2 font-semibold text-gray-900">
                            {dimensions.height}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-pink-400">📦</span>
                        <div>
                          <span className="text-gray-600">Weight:</span>
                          <span className="ml-2 font-semibold text-gray-900">
                            {dimensions.weight}
                          </span>
                        </div>
                      </div>
                    </div>
                    {dimensions.additional && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">
                          Additional Information:
                        </h4>
                        <p className="text-gray-700">{dimensions.additional}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "materials-finish" && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Materials & Finish
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        Materials:
                      </h4>
                      <ul className="space-y-2">
                        {materialsFinish.materials.map((material, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-3"
                          >
                            <span className="text-green-500 mt-1">✓</span>
                            <span className="text-gray-700">{material}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        Finish:
                      </h4>
                      <ul className="space-y-2">
                        {materialsFinish.finish.map((finish, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-3"
                          >
                            <span className="text-green-500 mt-1">✓</span>
                            <span className="text-gray-700">{finish}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        Care Instructions:
                      </h4>
                      <ul className="space-y-2">
                        {materialsFinish.care.map((care, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-3"
                          >
                            <span className="text-blue-500 mt-1">✓</span>
                            <span className="text-gray-700">{care}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "production-delivery" && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Production & Delivery
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        Production:
                      </h4>
                      <ul className="space-y-2">
                        {productionDelivery.production.map((item, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-3"
                          >
                            <span className="text-green-500 mt-1">✓</span>
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        Delivery:
                      </h4>
                      <ul className="space-y-2">
                        {productionDelivery.delivery.map((item, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-3"
                          >
                            <span className="text-blue-500 mt-1">🚚</span>
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        Warranty:
                      </h4>
                      <ul className="space-y-2">
                        {productionDelivery.warranty.map((item, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-3"
                          >
                            <span className="text-purple-500 mt-1">🛡️</span>
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};