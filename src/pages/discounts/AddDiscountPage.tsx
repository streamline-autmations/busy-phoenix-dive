import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Product {
  name: string;
  price: number | null; // null means coming soon / no price
  slug: string;
  category: string;
  inStock: boolean;
}

const products: Product[] = [
  { name: "Prep & Primer Bundle", price: 370, slug: "prep-primer-bundle", category: "bundle-deals", inStock: true },
  { name: "Cuticle Oil", price: 140, slug: "cuticle-oil", category: "prep-finishing", inStock: true },
  { name: "Vitamin Primer", price: 210, slug: "vitamin-primer", category: "prep-finishing", inStock: true },
  { name: "Prep Solution (Nail Dehydrator)", price: 200, slug: "prep-solution", category: "prep-finishing", inStock: true },
  { name: "Top Coat", price: 190, slug: "top-coat", category: "gel-system", inStock: true },
  { name: "Fairy Dust Top Coat", price: 195, slug: "fairy-dust-top-coat", category: "gel-system", inStock: true },
  { name: "Nail File (80/80 Grit)", price: 35, slug: "nail-file", category: "tools-essentials", inStock: true },
  { name: "Nail Forms", price: 290, slug: "nail-forms", category: "tools-essentials", inStock: true },
  { name: "Acetone (Remover)", price: 60, slug: "acetone-remover", category: "tools-essentials", inStock: true },
  { name: "Core Acrylics (56 g)", price: 280, slug: "core-acrylics", category: "acrylic-system", inStock: true },
  { name: "Nail Liquid (Monomer)", price: null, slug: "nail-liquid-monomer", category: "coming-soon", inStock: false },
  { name: "Crystal Kolinsky Sculpting Brush", price: 450, slug: "crystal-kolinsky-sculpting-brush", category: "tools-essentials", inStock: true },
  { name: "Rose Petal Manicure Table", price: 2590, slug: "rose-petal-manicure-table", category: "furniture", inStock: true },
  { name: "Iris Manicure Table", price: 3490, slug: "iris-manicure-table", category: "furniture", inStock: true },
  { name: "Blom Manicure Table & Work Station", price: 4500, slug: "blom-manicure-workstation", category: "furniture", inStock: true },
  { name: "Daisy Manicure Table", price: 2700, slug: "daisy-manicure-table", category: "furniture", inStock: true },
  { name: "Polish Garden (Gel Polish Rack)", price: 1150, slug: "polish-garden-rack", category: "furniture", inStock: true },
  { name: "Blossom Manicure Table", price: 5200, slug: "blossom-manicure-table", category: "furniture", inStock: true },
  { name: "Pearly Pedicure Station", price: 4800, slug: "pearly-pedicure-station", category: "furniture", inStock: true },
  { name: "Princess Dresser", price: 7400, slug: "princess-dresser", category: "furniture", inStock: true },
  { name: "Floral Manicure Table", price: 4300, slug: "floral-manicure-table", category: "furniture", inStock: true },
  { name: "Orchid Manicure Table", price: 3700, slug: "orchid-manicure-table", category: "furniture", inStock: true },
];

export default function AddDiscountPage() {
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [discountedPrice, setDiscountedPrice] = useState<string>("");

  const selectedProduct = products.find((p) => p.slug === selectedSlug);

  useEffect(() => {
    // Reset discounted price when product changes
    setDiscountedPrice("");
  }, [selectedSlug]);

  function handlePublish() {
    if (!selectedProduct) {
      alert("Please select a product");
      return;
    }
    const originalPrice = selectedProduct.price;
    const discount = Number(discountedPrice);
    if (isNaN(discount) || discount <= 0) {
      alert("Please enter a valid discounted price");
      return;
    }
    if (originalPrice !== null && discount >= originalPrice) {
      alert("Discounted price must be less than original price");
      return;
    }
    alert(`Publishing discount for ${selectedProduct.name}:\nOriginal Price: R${originalPrice}\nDiscounted Price: R${discount.toFixed(2)}`);
    // TODO: connect to backend webhook or API here
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <main className="container mx-auto p-6 max-w-lg flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Add Discount</h1>

        <div>
          <Label htmlFor="product-select">Select Product</Label>
          <Select value={selectedSlug} onValueChange={setSelectedSlug}>
            <SelectTrigger id="product-select" aria-label="Select product">
              <SelectValue placeholder="Choose a product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.slug} value={product.slug} disabled={!product.inStock}>
                  {product.name} {product.price !== null ? `— R${product.price}` : "(Coming Soon)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedProduct && (
          <div>
            <Label>Current Price</Label>
            <div className="p-2 bg-white border rounded text-lg font-semibold">
              {selectedProduct.price !== null ? `R${selectedProduct.price}` : "Coming Soon"}
            </div>
          </div>
        )}

        {selectedProduct && selectedProduct.price !== null && (
          <div>
            <Label htmlFor="discounted-price">Discounted Price</Label>
            <Input
              id="discounted-price"
              type="number"
              min={0}
              step={0.01}
              value={discountedPrice}
              onChange={(e) => setDiscountedPrice(e.target.value)}
              placeholder="Enter discounted price"
            />
          </div>
        )}

        <Button onClick={handlePublish} disabled={!selectedProduct || selectedProduct.price === null || discountedPrice.trim() === ""}>
          Publish Discount
        </Button>
      </main>
    </div>
  );
}