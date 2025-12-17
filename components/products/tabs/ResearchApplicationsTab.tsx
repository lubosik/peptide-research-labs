import { Product } from '@/data/products';
import { getComplianceText } from '@/lib/utils/compliance-text';

interface ResearchApplicationsTabProps {
  product: Product;
}

export default function ResearchApplicationsTab({ product }: ResearchApplicationsTabProps) {
  return (
    <div>
      <h3 className="text-heading text-2xl font-bold text-charcoal mb-6">
        Research Applications
      </h3>
      <p className="text-charcoal leading-relaxed mb-6">
        {product.researchApplications ||
          'Research applications information will be displayed here.'}
      </p>
      <div className="p-4 bg-taupe border-l-4 border-stone rounded">
        <p className="text-sm text-charcoal font-semibold mb-2">
          Important Research Note:
        </p>
        <p className="text-sm text-charcoal">
          {getComplianceText('NO_MEDICAL_ADVICE')}
        </p>
      </div>
    </div>
  );
}

