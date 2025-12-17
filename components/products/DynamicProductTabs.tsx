'use client';

import { useState, lazy, Suspense } from 'react';
import { Product } from '@/data/products';

// Dynamic imports for tab content (code-split)
const ChemicalInfoTab = lazy(() => import('./tabs/ChemicalInfoTab'));
const ResearchApplicationsTab = lazy(() => import('./tabs/ResearchApplicationsTab'));
const SpecificationsTab = lazy(() => import('./tabs/SpecificationsTab'));

interface DynamicProductTabsProps {
  product: Product;
}

export default function DynamicProductTabs({ product }: DynamicProductTabsProps) {
  const [activeTab, setActiveTab] = useState<'chemical' | 'research' | 'specifications'>('chemical');

  const tabs = [
    { id: 'chemical' as const, label: 'Chemical Formula' },
    { id: 'research' as const, label: 'Research Applications' },
    { id: 'specifications' as const, label: 'Specifications' },
  ];

  return (
    <div className="mt-12">
      {/* Tab Navigation */}
      <div className="border-b border-taupe mb-8">
        <div className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap font-serif ${
                activeTab === tab.id
                  ? 'border-charcoal text-charcoal font-semibold'
                  : 'border-transparent text-stone hover:text-charcoal'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content with Suspense for code-split loading */}
      <div className="bg-ivory border border-taupe rounded-lg p-8">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-charcoal"></div>
            </div>
          }
        >
          {activeTab === 'chemical' && <ChemicalInfoTab product={product} />}
          {activeTab === 'research' && <ResearchApplicationsTab product={product} />}
          {activeTab === 'specifications' && <SpecificationsTab product={product} />}
        </Suspense>
      </div>
    </div>
  );
}

