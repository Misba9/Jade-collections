/**
 * Parse product data from multipart form or JSON body
 * Handles array fields (sizes, colors) and type coercion
 */
export const parseProductForm = (req) => {
  const body = req.body || {};
  const files = req.files || [];

  const parseArray = (value) => {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === 'string') {
      return value.split(',').map((s) => s.trim()).filter(Boolean);
    }
    return [];
  };

  const parseNumber = (value) => {
    if (value === undefined || value === null || value === '') return undefined;
    const num = parseFloat(value);
    return isNaN(num) ? undefined : num;
  };

  const parseBool = (value) => {
    if (value === undefined || value === null) return undefined;
    if (typeof value === 'boolean') return value;
    return value === 'true' || value === '1';
  };

  const productData = {};

  if (body.title !== undefined) productData.title = String(body.title).trim();
  if (body.description !== undefined) productData.description = String(body.description).trim();
  if (body.category !== undefined && body.category !== '' && body.category !== null) {
    productData.category = body.category;
  }
  // Price: required for create
  if (body.price !== undefined) {
    const p = parseNumber(body.price);
    productData.price = p !== undefined ? p : 0;
  }
  if (body.discountPrice !== undefined) productData.discountPrice = parseNumber(body.discountPrice);
  // Stock: required for create
  if (body.stock !== undefined) {
    const s = parseNumber(body.stock);
    productData.stock = s !== undefined ? s : 0;
  }
  if (body.isFeatured !== undefined) productData.isFeatured = parseBool(body.isFeatured);
  if (body.isActive !== undefined) productData.isActive = parseBool(body.isActive);
  if (body.metaTitle !== undefined) productData.metaTitle = String(body.metaTitle).trim() || undefined;
  if (body.metaDescription !== undefined) productData.metaDescription = String(body.metaDescription).trim() || undefined;

  const sizes = parseArray(body.sizes);
  if (sizes.length) productData.sizes = sizes;

  const colors = parseArray(body.colors);
  if (colors.length) productData.colors = colors;

  // Images: from uploaded files (field: images) or URLs in body.images
  const imageUrls = parseArray(body.images);
  if (files.length) {
    productData._uploadedFiles = files;
  }
  if (imageUrls.length || body.images !== undefined) {
    productData._imageUrls = imageUrls;
  }

  return productData;
};
