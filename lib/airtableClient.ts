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
 */
function normalizeImageURL(attachments: any[]): string {
  if (!attachments || attachments.length === 0) {
    return '/images/products/placeholder.jpg';
  }
  
  // If it's already a string URL, return it
  if (typeof attachments[0] === 'string') {
    return attachments[0];
  }
  
  // If it's an object with url property
  if (attachments[0]?.url) {
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
 * Map Airtable record to AirtableProduct interface
 */
function mapRecordToProduct(record: any): AirtableProduct {
  return {
    productId: record.get('Product_ID')?.toString() || '',
    productName: record.get('Product_Nmae') || '',
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
    productSlug: record.get('Product_Slug') || '',
    apiVisibilityStatus: record.get('API_Visibility_Status') || 'LIVE',
    recordId: record.id,
  };
}

/**
 * Fetch all products from Airtable
 * Filters out products where API_Visibility_Status is not "LIVE"
 */
export async function getAllProducts(): Promise<AirtableProduct[]> {
  try {
    const records = await base(TABLE_NAME)
      .select({
        filterByFormula: '{API_Visibility_Status} = "LIVE"',
        sort: [{ field: 'Product_Nmae', direction: 'asc' }],
      })
      .all();

    return records.map(mapRecordToProduct);
  } catch (error) {
    console.error('Error fetching products from Airtable:', error);
    throw error;
  }
}

/**
 * Fetch a single product by slug
 * Returns the first matching variant (or product if no variants)
 */
export async function getProductBySlug(slug: string): Promise<AirtableProduct | null> {
  try {
    const records = await base(TABLE_NAME)
      .select({
        filterByFormula: `AND({Product_Slug} = "${slug}", {API_Visibility_Status} = "LIVE")`,
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
 */
export async function getProductVariantsBySlug(slug: string): Promise<AirtableProduct[]> {
  try {
    const records = await base(TABLE_NAME)
      .select({
        filterByFormula: `AND({Product_Slug} = "${slug}", {API_Visibility_Status} = "LIVE")`,
        sort: [{ field: 'Variant_Strength', direction: 'asc' }],
      })
      .all();

    return records.map(mapRecordToProduct);
  } catch (error) {
    console.error(`Error fetching product variants by slug "${slug}" from Airtable:`, error);
    return [];
  }
}

/**
 * Fetch products by category
 */
export async function getProductsByCategory(category: string): Promise<AirtableProduct[]> {
  try {
    const records = await base(TABLE_NAME)
      .select({
        filterByFormula: `AND({Category} = "${category}", {API_Visibility_Status} = "LIVE")`,
        sort: [{ field: 'Product_Nmae', direction: 'asc' }],
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

