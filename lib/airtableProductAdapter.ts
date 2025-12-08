import { AirtableProduct } from './airtableClient';
import { Product, ProductVariant } from '@/data/products';

/**
 * Convert Airtable products to the application's Product interface
 * Groups variants by product slug
 */
export function convertAirtableToProducts(airtableProducts: AirtableProduct[]): Product[] {
  // Group products by slug
  const productMap = new Map<string, AirtableProduct[]>();
  
  airtableProducts.forEach((airtableProduct) => {
    const slug = airtableProduct.productSlug;
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
    const product: Product = {
      id: firstVariant.productSlug,
      slug: firstVariant.productSlug,
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
  const product: Product = {
    id: airtableProduct.productSlug,
    slug: airtableProduct.productSlug,
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

