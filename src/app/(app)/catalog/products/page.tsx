"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Link } from "react-router-dom";

type Product = {
  id: string;
  name: string;
  status: "draft" | "active" | "archived";
  price_cents: number;
};

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    supabase.from("products").select("id,name,status,price_cents").then(({ data }: { data: Product[] | null }) => {
      setItems(data || []);
    });
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Products</h1>
        <Link to="/catalog/products/new" className="inline-flex rounded-lg border bg-white px-3 py-2 text-sm hover:bg-neutral-50">New Product</Link>
      </div>
      <div className="rounded-2xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-3 py-2">{p.name}</td>
                <td className="px-3 py-2"><span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs">{p.status}</span></td>
                <td className="px-3 py-2 text-right">R {(p.price_cents / 100).toFixed(2)}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-center text-neutral-500" colSpan={3}>No products yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}