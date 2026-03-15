import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlanCard } from '../dashboard/billing/PlanCard';
import api from '@/lib/api';
import Loader from '@/components/common/Loader';
import { ChevronLeft, Loader2 } from 'lucide-react';
import type { StoreFormData } from './index';
import { loadRazorpayScript } from '@/lib/razorpay';
import { useAuthStore } from '@/stores/authStore';

interface PlanSelectionStepProps {
  formData: StoreFormData & { plan_id?: string };
  updateFormData: (data: Partial<StoreFormData & { plan_id: string }>) => void;
  onBack: () => void;
  onSubmit: () => Promise<any>;
  loading: boolean;
}

export function PlanSelectionStep({ formData, updateFormData, onBack, onSubmit, loading }: PlanSelectionStepProps) {
  const [plans, setPlans] = useState<any[]>([]);
  const [fetchingPlans, setFetchingPlans] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/api/v1/admin/plans');
        setPlans(response.data.data.plans);
        // Default select the first plan if none selected
        if (!formData.plan_id && response.data.data.plans.length > 0) {
          updateFormData({ plan_id: response.data.data.plans[0].id });
        }
      } catch (error) {
        console.error('Failed to fetch plans', error);
      } finally {
        setFetchingPlans(false);
      }
    };
    fetchPlans();
  }, []);

  const handleCompleteSetup = async () => {
    const plan = plans.find(p => p.id === formData.plan_id);
    if (!plan) return;

    setPaymentLoading(true);
    try {
      // 1. Create the store first (with 1-month trial)
      const storeRes = await onSubmit();
      if (!storeRes) return;

      const storeId = storeRes.id;

      // 2. Load Razorpay script
      const res = await loadRazorpayScript();
      if (!res) {
        alert('Razorpay SDK failed to load. Your store has been created with a 1-month trial.');
        window.location.href = '/dashboard';
        return;
      }

      // 3. Create Razorpay Order
      const orderRes = await api.post('/api/v1/billing/razorpay/order', {
        amount: plan.price,
        currency: 'INR',
        receipt: `rcpt_${storeId.substring(0, 10)}`
      });

      const { order } = orderRes.data.data;

      // 4. Trigger Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'EYLZA',
        description: `Subscription for ${plan.name}`,
        order_id: order.id,
        handler: async (response: any) => {
          try {
            await api.post('/api/v1/billing/razorpay/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              storeId: storeId,
              planId: plan.id,
              amount: plan.price,
              interval: plan.interval
            });
            window.location.href = '/dashboard';
          } catch (err) {
            console.error('Payment verification failed', err);
            alert('Your store was created, but payment verification failed. You can manage it from the dashboard.');
            window.location.href = '/dashboard';
          }
        },
        prefill: {
          name: user?.user_metadata?.full_name || user?.user_metadata?.name,
          email: user?.email,
          contact: user?.user_metadata?.phone
        },
        theme: {
          color: '#3e89ff'
        },
        modal: {
          ondismiss: () => {
            // If they cancel payment, they still have the 1-month trial
            window.location.href = '/dashboard';
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Setup failed', err);
      alert('Something went wrong during store setup.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleStartTrial = async () => {
    setPaymentLoading(true);
    try {
      const storeRes = await onSubmit();
      if (storeRes) {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      console.error('Trial setup failed', err);
      alert('Something went wrong during store setup.');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (fetchingPlans) return <div className="p-12 flex justify-center"><Loader /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Select a Plan for your store.</h2>
          <p className="text-sm text-gray-600 mt-2">
            Don't worry, you won't be charged today. All plans start with a 1-month free trial.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onSelect={(id) => updateFormData({ plan_id: id })}
            isSelected={formData.plan_id === plan.id}
          />
        ))}
      </div>

      <div className="pt-6 space-y-4">
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-bold"
          onClick={handleCompleteSetup}
          disabled={!formData.plan_id || loading || paymentLoading}
        >
          {loading || paymentLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {loading ? 'Creating Store...' : 'Finalizing Setup...'}
            </>
          ) : (
            "Select Plan & Continue"
          )}
        </Button>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <Button 
          variant="outline"
          className="w-full py-6 text-lg font-bold border-blue-600 text-blue-600 hover:bg-blue-50"
          onClick={handleStartTrial}
          disabled={!formData.plan_id || loading || paymentLoading}
        >
          {loading || paymentLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            "Start 1-Month Free Trial"
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground mt-4">
          By clicking Complete Setup, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
