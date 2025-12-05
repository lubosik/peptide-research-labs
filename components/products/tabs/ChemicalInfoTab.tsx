import { Product } from '@/data/products';

interface ChemicalInfoTabProps {
  product: Product;
}

export default function ChemicalInfoTab({ product }: ChemicalInfoTabProps) {
  return (
    <div>
      <h3 className="text-heading text-2xl font-bold text-white mb-6">
        Chemical Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {product.chemicalFormula && (
          <div>
            <span className="text-sm font-semibold text-gray-400">CHEMICAL FORMULA:</span>
            <p className="text-lg font-mono text-white mt-1">{product.chemicalFormula}</p>
          </div>
        )}
        {product.molarMass && (
          <div>
            <span className="text-sm font-semibold text-gray-400">MOLAR MASS:</span>
            <p className="text-lg text-white mt-1">{product.molarMass}</p>
          </div>
        )}
        {product.casNumber && (
          <div>
            <span className="text-sm font-semibold text-gray-400">CAS NUMBER:</span>
            <p className="text-lg text-white mt-1">{product.casNumber}</p>
          </div>
        )}
        {product.pubchemId && (
          <div>
            <span className="text-sm font-semibold text-gray-400">PUBCHEM ID:</span>
            <p className="text-lg text-white mt-1">{product.pubchemId}</p>
          </div>
        )}
        {product.synonyms && product.synonyms.length > 0 && (
          <div className="md:col-span-2">
            <span className="text-sm font-semibold text-gray-400">SYNONYMS:</span>
            <p className="text-lg text-white mt-1">{product.synonyms.join(', ')}</p>
          </div>
        )}
        {product.shelfLife && (
          <div>
            <span className="text-sm font-semibold text-gray-400">SHELF LIFE:</span>
            <p className="text-lg text-white mt-1">{product.shelfLife}</p>
          </div>
        )}
      </div>
    </div>
  );
}

