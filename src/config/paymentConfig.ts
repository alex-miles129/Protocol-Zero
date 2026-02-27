// Payment Gateway Configuration
export const PAYMENT_CONFIG = {
  // Supported currencies
  currencies: ['INR', 'USD', 'EUR'] as const,
  
  // Default currency
  defaultCurrency: 'INR' as const,
  
  // Payment methods
  paymentMethods: {
    card: {
      name: 'Credit/Debit Card',
      icon: '💳',
      enabled: true,
    },
    upi: {
      name: 'UPI',
      icon: '📱',
      enabled: true,
    },
    wallet: {
      name: 'Digital Wallet',
      icon: '👛',
      enabled: true,
    },
    netbanking: {
      name: 'Net Banking',
      icon: '🏦',
      enabled: true,
    },
  },
  
  // Payment settings
  settings: {
    minAmount: 1,
    maxAmount: 1000000,
    orderExpiryMinutes: 15,
    paymentTimeoutSeconds: 300, // 5 minutes
  },
  
  // UI Configuration
  ui: {
    primaryColor: '#000000',
    accentColor: '#ffffff',
    borderRadius: '8px',
    animationDuration: 300,
  },
} as const;

export type PaymentMethod = keyof typeof PAYMENT_CONFIG.paymentMethods;
export type Currency = typeof PAYMENT_CONFIG.currencies[number];





