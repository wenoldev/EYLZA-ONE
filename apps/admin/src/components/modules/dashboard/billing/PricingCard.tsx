import React from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { type PricingPlan, CURRENCY_SYMBOL } from '@/constants/plans';

interface PricingCardProps {
  plan: PricingPlan;
  billingCycle: 'monthly' | 'annually';
  onSelect: (plan: PricingPlan) => void;
  loading?: boolean;
}

export const PricingCard: React.FC<PricingCardProps> = ({ plan, billingCycle, onSelect, loading }) => {
  const currentPrice = billingCycle === 'annually' ? plan.price.annually : plan.price.monthly;
  const period = billingCycle === 'annually' ? 'year' : 'month';

  return (
    <div className={`border px-6 py-12 rounded-3xl relative transition-all duration-300 hover:shadow-2xl ${plan.popular ? 'border-primary ring-1 ring-primary' : 'border-border'}`}>
      <div className="mb-4">
        <h3 className="text-xl font-semibold">{plan.name}</h3>
        <p className="text-sm text-muted-foreground">{plan.description}</p>
      </div>
      
      <div className="mb-6">
        <div className="text-4xl font-bold mb-2 h-12 flex items-baseline">
          {currentPrice !== 0 ? (
            <>
              {CURRENCY_SYMBOL}{currentPrice}
              <span className="text-sm font-normal text-gray-500 ml-1">/{period}</span>
            </>
          ) : (
            'Free'
          )}
        </div>
        <Button 
          className="w-full py-6 text-white font-semibold rounded-xl"
          onClick={() => onSelect(plan)}
          disabled={loading}
        >
          {plan.has_trial && billingCycle === 'monthly' ? 'Start Free Trial' : (currentPrice === 0 ? 'Start Free' : 'Buy plan')}
        </Button>
      </div>

      <div>
        <ul className="space-y-3 mt-4">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              {feature.available ? (
                <Check className="text-primary mr-3 h-5 w-5 shrink-0" />
              ) : (
                <X className="text-red-500 mr-3 h-5 w-5 shrink-0" />
              )}
              <span className="text-sm text-gray-700">{feature.value}</span>
            </li>
          ))}
        </ul>
      </div>

      {plan.popular && (
        <div className="absolute top-0 right-0 bg-primary text-white text-xs font-semibold px-4 py-1.5 rounded-bl-xl rounded-tr-3xl">
          Most popular
        </div>
      )}
    </div>
  );
};
