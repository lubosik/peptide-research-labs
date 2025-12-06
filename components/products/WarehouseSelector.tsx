'use client';

import { useWarehouse } from '@/lib/context/WarehouseContext';
import { useState } from 'react';

interface WarehouseSelectorProps {
  showTooltip?: boolean;
  className?: string;
}

export default function WarehouseSelector({ showTooltip = true, className = '' }: WarehouseSelectorProps) {
  const { selectedWarehouse, setSelectedWarehouse, getWarehouseDescription } = useWarehouse();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-semibold text-white mb-2">
        CHOOSE WAREHOUSE
      </label>
      
      <div className="flex gap-3">
        {/* Overseas Warehouse Option */}
        <button
          type="button"
          onClick={() => setSelectedWarehouse('overseas')}
          className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
            selectedWarehouse === 'overseas'
              ? 'border-primary bg-primary/10 text-white shadow-glow-sm'
              : 'border-gray-600 bg-slate-800 text-gray-300 hover:border-gray-500'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">🌍</span>
            <div className="text-left">
              <div className="font-semibold text-sm">Overseas</div>
              <div className="text-xs opacity-75">Direct Shipping</div>
            </div>
          </div>
        </button>

        {/* US Warehouse Option */}
        <button
          type="button"
          onClick={() => setSelectedWarehouse('us')}
          className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
            selectedWarehouse === 'us'
              ? 'border-primary bg-primary/10 text-white shadow-glow-sm'
              : 'border-gray-600 bg-slate-800 text-gray-300 hover:border-gray-500'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">🇺🇸</span>
            <div className="text-left">
              <div className="font-semibold text-sm">U.S. Warehouse</div>
              <div className="text-xs opacity-75">Re-tested & Verified</div>
            </div>
          </div>
        </button>
      </div>

      {/* Warehouse Information */}
      <div className="mt-3 space-y-2">
        <button
          type="button"
          onClick={() => setShowInfo(!showInfo)}
          className="text-xs text-gray-400 hover:text-primary transition-colors flex items-center gap-1 w-full"
          aria-label="Warehouse information"
        >
          <span>ℹ️</span>
          <span>What's the difference between warehouses?</span>
          <svg
            className={`w-3 h-3 transition-transform ${showInfo ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {showInfo && (
          <div className="mt-2 p-4 bg-slate-800 border border-gray-700 rounded-lg text-sm text-gray-300 space-y-3">
            <div>
              <strong className="text-white flex items-center gap-2 mb-1">
                <span>🌍</span> Overseas Warehouse
              </strong>
              <p className="text-xs text-gray-400">
                Shipped directly from our verified international partner facilities. This option offers the most cost-effective pricing with standard international shipping times. Products are sourced from our trusted overseas manufacturing partners and shipped directly to your location.
              </p>
            </div>
            <div>
              <strong className="text-white flex items-center gap-2 mb-1">
                <span>🇺🇸</span> U.S. Warehouse
              </strong>
              <p className="text-xs text-gray-400">
                Re-tested and quality-verified in U.S. laboratories prior to domestic shipment. This option includes expedited U.S. re-test handling, ensuring additional quality verification steps are completed in domestic facilities. Products undergo additional quality control testing in the United States before shipment, with faster domestic delivery times. A $10 expedited handling fee applies.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Current Selection Description */}
      <div className="mt-2 p-3 bg-slate-800/50 border border-gray-700/50 rounded-lg text-xs text-gray-400">
        <p className="font-semibold text-white mb-1">Selected: {selectedWarehouse === 'us' ? 'U.S. Warehouse' : 'Overseas Warehouse'}</p>
        <p>{getWarehouseDescription()}</p>
      </div>
    </div>
  );
}

