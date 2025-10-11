export function validateDraft(p: any) {
  const errors: string[] = [];
  
  // Required fields
  if (!p?.title || !String(p.title).trim()) {
    errors.push("Title is required");
  }
  
  const price = Number(p?.price);
  if (Number.isNaN(price) || price <= 0) {
    errors.push("Price must be a positive number");
  }
  
  // Optional but recommended fields
  if (!p?.shortDescription || !String(p.shortDescription).trim()) {
    errors.push("Short description is recommended for better SEO");
  }
  
  if (!p?.images || p.images.length === 0) {
    errors.push("At least one product image is required");
  }
  
  // Validation warnings (non-blocking)
  const warnings: string[] = [];
  
  if (!p?.category) {
    warnings.push("Category helps with organization");
  }
  
  if (!p?.tags || p.tags.length === 0) {
    warnings.push("Tags improve discoverability");
  }
  
  if (p?.title && p.title.length > 60) {
    warnings.push("Title is quite long - consider shortening for better display");
  }
  
  if (p?.shortDescription && p.shortDescription.length > 160) {
    warnings.push("Short description is long - consider keeping under 160 characters");
  }
  
  // Log warnings to console for development
  if (warnings.length > 0) {
    console.warn("Product validation warnings:", warnings);
  }
  
  return errors;
}

export function validateForPublish(p: any) {
  const errors = validateDraft(p);
  
  // Additional checks for publishing
  if (!p?.descriptionHtml || !String(p.descriptionHtml).trim()) {
    errors.push("Full description is required for publishing");
  }
  
  if (!p?.category) {
    errors.push("Category is required for publishing");
  }
  
  return errors;
}