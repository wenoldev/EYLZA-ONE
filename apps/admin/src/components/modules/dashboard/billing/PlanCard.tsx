import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  features: string[];
}

interface PlanCardProps {
  plan: Plan;
  onSelect: (planId: string) => void;
  isSelected?: boolean;
  loading?: boolean;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, onSelect, isSelected, loading }) => {
  return (
    <Card className={`relative flex flex-col h-full transition-all duration-300 hover:shadow-xl ${isSelected ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-border hover:border-primary/50'}`}>
      {isSelected && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Selected
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{plan.description}</p>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">${plan.price}</span>
          <span className="text-muted-foreground">/{plan.interval}</span>
        </div>
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          variant={isSelected ? "outline" : "default"}
          onClick={() => onSelect(plan.id)}
          disabled={loading}
        >
          {isSelected ? 'Current Plan' : 'Select Plan'}
        </Button>
      </CardFooter>
    </Card>
  );
};
