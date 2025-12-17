import { AirtableProduct } from './airtableClient';
import { Product, ProductVariant } from '@/data/products';

/**
 * Convert Airtable products to the application's Product interface
 * Groups variants by product slug
 */
/**
 * Generate a slug from product name if needed
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

export function convertAirtableToProducts(airtableProducts: AirtableProduct[]): Product[] {
  // Group products by slug (generate slug if missing)
  const productMap = new Map<string, AirtableProduct[]>();
  
  airtableProducts.forEach((airtableProduct) => {
    // Use existing slug or generate from product name
    const slug = airtableProduct.productSlug || generateSlugFromName(airtableProduct.productName);
    
    // Ensure slug is not empty
    if (!slug) {
      console.warn(`[Product Adapter] Skipping product with no slug: ${airtableProduct.productName}`);
      return;
    }
    
    if (!productMap.has(slug)) {
      productMap.set(slug, []);
    }
    productMap.get(slug)!.push(airtableProduct);
  });

  // Convert each group to a Product
  const products: Product[] = [];

  productMap.forEach((variants, slug) => {
    const firstVariant = variants[0];
    
    // Create variants array
    const productVariants: ProductVariant[] = variants.map((variant) => ({
      strength: variant.variantStrength,
      quantityPerOrder: 1,
      price: variant.priceUSD,
      sku: variant.skuCode,
      inStock: variant.inStock,
      specification: variant.specification,
    }));

    // Determine if product has variants or is single
    const hasVariants = variants.length > 1 || (variants.length === 1 && variants[0].variantStrength !== 'N/A' && variants[0].variantStrength !== '');

    // Build product object
    // Use generated slug if Product_Slug was empty
    const productSlug = firstVariant.productSlug || generateSlugFromName(firstVariant.productName);
    
    const product: Product = {
      id: productSlug,
      slug: productSlug,
      name: firstVariant.productName,
      description: firstVariant.fullDescription || firstVariant.shortDescription,
      shortDescription: firstVariant.shortDescription,
      image: firstVariant.imageURL,
      category: firstVariant.category,
      variants: hasVariants ? productVariants : undefined,
      // Legacy fields for backward compatibility
      price: hasVariants ? undefined : firstVariant.priceUSD,
      sku: hasVariants ? undefined : firstVariant.skuCode,
      inStock: hasVariants ? undefined : firstVariant.inStock,
      specification: hasVariants ? undefined : firstVariant.specification,
      warehouseOptions: {
        overseas: {
          priceMultiplier: 1.0,
          description: 'Shipped directly from our verified international partner facilities.',
          available: firstVariant.warehouseLocation === 'Both' || firstVariant.warehouseLocation === 'Overseas Warehouse',
        },
        us: {
          priceMultiplier: 1.25,
          description: 'Re-tested and quality-verified in U.S. laboratories prior to domestic shipment.',
          available: firstVariant.warehouseLocation === 'Both' || firstVariant.warehouseLocation === 'US Warehouse',
        },
      },
      chemicalFormula: firstVariant.molecularFormula,
      molarMass: firstVariant.molarMass,
      casNumber: firstVariant.casNumber,
      synonyms: firstVariant.synonyms,
      pubchemId: firstVariant.pubchemId,
      shelfLife: firstVariant.shelfLife,
      researchApplications: firstVariant.researchApplications,
      storageRequirements: firstVariant.storageRequirements,
      handlingGuidelines: firstVariant.handlingGuidelines,
    };

    products.push(product);
  });

  return products;
}

/**
 * Convert single Airtable product to Product interface
 */
export function convertAirtableToProduct(airtableProduct: AirtableProduct): Product {
  // Generate slug if missing
  const productSlug = airtableProduct.productSlug || generateSlugFromName(airtableProduct.productName);
  
  const product: Product = {
    id: productSlug,
    slug: productSlug,
    name: airtableProduct.productName,
    description: airtableProduct.fullDescription || airtableProduct.shortDescription,
    shortDescription: airtableProduct.shortDescription,
    image: airtableProduct.imageURL,
    category: airtableProduct.category,
    price: airtableProduct.priceUSD,
    sku: airtableProduct.skuCode,
    inStock: airtableProduct.inStock,
    specification: airtableProduct.specification,
    warehouseOptions: {
      overseas: {
        priceMultiplier: 1.0,
        description: 'Shipped directly from our verified international partner facilities.',
        available: airtableProduct.warehouseLocation === 'Both' || airtableProduct.warehouseLocation === 'Overseas Warehouse',
      },
      us: {
        priceMultiplier: 1.25,
        description: 'Re-tested and quality-verified in U.S. laboratories prior to domestic shipment.',
        available: airtableProduct.warehouseLocation === 'Both' || airtableProduct.warehouseLocation === 'US Warehouse',
      },
    },
    chemicalFormula: airtableProduct.molecularFormula,
    molarMass: airtableProduct.molarMass,
    casNumber: airtableProduct.casNumber,
    synonyms: airtableProduct.synonyms,
    pubchemId: airtableProduct.pubchemId,
    shelfLife: airtableProduct.shelfLife,
    researchApplications: airtableProduct.researchApplications,
    storageRequirements: airtableProduct.storageRequirements,
    handlingGuidelines: airtableProduct.handlingGuidelines,
  };

  return product;
}

