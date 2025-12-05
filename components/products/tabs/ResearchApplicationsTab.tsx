import { Product } from '@/data/products';
import { getComplianceText } from '@/lib/utils/compliance-text';

interface ResearchApplicationsTabProps {
  product: Product;
}

export default function ResearchApplicationsTab({ product }: ResearchApplicationsTabProps) {
  return (
    <div>
      <h3 className="text-heading text-2xl font-bold text-white mb-6">
        Research Applications
      </h3>
      <p className="text-gray-300 leading-relaxed mb-6">
        {product.researchApplications ||
          'Research applications information will be displayed here.'}
      </p>
      <div className="p-4 bg-yellow-500/10 border-l-4 border-yellow-500 rounded">
        <p className="text-sm text-yellow-300 font-semibold mb-2">
          Important Research Note:
        </p>
        <p className="text-sm text-yellow-200">
          {getComplianceText('NO_MEDICAL_ADVICE')}
        </p>
      </div>
    </div>
  );
}

