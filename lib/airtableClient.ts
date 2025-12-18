

import Airtable from 'airtable';

// Initialize Airtable base connection
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!);

const TABLE_NAME = process.env.AIRTABLE_TABLE_ID || 'tblQQrvrTG4kVnIzz';

/**
 * Airtable Product Record Interface
 * Maps Airtable fields to our application schema
 */
export interface AirtableProduct {
  productId: string;
  productName: string;
  variantStrength: string;
  category: string;
  priceUSD: number;
  inStock: boolean;
  warehouseLocation: string;
  skuCode: string;
  shortDescription: string;
  fullDescription: string;
  molecularFormula?: string;
  molarMass?: string;
  casNumber?: string;
  synonyms?: string[];
  pubchemId?: string;
  imageURL: string;
  certificateOfAnalysisURL?: string;
  seoTitle: string;
  seoDescription: string;
  featured: boolean;
  popularityScore: number;
  stockQuantity: number;
  unitSize: string;
  specification?: string;
  temperatureStorage?: string;
  shelfLife?: string;
  shippingRestrictions?: string;
  isDiscontinued: boolean;
  researchApplications?: string;
  storageRequirements?: string;
  handlingGuidelines?: string;
  notes?: string;
  productSlug: string;
  apiVisibilityStatus?: string;
  recordId: string; // Airtable record ID
}

/**
 * Convert Airtable page URL to actual image URL
 * Airtable page URLs look like: https://airtable.com/app.../att...?blocks=hide
 * We need to extract the attachment ID and construct the proper image URL
 */
function convertAirtablePageUrlToImageUrl(pageUrl: string): string | null {
  try {
    // Extract attachment ID from URL pattern: .../att[ID]?...
    const match = pageUrl.match(/\/att([^/?]+)/);
    if (match && match[1]) {
      const attachmentId = match[1];
      // Construct the actual image URL
      // Format: https://dl.airtable.com/.attachments/[attachmentId]/[filename]
      // Since we don't have the filename, we'll try to get it from the API response
      // For now, return null and let the API response handle it
      return null;
    }
  } catch (e) {
    console.error('[normalizeImageURL] Error converting Airtable page URL:', e);
  }
  return null;
}

/**
 * Map product names to local image files (fallback when Airtable URLs don't work)
 */
function getLocalImagePath(productName: string): string | null {
  const name = productName.toUpperCase();
  if (name.includes('5-AMINO-1MQ') || name.includes('5AMINO-1MQ')) {
    return '/images/products/vici-5-amino-1mq.png';
  }
  if (name.includes('ACETIC ACID')) {
    return '/images/products/vici-acetic-acid.png';
  }
  if (name.includes('ADIPOTIDE')) {
    return '/images/products/vici-adipotide.png';
  }
  if (name.includes('AICAR')) {
    return '/images/products/vici-aicar.png';
  }
  return null;
}

/**
 * Normalize Airtable attachment field to URL string
 * 
 * Airtable attachment format from API (per official docs):
 * The Image_URL field returns an array of attachment objects:
 * 
 * [{
 *   id: "attrDRXarlBSmxIq5",           // Always present
 *   url: "https://v5.airtableusercontent.com/v3/u/...",  // Always present (expires in 2 hours)
 *   filename: "Vici Peptides Site-Epitalon.jpg",  // Always present
 *   size: 380063,                      // May be present
 *   type: "image/jpeg",                // May be present
 *   width: 1736,                       // May be present (for images)
 *   height: 2278,                      // May be present (for images)
 *   thumbnails: {                      // May be present (for images/documents)
 *     small: { url: "...", width: 27, height: 35 },
 *     large: { url: "...", width: 512, height: 672 },
 *     full: { url: "...", width: 1736, height: 2278 }
 *   }
 * }]
 * 
 * According to Airtable docs: "only id, url, and filename are always returned"
 * Other properties (size, type, width, height, thumbnails) may not be included.
 * 
 * Priority: Use main 'url' first (full resolution), fallback to thumbnails.full.url
 * Note: URLs expire after 2 hours, but that's handled by Airtable's CDN
 * 
 * FALLBACK: For specific products with local images, use local path instead
 */
function normalizeImageURL(attachments: any, productName?: string): string {
  // First, check if we have a local image for this product (fallback)
  if (productName) {
    const localPath = getLocalImagePath(productName);
    if (localPath) {
      // Prefer local image for known products
      return localPath;
    }
  }
  
  // Handle null/undefined
  if (!attachments) {
    return '/images/products/placeholder.jpg';
  }
  
  // Handle array of attachments (standard Airtable format)
  if (Array.isArray(attachments)) {
    if (attachments.length === 0) {
      return '/images/products/placeholder.jpg';
    }
    
    const firstAttachment = attachments[0];
    
    // If it's already a string URL (unlikely but handle it)
    if (typeof firstAttachment === 'string') {
      // Check if it's an Airtable page URL (not an image URL)
      if (firstAttachment.includes('airtable.com/app') && firstAttachment.includes('/att')) {
        console.warn('[normalizeImageURL] Received Airtable page URL instead of image URL');
        return '/images/products/placeholder.jpg';
      }
      // If it's already a valid image URL, return it
      if (firstAttachment.startsWith('https://')) {
        return firstAttachment;
      }
      return '/images/products/placeholder.jpg';
    }
    
    // Airtable attachment object - use the main 'url' property (full resolution)
    if (firstAttachment?.url && typeof firstAttachment.url === 'string') {
      const url = firstAttachment.url;
      
      // Validate it's a proper Airtable image URL
      if (url.startsWith('https://v5.airtableusercontent.com/') || 
          url.startsWith('https://dl.airtable.com/') ||
          url.startsWith('https://')) {
        return url;
      }
    }
    
    // Fallback: Use thumbnails.full.url (full-size thumbnail, same resolution as main URL)
    if (firstAttachment?.thumbnails?.full?.url) {
      const thumbUrl = firstAttachment.thumbnails.full.url;
      if (thumbUrl.startsWith('https://')) {
        return thumbUrl;
      }
    }
    
    // Fallback: Use thumbnails.large.url (512px)
    if (firstAttachment?.thumbnails?.large?.url) {
      const thumbUrl = firstAttachment.thumbnails.large.url;
      if (thumbUrl.startsWith('https://')) {
        return thumbUrl;
      }
    }
    
    // Log the attachment structure for debugging if we couldn't extract URL
    console.warn('[normalizeImageURL] Could not extract valid image URL from attachment:', JSON.stringify({
      hasUrl: !!firstAttachment?.url,
      urlType: typeof firstAttachment?.url,
      hasThumbnails: !!firstAttachment?.thumbnails,
      hasFullThumbnail: !!firstAttachment?.thumbnails?.full?.url,
      attachmentKeys: Object.keys(firstAttachment || {})
    }, null, 2));
  }
  
  // Handle single attachment object (not in array - less common)
  if (typeof attachments === 'object' && !Array.isArray(attachments)) {
    if (attachments.url && typeof attachments.url === 'string') {
      const url = attachments.url;
      if (url.startsWith('https://')) {
        return url;
      }
    }
    // Try thumbnails
    if (attachments.thumbnails?.full?.url) {
      return attachments.thumbnails.full.url;
    }
  }
  
  return '/images/products/placeholder.jpg';
}

/**
 * Normalize synonyms field (can be string or array)
 */
function normalizeSynonyms(synonyms: any): string[] {
  if (!synonyms) return [];
  if (Array.isArray(synonyms)) return synonyms;
  if (typeof synonyms === 'string') {
    // Handle comma-separated string
    return synonyms.split(',').map(s => s.trim()).filter(s => s.length > 0);
  }
  return [];
}

/**
 * Generate a URL-friendly slug from a product name
 * Handles product names with variants like "5-amino-1mq (10mg × 10 vials)"
 */
function generateSlugFromName(productName: string): string {
  if (!productName) return '';
  
  // Extract base name (remove variant info in parentheses)
  let baseName = productName.split('(')[0].trim();
  
  // Convert to lowercase and replace spaces/special chars with hyphens
  const slug = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  return slug;
}

/**
 * Map Airtable record to AirtableProduct interface
 */
function mapRecordToProduct(record: any): AirtableProduct {
  const imageAttachments = record.get('Image_URL');
  const productName = record.get('Product_Name') || '';
  
  // Always log first 3 products with images for debugging
  const isFirstFew = ['5-amino-1mq', 'ACETIC ACID', 'Adipotide', 'AICAR'].some(name => 
    productName.toUpperCase().includes(name.toUpperCase())
  );
  
  if (imageAttachments) {
    if (Array.isArray(imageAttachments) && imageAttachments.length > 0) {
      if (isFirstFew) {
        console.log(`[Airtable] Product "${productName}" - Attachment structure:`, JSON.stringify(imageAttachments[0], null, 2));
      }
    } else if (isFirstFew) {
      console.warn(`[Airtable] Product "${productName}" - Image_URL field is not an array:`, typeof imageAttachments, imageAttachments);
    }
  } else if (isFirstFew) {
    console.warn(`[Airtable] Product "${productName}" - No Image_URL attachment found`);
  }
  
  const imageURL = normalizeImageURL(imageAttachments, productName);
  
  if (isFirstFew) {
    if (imageURL !== '/images/products/placeholder.jpg') {
      console.log(`[Airtable] Product "${productName}" - Image URL extracted: ${imageURL.substring(0, 150)}...`);
    } else {
      console.error(`[Airtable] Product "${productName}" - FAILED to extract image URL!`);
    }
  }
  
  return {
    productId: record.get('Product_ID')?.toString() || '',
    productName: productName,
    variantStrength: record.get('Variant_Strength') || '',
    category: record.get('Category') || '',
    priceUSD: record.get('Price_USD') || 0,
    inStock: record.get('In_Stock') === true,
    warehouseLocation: record.get('Warehouse_Location') || 'Both',
    skuCode: record.get('SKU_Code') || '',
    shortDescription: record.get('Short_Description') || '',
    fullDescription: record.get('Full_Description') || '',
    molecularFormula: record.get('Molecular_Formula') || undefined,
    molarMass: record.get('Molar_Mass') || undefined,
    casNumber: record.get('CAS_Number') || undefined,
    synonyms: normalizeSynonyms(record.get('Synonyms')),
    pubchemId: record.get('PubChem_ID') || undefined,
    imageURL: imageURL,
    certificateOfAnalysisURL: record.get('Certificate_of_Analysis_URL') || undefined,
    seoTitle: record.get('SEO_Title') || '',
    seoDescription: record.get('SEO_Description') || '',
    featured: record.get('Featured') === true,
    popularityScore: record.get('Popularity_Score') || 0,
    stockQuantity: record.get('Stock_Quantity') || 0,
    unitSize: record.get('Unit_Size') || '1 Vial',
    specification: record.get('Specification') || undefined,
    temperatureStorage: record.get('Temperature_Storage') || undefined,
    shelfLife: record.get('Shelf_Life') || undefined,
    shippingRestrictions: record.get('Shipping_Restrictions') || undefined,
    isDiscontinued: record.get('Is_Discontinued') === true,
    researchApplications: record.get('Research_Applications') || undefined,
    storageRequirements: record.get('Storage_Requirements') || undefined,
    handlingGuidelines: record.get('Handling_Guidelines') || undefined,
    notes: record.get('Notes') || undefined,
    productSlug: (record.get('Product_Slug') as string) || generateSlugFromName((record.get('Product_Name') as string) || ''),
    apiVisibilityStatus: record.get('API_Visibility_Status') || 'LIVE',
    recordId: record.id,
  };
}

/**
 * Fetch all products from Airtable
 * Returns all records without pre-filtering - filtering should be done at the page level
 */
export async function getAllProducts(): Promise<AirtableProduct[]> {
  try {
    // Fetch all records without filtering - let the page level handle filtering
    const records = await base(TABLE_NAME)
      .select({
        view: 'Grid view',
        sort: [{ field: 'Product_Name', direction: 'asc' }],
      })
      .all();

    const products = records.map(mapRecordToProduct);
    
    // Log for diagnostic purposes
    console.log(`[Airtable] Fetched ${products.length} total records from Airtable`);
    console.log(`[Airtable] Records with In_Stock=true: ${products.filter(p => p.inStock === true).length}`);
    console.log(`[Airtable] Records with Is_Discontinued=false: ${products.filter(p => p.isDiscontinued === false).length}`);
    console.log(`[Airtable] Records with API_Visibility_Status=LIVE: ${products.filter(p => p.apiVisibilityStatus === 'LIVE').length}`);
    
    return products;
  } catch (error) {
    console.error('Error fetching products from Airtable:', error);
    throw error;
  }
}

/**
 * Fetch a single product by slug
 * Returns the first matching variant (or product if no variants)
 * Note: Filtering by visibility status should be done at the page level
 */
export async function getProductBySlug(slug: string): Promise<AirtableProduct | null> {
  try {
    const records = await base(TABLE_NAME)
      .select({
        filterByFormula: `{Product_Slug} = "${slug}"`,
        sort: [{ field: 'Variant_Strength', direction: 'asc' }],
      })
      .firstPage();

    if (records.length === 0) {
      return null;
    }

    // Return the first variant (or product if no variants)
    return mapRecordToProduct(records[0]);
  } catch (error) {
    console.error(`Error fetching product by slug "${slug}" from Airtable:`, error);
    return null;
  }
}

/**
 * Fetch all variants for a product by slug
 * Note: Filtering by visibility status should be done at the page level
 */
export async function getProductVariantsBySlug(slug: string): Promise<AirtableProduct[]> {
  try {
    // Since Product_Slug field might be empty, we'll fetch all records and filter by generated slug
    // This is more reliable than trying to query by Product_Slug which may not exist
    const allRecords = await base(TABLE_NAME)
      .select({
        view: 'Grid view',
        sort: [{ field: 'Variant_Strength', direction: 'asc' }],
      })
      .all();
    
    // Filter records by matching slug (either from Product_Slug field or generated from Product_Name)
    const records = allRecords.filter(record => {
      const productSlug = (record.get('Product_Slug') as string) || '';
      const productName = (record.get('Product_Name') as string) || '';
      const generatedSlug = generateSlugFromName(productName);
      
      // Match if either the Product_Slug field matches, or the generated slug matches
      return (productSlug && productSlug === slug) || generatedSlug === slug;
    });

    return records.map(mapRecordToProduct);
  } catch (error) {
    console.error(`Error fetching product variants by slug "${slug}" from Airtable:`, error);
    if (error instanceof Error) {
      console.error(`Error details: ${error.message}`);
    }
    return [];
  }
}

/**
 * Fetch products by category
 * Note: Filtering by visibility status should be done at the page level
 */
export async function getProductsByCategory(category: string): Promise<AirtableProduct[]> {
  try {
    const records = await base(TABLE_NAME)
      .select({
        filterByFormula: `{Category} = "${category}"`,
        sort: [{ field: 'Product_Name', direction: 'asc' }],
      })
      .all();

    return records.map(mapRecordToProduct);
  } catch (error) {
    console.error(`Error fetching products by category "${category}" from Airtable:`, error);
    return [];
  }
}

/**
 * Fetch a product by record ID
 */
export async function getProductByRecordId(recordId: string): Promise<AirtableProduct | null> {
  try {
    const record = await base(TABLE_NAME).find(recordId);
    return mapRecordToProduct(record);
  } catch (error) {
    console.error(`Error fetching product by record ID "${recordId}" from Airtable:`, error);
    return null;
  }
}

