import { Product } from '@/data/products';
import { getComplianceText } from '@/lib/utils/compliance-text';

interface SpecificationsTabProps {
  product: Product;
}

export default function SpecificationsTab({ product }: SpecificationsTabProps) {
  return (
    <div>
      <h3 className="text-heading text-2xl font-bold text-white mb-6">
        Safety & Handling Specifications
      </h3>
      {product.storageRequirements && (
        <div className="mb-6">
          <h4 className="font-semibold text-white mb-2">Storage Requirements:</h4>
          <p className="text-gray-300">{product.storageRequirements}</p>
        </div>
      )}
      {product.handlingGuidelines && (
        <div className="mb-6">
          <h4 className="font-semibold text-white mb-2">Handling Guidelines:</h4>
          <p className="text-gray-300">{product.handlingGuidelines}</p>
        </div>
      )}
      <div className="p-4 bg-orange-500/10 border-l-4 border-orange-500 rounded">
        <p className="text-sm text-orange-300 font-semibold mb-2">
          Safety & Handling Disclaimer:
        </p>
        <p className="text-sm text-orange-200">
          {getComplianceText('USE_AT_OWN_RISK')}
        </p>
      </div>
    </div>
  );
}

