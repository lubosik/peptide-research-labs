

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
 * Normalize Airtable attachment field to URL string
 * Handles Airtable attachment objects which have a 'url' property
 * Airtable attachments are returned as: [{ url: "https://dl.airtable.com/...", filename: "...", ... }]
 */
function normalizeImageURL(attachments: any[]): string {
  if (!attachments || attachments.length === 0) {
    return '/images/products/placeholder.jpg';
  }
  
  // If it's already a string URL, return it (for backward compatibility)
  if (typeof attachments[0] === 'string') {
    return attachments[0];
  }
  
  // Airtable attachment objects have a 'url' property
  // This is the primary way attachments are returned from Airtable
  if (attachments[0]?.url && typeof attachments[0].url === 'string') {
    return attachments[0].url;
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
  return {
    productId: record.get('Product_ID')?.toString() || '',
    productName: record.get('Product_Name') || '',
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
    imageURL: normalizeImageURL(record.get('Image_URL')),
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

