import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useStoreStore } from '@/stores/storeStore';
import { useAuthStore } from '@/stores/authStore';
import api from '@/lib/api';
import { PlanCard } from './PlanCard';
import Loader from '@/components/common/Loader';
import { AlertCircle, Lock } from 'lucide-react';
import { loadRazorpayScript } from '@/lib/razorpay';

export const BillingOverlay: React.FC = () => {
  const { stores, activeStoreId } = useStoreStore();
  const [billingInfo, setBillingInfo] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const { user } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      if (!activeStoreId) {
        setLoading(false);
        return;
      }
      try {
        const [billingRes, plansRes] = await Promise.all([
          api.get(`/api/v1/billing/status?storeId=${activeStoreId}`),
          api.get('/api/v1/admin/plans')
        ]);
        setBillingInfo(billingRes.data.data);
        setPlans(plansRes.data.data.plans);
      } catch (err) {
        console.error('Failed to fetch billing info', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeStoreId]);

  const handleSelectPlan = async (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    setPaymentLoading(true);
    try {
      if (!activeStoreId) {
        alert('Store ID not found. Please try refreshing the page.');
        return;
      }
      // 1. Load Razorpay script
      const res = await loadRazorpayScript();
      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        return;
      }

      // 2. Create Razorpay Order in Backend
      const orderRes = await api.post('/api/v1/billing/razorpay/order', {
        amount: plan.price,
        currency: 'INR',
        receipt: `rcpt_${activeStoreId.substring(0, 10)}`
      });

      const { order } = orderRes.data.data;

      // 3. Trigger Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'EYLZA',
        description: `Subscription for ${plan.name}`,
        order_id: order.id,
        handler: async (response: any) => {
          // 4. Verify Payment in Backend
          try {
            await api.post('/api/v1/billing/razorpay/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              storeId: activeStoreId,
              planId: planId,
              amount: plan.price,
              interval: plan.interval
            });
            
            // Success! Refresh to unblock
            window.location.reload();
          } catch (err) {
            console.error('Payment verification failed', err);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user?.user_metadata?.full_name || user?.user_metadata?.name,
          email: user?.email,
          contact: user?.user_metadata?.phone
        },
        theme: {
          color: '#3e89ff'
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment initialization failed', err);
      alert('Failed to initialize payment. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) return <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-[9999]"><Loader /></div>;

  if (!activeStoreId || !billingInfo?.isBlocked) return null;

  if (!billingInfo?.isBlocked) return null;

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-9999 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
      <div className="max-w-4xl w-full space-y-8">
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Your Store is Blocked</h1>
          <p className="text-xl text-muted-foreground flex items-center justify-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {billingInfo.subscriptionStatus === 'trial' 
              ? 'Your 1-month free trial has expired.' 
              : 'Your subscription has expired.'}
          </p>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Choose a plan below to reactive your store and continue managing your business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {plans.map((plan) => (
            <PlanCard 
              key={plan.id} 
              plan={plan} 
              onSelect={handleSelectPlan}
              loading={paymentLoading}
            />
          ))}
        </div>

        <div className="pt-8">
          <Button variant="ghost" onClick={() => (window.location.href = '/')}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};
