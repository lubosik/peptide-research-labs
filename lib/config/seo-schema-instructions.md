# SEO Schema Instructions

## Primary Schema Type

**Use `schema.org/ResearchOrganization` instead of `LocalBusiness`**

All structured data must reflect that this is a research-supply and biotechnology laboratory organization, NOT a retail or medical provider.

## Schema Adaptations Required

1. **Organization Schema:**
   - Type: `ResearchOrganization` (NOT `LocalBusiness`)
   - Description: Focus on research reagents and laboratory supplies
   - Services: Describe as biochemical reagents and laboratory supplies, not retail services

2. **Product Schema:**
   - All products must be described as biochemical reagents
   - Category: Laboratory supplies, research reagents
   - NOT consumer products or medical devices

3. **Service Schema:**
   - If used, describe as laboratory supply services
   - NOT retail or medical services

4. **Catalog Schema:**
   - Adapt all offer catalog schema to describe biochemical reagents and laboratory supplies
   - NOT retail products or consumer goods

## Implementation Notes

- All JSON-LD structured data must use `ResearchOrganization`
- Product descriptions must emphasize research/laboratory context
- Avoid any schema that implies retail, medical, or consumer use
- Focus on scientific research and laboratory applications

