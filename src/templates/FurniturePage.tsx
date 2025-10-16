import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, Ruler, Package, Clock, Wrench } from "lucide-react";

interface FurniturePageProps {
  furniture: {
    id: string;
    title: string;
    price: number;
    originalPrice?: number;
    currency: string;
    image: string;
    images?: string[];
    dimensions?: {
      width: number;
      height: number;
      depth: number;
      unit: string;
    };
    material?: string;
    finish?: string;
    deliveryTime?: string;
    badges?: string[];
    category?: string;
    inStock?: boolean;
    shortDescription?: string;
    descriptionHtml?: string;
    sku?: string;
    weight?: number;
    assembly?: 'required' | 'not_required' | 'partial';
    warranty?: string;
    careInstructions?: string;
  };
}

export default function FurniturePageTemplate({ furniture }: FurniturePageProps) {
  const discountPercentage = furniture.originalPrice 
    ? Math.round(((furniture.originalPrice - furniture.price) / furniture.originalPrice) * 100)
    : 0;

  const allImages = furniture.images?.length ? furniture.images : [furniture.image];

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-50">
              <img 
                src={allImages[0]} 
                alt={furniture.title}
                className="w-full h-full object-cover"
              />
              {discountPercentage > 0 && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1">
                    -{discountPercentage}% OFF
                  </Badge>
                </div>
              )}
              {furniture.badges?.map((badge, index) => (
                <div key={index} className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-white/90 text-gray-800">
                    {badge}
                  </Badge>
                </div>
              ))}
            </div>
            
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {allImages.slice(1, 5).map((img, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded-md bg-gray-50 cursor-pointer hover:opacity-75">
                    <img 
                      src={img} 
                      alt={`${furniture.title} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Furniture Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              {furniture.category && (
                <div className="text-sm text-gray-500 uppercase tracking-wide font-medium mb-2">
                  {furniture.category}
                </div>
              )}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {furniture.title}
              </h1>
              {furniture.sku && (
                <div className="text-sm text-gray-500">
                  SKU: {furniture.sku}
                </div>
              )}
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              {furniture.dimensions && (
                <div className="flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">
                    {furniture.dimensions.width} × {furniture.dimensions.height} × {furniture.dimensions.depth} {furniture.dimensions.unit}
                  </span>
                </div>
              )}
              
              {furniture.material && (
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">{furniture.material}</span>
                </div>
              )}
              
              {furniture.deliveryTime && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">{furniture.deliveryTime}</span>
                </div>
              )}
              
              {furniture.assembly && (
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">
                    {furniture.assembly === 'not_required' ? 'No Assembly' : 
                     furniture.assembly === 'partial' ? 'Partial Assembly' : 'Assembly Required'}
                  </span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  {furniture.currency} {furniture.price.toFixed(2)}
                </span>
                {furniture.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    {furniture.currency} {furniture.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="text-sm">
                {furniture.inStock !== false ? (
                  <span className="text-green-600 font-medium">✓ Available</span>
                ) : (
                  <span className="text-red-600 font-medium">✗ Out of Stock</span>
                )}
              </div>
            </div>

            {/* Short Description */}
            {furniture.shortDescription && (
              <div className="text-gray-700 leading-relaxed">
                {furniture.shortDescription}
              </div>
            )}

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <Button 
                  className="flex-1" 
                  size="lg"
                  disabled={furniture.inStock === false}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              
              <Button variant="outline" className="w-full" size="lg">
                Request Quote
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-200">
              <div className="text-center">
                <Truck className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <div className="text-xs text-gray-600">White Glove Delivery</div>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <div className="text-xs text-gray-600">{furniture.warranty || '5 Year Warranty'}</div>
              </div>
              <div className="text-center">
                <RotateCcw className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <div className="text-xs text-gray-600">30 Day Returns</div>
              </div>
            </div>
          </div>
        </div>

        {/* Furniture Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="dimensions" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
              <TabsTrigger value="materials">Materials & Finish</TabsTrigger>
              <TabsTrigger value="delivery">Production & Delivery</TabsTrigger>
              <TabsTrigger value="care">Care Instructions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dimensions" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Product Dimensions</h3>
                  {furniture.dimensions && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Width:</span>
                        <span>{furniture.dimensions.width} {furniture.dimensions.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Height:</span>
                        <span>{furniture.dimensions.height} {furniture.dimensions.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Depth:</span>
                        <span>{furniture.dimensions.depth} {furniture.dimensions.unit}</span>
                      </div>
                    </div>
                  )}
                  {furniture.weight && (
                    <div className="flex justify-between">
                      <span>Weight:</span>
                      <span>{furniture.weight} kg</span>
                    </div>
                  )}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">
                    <p className="mb-2">📏 All dimensions are approximate and may vary slightly.</p>
                    <p>📦 Please ensure adequate space for delivery and placement.</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="materials" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Materials & Construction</h3>
                  <div className="space-y-2">
                    {furniture.material && (
                      <div className="flex justify-between">
                        <span>Primary Material:</span>
                        <span>{furniture.material}</span>
                      </div>
                    )}
                    {furniture.finish && (
                      <div className="flex justify-between">
                        <span>Finish:</span>
                        <span>{furniture.finish}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">
                    <p className="mb-2">🌿 Sustainably sourced materials</p>
                    <p>✨ Hand-finished by skilled craftsmen</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="delivery" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Production & Delivery</h3>
                  <div className="space-y-2">
                    {furniture.deliveryTime && (
                      <div className="flex justify-between">
                        <span>Delivery Time:</span>
                        <span>{furniture.deliveryTime}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Assembly:</span>
                      <span>
                        {furniture.assembly === 'not_required' ? 'Not Required' : 
                         furniture.assembly === 'partial' ? 'Partial Assembly' : 'Full Assembly Required'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">
                    <p className="mb-2">🚚 White glove delivery service available</p>
                    <p>🔧 Professional assembly service optional</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="care" className="mt-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Care Instructions</h3>
                {furniture.careInstructions ? (
                  <div className="prose max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: furniture.careInstructions }} />
                  </div>
                ) : (
                  <div className="space-y-3 text-gray-600">
                    <p>• Dust regularly with a soft, dry cloth</p>
                    <p>• Avoid direct sunlight and heat sources</p>
                    <p>• Use coasters and placemats to protect surfaces</p>
                    <p>• Clean spills immediately with a damp cloth</p>
                    <p>• Use furniture polish sparingly and test in an inconspicuous area first</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}