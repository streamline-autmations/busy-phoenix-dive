export function validateDraft(p: any) {
  const errors: string[] = [];
  if (!p?.title || !String(p.title).trim()) errors.push("Title is required");
  const price = Number(p?.price);
  if (Number.isNaN(price) || price <= 0) errors.push("Price must be a positive number");
  return errors;
}