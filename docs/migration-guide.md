# Product Variant Migration Guide

**Phase:** 35 - Data Migration  
**Date:** 2024-12-19  
**Status:** Analysis Complete, Ready for Application

## Migration Summary

- **Original Products:** 101
- **Unified Products:** 63 (29 with variants, 34 single)
- **Products Reduced:** 38 (38% reduction)

## Migration Process

### Step 1: Analysis Complete ✅
The migration analysis script has identified all products that need to be merged. See:
- `/logs/variant_merge.log` - Detailed merge log
- `/docs/migration-summary.json` - JSON summary
- `/docs/variant-mapping.md` - Original variant mapping

### Step 2: Apply Migration

For each product group identified in the merge log:

1. **Identify the base product** (first product in the group)
2. **Create variants array** from all products in the group
3. **Update the product**:
   - Keep base name (without strength)
   - Update slug to unified slug
   - Move price, SKU, inStock, specification to variants array
   - Set `quantityPerOrder: 1` for all variants
   - Preserve all other fields (chemical info, warehouse options, etc.)

### Step 3: Remove Duplicate Entries

After creating unified products, remove the duplicate entries from the products array.

## Example Migration

### Before:
```typescript
{
  id: 'et10',
  slug: 'epitalon-10mg',
  name: 'Epitalon (10mg × 10 vials)',
  price: 35.00,
  sku: 'ET10',
  specification: '10mg × 10 vials',
  inStock: true,
  // ... other fields
},
{
  id: 'et50',
  slug: 'epitalon-50mg',
  name: 'Epitalon (50mg × 10 vials)',
  price: 162.00,
  sku: 'ET50',
  specification: '50mg × 10 vials',
  inStock: true,
  // ... other fields (same as above)
}
```

### After:
```typescript
{
  id: 'et10',
  slug: 'epitalon',
  name: 'Epitalon',
  variants: [
    {
      strength: '10mg',
      quantityPerOrder: 1,
      price: 35.00,
      sku: 'ET10',
      inStock: true,
      specification: '10mg × 10 vials',
    },
    {
      strength: '50mg',
      quantityPerOrder: 1,
      price: 162.00,
      sku: 'ET50',
      inStock: true,
      specification: '50mg × 10 vials',
    },
  ],
  // ... other fields (preserved from first product)
}
```

## Important Notes

1. **Preserve All Data**: All fields except price, SKU, inStock, and specification should be preserved from the base product
2. **Warehouse Options**: Apply to all variants (shared at product level)
3. **Chemical Information**: Shared across all variants
4. **Quantity Per Order**: Always set to 1 for single vial sales
5. **Slug Updates**: Update slugs to base name (e.g., `epitalon-10mg` → `epitalon`)
6. **Backward Compatibility**: Keep legacy fields (price, sku, inStock) as optional for transition period

## Verification Checklist

After migration, verify:
- [ ] All 29 variant groups have been unified
- [ ] All variants have `quantityPerOrder: 1`
- [ ] All product data (chemical info, warehouse options) is preserved
- [ ] Slugs are updated to base names
- [ ] No duplicate products remain
- [ ] Total product count is 63 (down from 101)
- [ ] All helper functions work with new structure

## Next Steps

After migration is complete:
1. Update front-end components to use variants
2. Update cart logic to handle variants
3. Update search and filtering
4. Update SEO schema
5. Test all functionality

