export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    annually: number;
  };
  features: {
    available: boolean;
    value: string;
  }[];
  popular?: boolean;
  has_trial?: boolean;
}

export const CURRENCY_SYMBOL = '₹';
