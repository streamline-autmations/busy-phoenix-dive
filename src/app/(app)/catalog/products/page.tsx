"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type Product = {
  id: string;
  name: string;
  status: "draft" | "active" | "archived";
  price_cents: number;
  compare_at_price_cents: number | null;
  stock_qty: number;
  created_at: string;
};

const statusColors: Record<string, string> = {
  draft: "bg-gray-300 text-gray-700",
  active: "bg-green-300 text-green-900",
  archived: "bg-red-300 text-red-900",
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  async function fetchProducts() {
    setLoading(true);
    let query = supabase.from("products").select("id,name,status,price_cents,compare_at_price_cents,stock_qty,created_at");
    if (statusFilter) {
      query = query.eq("status", statusFilter);
    }
    if (searchTerm.trim()) {
      query = query.ilike("name", `%${searchTerm.trim()}%`);
    }
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) {
      toast.error(`Failed to load products: ${error.message}`);
      setProducts([]);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchProducts();
  }, [statusFilter, searchTerm]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Products</h1>
        <Button onClick={() => navigate("/catalog/products/new")}>New Product</Button>
      </div>

      <div className="flex gap-4">
        <select
          className="rounded border px-3 py-1"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>

        <Input
          type="search"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search products by name"
        />
      </div>

      <table className="w-full text-left border-collapse border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="border border-gray-300 px-3 py-2">Name</th>
            <th className="border border-gray-300 px-3 py-2">Status</th>
            <th className="border border-gray-300 px-3 py-2 text-right">Price</th>
            <th className="border border-gray-300 px-3 py-2 text-right">Compare At</th>
            <th className="border border-gray-300 px-3 py-2 text-right">Stock</th>
            <th className="border border-gray-300 px-3 py-2 text-right">Created</th>
            <th className="border border-gray-300 px-3 py-2">Edit</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={7} className="text-center py-4 text-gray-500">
                Loading...
              </td>
            </tr>
          )}
          {!loading && products.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-4 text-gray-500">
                No products found
              </td>
            </tr>
          )}
          {!loading &&
            products.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="border border-gray-300 px-3 py-2">{p.name}</td>
                <td className="border border-gray-300 px-3 py-2">
                  <Badge className={statusColors[p.status]}>{p.status}</Badge>
                </td>
                <td className="border border-gray-300 px-3 py-2 text-right">
                  R {(p.price_cents / 100).toFixed(2)}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-right">
                  {p.compare_at_price_cents !== null ? `R ${(p.compare_at_price_cents / 100).toFixed(2)}` : "-"}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-right">{p.stock_qty}</td>
                <td className="border border-gray-300 px-3 py-2 text-right">{new Date(p.created_at).toLocaleDateString()}</td>
                <td className="border border-gray-300 px-3 py-2 text-center">
                  <Button onClick={() => navigate(`/catalog/products/${p.id}`)} size="sm" variant="outline">Edit</Button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}