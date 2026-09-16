import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type MetricSystem, type FormattedMetrics, getMetrics } from '../data/metrics';

interface MetricContextType {
  unit: MetricSystem;
  setUnit: (unit: MetricSystem) => void;
  toggleUnit: () => void;
  metric: FormattedMetrics;
}

const MetricContext = createContext<MetricContextType | undefined>(undefined);

const STORAGE_KEY = 'portfolio_unit_system';

export function MetricProvider({ children }: { children: ReactNode }) {
  const [unit, setUnitState] = useState<MetricSystem>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'INR' || saved === 'USD') return saved;
    return 'INR';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, unit);
  }, [unit]);

  const setUnit = (newUnit: MetricSystem) => {
    setUnitState(newUnit);
  };

  const toggleUnit = () => {
    setUnitState((prev) => (prev === 'INR' ? 'USD' : 'INR'));
  };

  const metric = getMetrics(unit);

  return (
    <MetricContext.Provider value={{ unit, setUnit, toggleUnit, metric }}>
      {children}
    </MetricContext.Provider>
  );
}

export function useMetric(): MetricContextType {
  const context = useContext(MetricContext);
  if (!context) {
    throw new Error('useMetric must be used within a MetricProvider');
  }
  return context;
}
