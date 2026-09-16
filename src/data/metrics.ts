export type MetricSystem = 'INR' | 'USD';

export interface FormattedMetrics {
  disbursementMonthly: string;
  disbursementMonthlyShort: string;
  disbursementVolume: string;
  ckycThroughput: string;
  ckycRecords: string;
  ckycThroughputShort: string;
  docGenMonthly: string;
  docGenAgreements: string;
  docGenVolumeShort: string;
  collateralTurnaround: string;
  collateralTurnaroundText: string;
  disbursementThroughput: string;
  pennyDrop: string;
}

export const METRICS = {
  disbursementMonthly: {
    INR: '₹50 Cr+/month',
    USD: '$6M+/month',
  },
  disbursementMonthlyShort: {
    INR: '₹50 Cr+/mo',
    USD: '$6M+/mo',
  },
  disbursementVolume: {
    INR: '₹50 Cr+',
    USD: '$6M+',
  },
  ckycThroughput: {
    INR: '3 Lakh+ cases/hour',
    USD: '300K+ cases/hour',
  },
  ckycRecords: {
    INR: '3 Lakh+ records/hour',
    USD: '300K+ records/hour',
  },
  ckycThroughputShort: {
    INR: '3 Lakh+ cases/hr',
    USD: '300K+ cases/hr',
  },
  docGenMonthly: {
    INR: '1 Lakh+ compliant loan contracts monthly',
    USD: '100K+ compliant loan contracts monthly',
  },
  docGenAgreements: {
    INR: '1 Lakh+ agreements monthly',
    USD: '100K+ agreements monthly',
  },
  docGenVolumeShort: {
    INR: '1 Lakh+ docs/mo',
    USD: '100K+ docs/mo',
  },
  collateralTurnaround: {
    INR: '7d → 24–48h',
    USD: '7d → 24–48h',
  },
  collateralTurnaroundText: {
    INR: '7 days to 24–48 hours',
    USD: '7 days to 24–48 hours',
  },
  disbursementThroughput: {
    INR: '10x increase',
    USD: '10x increase',
  },
  pennyDrop: {
    INR: '₹1 drop',
    USD: 'penny drop',
  },
} as const;

export function getMetrics(unit: MetricSystem): FormattedMetrics {
  return {
    disbursementMonthly: METRICS.disbursementMonthly[unit],
    disbursementMonthlyShort: METRICS.disbursementMonthlyShort[unit],
    disbursementVolume: METRICS.disbursementVolume[unit],
    ckycThroughput: METRICS.ckycThroughput[unit],
    ckycRecords: METRICS.ckycRecords[unit],
    ckycThroughputShort: METRICS.ckycThroughputShort[unit],
    docGenMonthly: METRICS.docGenMonthly[unit],
    docGenAgreements: METRICS.docGenAgreements[unit],
    docGenVolumeShort: METRICS.docGenVolumeShort[unit],
    collateralTurnaround: METRICS.collateralTurnaround[unit],
    collateralTurnaroundText: METRICS.collateralTurnaroundText[unit],
    disbursementThroughput: METRICS.disbursementThroughput[unit],
    pennyDrop: METRICS.pennyDrop[unit],
  };
}
