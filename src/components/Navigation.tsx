import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Plus, 
  Package, 
  Sofa, 
  Percent, 
  Gift, 
  Star,
  ChevronDown,
  Home
} from "lucide-react";

export default function Navigation() {
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-xl font-bold text-gray-900">BLOM Admin</span>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex items-center space-x-4">
          {/* Add Products Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Products</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link to="/products/new" className="flex items-center space-x-2 w-full">
                  <Package className="h-4 w-4" />
                  <span>Add Product</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/furniture/new" className="flex items-center space-x-2 w-full">
                  <Sofa className="h-4 w-4" />
                  <span>Add Furniture</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled className="flex items-center space-x-2 text-gray-400">
                <Star className="h-4 w-4" />
                <span>Add Special</span>
                <span className="ml-auto text-xs bg-gray-100 px-2 py-1 rounded">Soon</span>
              </DropdownMenuItem>
              <DropdownMenuItem disabled className="flex items-center space-x-2 text-gray-400">
                <Percent className="h-4 w-4" />
                <span>Add Discount</span>
                <span className="ml-auto text-xs bg-gray-100 px-2 py-1 rounded">Soon</span>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="flex items-center space-x-2">
                <Link to="/bundles/new" className="flex items-center space-x-2 w-full">
                  <Gift className="h-4 w-4" />
                  <span>Add Bundle Deal</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Home Button */}
          <Button variant="outline" asChild>
            <Link to="/" className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}