import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Upload, X, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import ProductPreview from '@/components/ProductPreview';
import { uploadToCloudinary, postJSON } from '@/lib/api';
import { env, optionalEnv } from '@/lib/env';
import { type ProductDraft, normalizeDraft, slugify, validateDraft } from '@/lib/productSchema';

export default function NewProductPage() {
  const [draft, setDraft] = useState<Partial<ProductDraft>>({
    title: '',
    price: 0,
    currency: 'ZAR',
    status: 'draft',
    images: [],
    tags: [],
    badges: [],
  });

  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [newBadge, setNewBadge] = useState('');

  const updateDraft = useCallback((updates: Partial<ProductDraft>) => {
    setDraft(prev => ({ ...prev, ...updates }));
  }, []);

  const generateSlug = useCallback(() => {
    if (draft.title) {
      updateDraft({ slug: slugify(draft.title) });
    }
  }, [draft.title, updateDraft]);

  const handleFileUpload = useCallback(async (
    files: FileList | null, 
    type: 'thumbnail' | 'gallery'
  ) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const uploadPromises = fileArray.map(async (file) => {
      const uploadId = `${type}-${file.name}-${Date.now()}`;
      
      try {
        setUploading(prev => ({ ...prev, [uploadId]: true }));
        const url = await uploadToCloudinary(file);
        
        if (type === 'thumbnail') {
          updateDraft({ thumbnail: url });
        } else {
          updateDraft({ 
            images: [...(draft.images || []), url] 
          });
        }
        
        toast.success(`${file.name} uploaded successfully`);
        return url;
      } catch (error) {
        toast.error(`Failed to upload ${file.name}: ${error}`);
        throw error;
      } finally {
        setUploading(prev => ({ ...prev, [uploadId]: false }));
      }
    });

    try {
      await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  }, [draft.images, updateDraft]);

  const addTag = useCallback(() => {
    if (newTag.trim() && !draft.tags?.includes(newTag.trim())) {
      updateDraft({ tags: [...(draft.tags || []), newTag.trim()] });
      setNewTag('');
    }
  }, [newTag, draft.tags, updateDraft]);

  const removeTag = useCallback((tagToRemove: string) => {
    updateDraft({ tags: draft.tags?.filter(tag => tag !== tagToRemove) });
  }, [draft.tags, updateDraft]);

  const addBadge = useCallback(() => {
    if (newBadge.trim() && !draft.badges?.includes(newBadge.trim())) {
      updateDraft({ badges: [...(draft.badges || []), newBadge.trim()] });
      setNewBadge('');
    }
  }, [newBadge, draft.badges, updateDraft]);

  const removeBadge = useCallback((badgeToRemove: string) => {
    updateDraft({ badges: draft.badges?.filter(badge => badge !== badgeToRemove) });
  }, [draft.badges, updateDraft]);

  const handleSubmit = useCallback(async () => {
    const normalizedDraft = normalizeDraft(draft);
    const errors = validateDraft(normalizedDraft);

    if (errors.length > 0) {
      toast.error(`Please fix the following errors:\n${errors.join('\n')}`);
      return;
    }

    setSubmitting(true);
    
    try {
      const payload = {
        source: 'owner_portal',
        action: 'create_or_update_product',
        draft: normalizedDraft,
        meta: {
          appVersion: optionalEnv.APP_VERSION,
          submittedAt: new Date().toISOString(),
        },
      };

      await postJSON(env.N8N_WEBHOOK_URL, payload);
      
      toast.success('Draft sent to n8n (PR will open)');
      
      // Reset form after successful submission
      setDraft({
        title: '',
        price: 0,
        currency: 'ZAR',
        status: 'draft',
        images: [],
        tags: [],
        badges: [],
      });
      
    } catch (error) {
      console.error('Submission failed:', error);
      toast.error(`Submission failed: ${error}`);
    } finally {
      setSubmitting(false);
    }
  }, [draft]);

  const normalizedDraft = normalizeDraft(draft);
  const isUploading = Object.values(uploading).some(Boolean);
  const canSubmit = !submitting && !isUploading && validateDraft(normalizedDraft).length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-gray-600">Create and preview your product before submitting to n8n</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Title & Slug */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter product title"
                    value={draft.title || ''}
                    onChange={(e) => updateDraft({ title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      placeholder="product-slug"
                      value={draft.slug || ''}
                      onChange={(e) => updateDraft({ slug: e.target.value })}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={generateSlug} variant="outline" className="w-full">
                      Generate
                    </Button>
                  </div>
                </div>

                {/* Price & Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (ZAR) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={draft.price || ''}
                      onChange={(e) => updateDraft({ price: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={draft.stock || ''}
                      onChange={(e) => updateDraft({ stock: Number(e.target.value) })}
                    />
                  </div>
                </div>

                {/* SKU & Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      placeholder="Product SKU"
                      value={draft.sku || ''}
                      onChange={(e) => updateDraft({ sku: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={draft.category || ''} 
                      onValueChange={(value) => updateDraft({ category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="home">Home & Garden</SelectItem>
                        <SelectItem value="books">Books</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="beauty">Beauty</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Descriptions */}
                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Short Description</Label>
                  <Textarea
                    id="shortDescription"
                    placeholder="Brief product description"
                    rows={2}
                    value={draft.shortDescription || ''}
                    onChange={(e) => updateDraft({ shortDescription: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descriptionHtml">Full Description (HTML allowed)</Label>
                  <Textarea
                    id="descriptionHtml"
                    placeholder="Detailed product description with HTML formatting"
                    rows={4}
                    value={draft.descriptionHtml || ''}
                    onChange={(e) => updateDraft({ descriptionHtml: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Thumbnail */}
                <div className="space-y-2">
                  <Label>Thumbnail Image</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files, 'thumbnail')}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <label
                      htmlFor="thumbnail-upload"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Click to upload thumbnail</span>
                    </label>
                  </div>
                  {draft.thumbnail && (
                    <div className="relative inline-block">
                      <img
                        src={draft.thumbnail}
                        alt="Thumbnail"
                        className="w-20 h-20 object-cover rounded border"
                      />
                      <button
                        onClick={() => updateDraft({ thumbnail: undefined })}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Gallery */}
                <div className="space-y-2">
                  <Label>Gallery Images</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileUpload(e.target.files, 'gallery')}
                      className="hidden"
                      id="gallery-upload"
                    />
                    <label
                      htmlFor="gallery-upload"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Click to upload gallery images</span>
                    </label>
                  </div>
                  {draft.images && draft.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {draft.images.map((url, i) => (
                        <div key={i} className="relative">
                          <img
                            src={url}
                            alt={`Gallery ${i + 1}`}
                            className="w-full aspect-square object-cover rounded border"
                          />
                          <button
                            onClick={() => updateDraft({
                              images: draft.images?.filter((_, idx) => idx !== i)
                            })}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {isUploading && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading images...
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tags & Badges */}
            <Card>
              <CardHeader>
                <CardTitle>Tags & Badges</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Tags */}
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button onClick={addTag} variant="outline" size="sm">
                      Add
                    </Button>
                  </div>
                  {draft.tags && draft.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {draft.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Badges */}
                <div className="space-y-2">
                  <Label>Badges</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add badge (e.g., New, Sale, Featured)"
                      value={newBadge}
                      onChange={(e) => setNewBadge(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBadge())}
                    />
                    <Button onClick={addBadge} variant="outline" size="sm">
                      Add
                    </Button>
                  </div>
                  {draft.badges && draft.badges.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {draft.badges.map((badge, i) => (
                        <Badge key={i} className="flex items-center gap-1">
                          {badge}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeBadge(badge)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* SEO */}
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Input
                    id="seoTitle"
                    placeholder="SEO optimized title"
                    value={draft.seo?.title || ''}
                    onChange={(e) => updateDraft({
                      seo: { ...draft.seo, title: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seoDescription">SEO Description</Label>
                  <Textarea
                    id="seoDescription"
                    placeholder="SEO meta description"
                    rows={2}
                    value={draft.seo?.description || ''}
                    onChange={(e) => updateDraft({
                      seo: { ...draft.seo, description: e.target.value }
                    })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="flex-1"
                size="lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit to n8n'
                )}
              </Button>
              {!isUploading && draft.images && draft.images.length > 0 && (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm">Synced to Cloudinary</span>
                </div>
              )}
            </div>
          </div>

          {/* Preview */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <ProductPreview draft={normalizedDraft} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}