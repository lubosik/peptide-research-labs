'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '@/data/products';

export type Warehouse = 'overseas' | 'us';

interface WarehouseContextType {
  selectedWarehouse: Warehouse;
  setSelectedWarehouse: (warehouse: Warehouse) => void;
  getPrice: (product: Product) => number;
  getWarehouseDescription: () => string;
  getWarehouseOption: (product: Product) => { priceMultiplier: number; description: string; available: boolean } | null;
}

const WarehouseContext = createContext<WarehouseContextType | undefined>(undefined);

const STORAGE_KEY = 'selectedWarehouse';
const DEFAULT_WAREHOUSE: Warehouse = 'overseas';

export function WarehouseProvider({ children }: { children: React.ReactNode }) {
  const [selectedWarehouse, setSelectedWarehouseState] = useState<Warehouse>(DEFAULT_WAREHOUSE);

  // Load warehouse preference from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const savedWarehouse = localStorage.getItem(STORAGE_KEY) as Warehouse | null;
    if (savedWarehouse === 'overseas' || savedWarehouse === 'us') {
      setSelectedWarehouseState(savedWarehouse);
    }
  }, []);

  // Save warehouse preference to localStorage whenever it changes
  const setSelectedWarehouse = useCallback((warehouse: Warehouse) => {
    setSelectedWarehouseState(warehouse);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, warehouse);
    }
  }, []);

  // Get warehouse option for current selection
  const getWarehouseOption = useCallback((product: Product) => {
    if (!product.warehouseOptions) {
      return null;
    }
    
    return product.warehouseOptions[selectedWarehouse] || null;
  }, [selectedWarehouse]);

  // Calculate price based on warehouse selection
  const getPrice = useCallback((product: Product): number => {
    const basePrice = product.price;
    const warehouseOption = getWarehouseOption(product);
    
    if (!warehouseOption) {
      return basePrice; // Fallback to base price if no warehouse options
    }
    
    return basePrice * warehouseOption.priceMultiplier;
  }, [getWarehouseOption]);

  // Get description for current warehouse
  const getWarehouseDescription = useCallback((): string => {
    if (selectedWarehouse === 'us') {
      return 'Re-tested and quality-verified in U.S. laboratories prior to domestic shipment.';
    }
    return 'Shipped directly from our verified international partner facilities.';
  }, [selectedWarehouse]);

  return (
    <WarehouseContext.Provider
      value={{
        selectedWarehouse,
        setSelectedWarehouse,
        getPrice,
        getWarehouseDescription,
        getWarehouseOption,
      }}
    >
      {children}
    </WarehouseContext.Provider>
  );
}

export function useWarehouse() {
  const context = useContext(WarehouseContext);
  if (context === undefined) {
    throw new Error('useWarehouse must be used within a WarehouseProvider');
  }
  return context;
}

