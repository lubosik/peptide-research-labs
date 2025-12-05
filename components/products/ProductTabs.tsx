'use client';

import { useState } from 'react';
import { getComplianceText } from '@/lib/utils/compliance-text';

interface Product {
  id: string;
  name: string;
  chemicalFormula?: string;
  molarMass?: string;
  casNumber?: string;
  synonyms?: string[];
  pubchemId?: string;
  shelfLife?: string;
  researchApplications?: string;
  storageRequirements?: string;
  handlingGuidelines?: string;
}

interface ProductTabsProps {
  product: Product;
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<'chemical' | 'research' | 'safety'>('chemical');

  return (
    <div>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <div className="flex space-x-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('chemical')}
            className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'chemical'
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-text-gray hover:text-primary'
            }`}
          >
            Chemical Information
          </button>
          <button
            onClick={() => setActiveTab('research')}
            className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'research'
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-text-gray hover:text-primary'
            }`}
          >
            Research Applications
          </button>
          <button
            onClick={() => setActiveTab('safety')}
            className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'safety'
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-text-gray hover:text-primary'
            }`}
          >
            Safety & Handling
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg p-8">
        {/* Chemical Information */}
        {activeTab === 'chemical' && (
          <div>
            <h3 className="text-heading text-2xl font-bold text-accent-gray mb-6">
              Chemical Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.chemicalFormula && (
                <div>
                  <span className="text-sm font-semibold text-text-gray">CHEMICAL FORMULA:</span>
                  <p className="text-lg font-mono text-accent-gray">{product.chemicalFormula}</p>
                </div>
              )}
              {product.molarMass && (
                <div>
                  <span className="text-sm font-semibold text-text-gray">MOLAR MASS:</span>
                  <p className="text-lg text-accent-gray">{product.molarMass}</p>
                </div>
              )}
              {product.casNumber && (
                <div>
                  <span className="text-sm font-semibold text-text-gray">CAS NUMBER:</span>
                  <p className="text-lg text-accent-gray">{product.casNumber}</p>
                </div>
              )}
              {product.pubchemId && (
                <div>
                  <span className="text-sm font-semibold text-text-gray">PUBCHEM:</span>
                  <p className="text-lg text-accent-gray">{product.pubchemId}</p>
                </div>
              )}
              {product.synonyms && product.synonyms.length > 0 && (
                <div className="md:col-span-2">
                  <span className="text-sm font-semibold text-text-gray">SYNONYMS:</span>
                  <p className="text-lg text-accent-gray">{product.synonyms.join(', ')}</p>
                </div>
              )}
              {product.shelfLife && (
                <div>
                  <span className="text-sm font-semibold text-text-gray">SHELF LIFE:</span>
                  <p className="text-lg text-accent-gray">{product.shelfLife}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Research Applications */}
        {activeTab === 'research' && (
          <div>
            <h3 className="text-heading text-2xl font-bold text-accent-gray mb-6">
              Research Applications
            </h3>
            <p className="text-text-gray leading-relaxed mb-6">
              {product.researchApplications ||
                'Research applications information will be displayed here.'}
            </p>
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
              <p className="text-sm text-yellow-800 font-semibold mb-2">
                Important Research Note:
              </p>
              <p className="text-sm text-yellow-700">
                {getComplianceText('NO_MEDICAL_ADVICE')}
              </p>
            </div>
          </div>
        )}

        {/* Safety & Handling */}
        {activeTab === 'safety' && (
          <div>
            <h3 className="text-heading text-2xl font-bold text-accent-gray mb-6">
              Safety & Handling
            </h3>
            {product.storageRequirements && (
              <div className="mb-6">
                <h4 className="font-semibold text-accent-gray mb-2">Storage Requirements:</h4>
                <p className="text-text-gray">{product.storageRequirements}</p>
              </div>
            )}
            {product.handlingGuidelines && (
              <div className="mb-6">
                <h4 className="font-semibold text-accent-gray mb-2">Handling Guidelines:</h4>
                <p className="text-text-gray">{product.handlingGuidelines}</p>
              </div>
            )}
            <div className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
              <p className="text-sm text-orange-800 font-semibold mb-2">
                Safety & Handling Disclaimer:
              </p>
              <p className="text-sm text-orange-700">
                {getComplianceText('USE_AT_OWN_RISK')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

