import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PricingCard } from './PricingCard';
import type { PricingPlan } from '@/constants/plans';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import api from '@/lib/api';
import Loader from '@/components/common/Loader';
import { useAuthStore } from '@/stores/authStore';
import { LogOut } from 'lucide-react';

const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const storeId = searchParams.get('storeId');
  const { logout } = useAuthStore();


  const [trialLoading, setTrialLoading] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        try {
          const response = await api.get(`/api/v1/admin/plans${storeId ? `?storeId=${storeId}` : ''}`);
          if (response.data?.data?.plans) {
            console.log(response.data?.data?.plans);
            setPlans(response.data?.data?.plans)
          }
        } catch (e) {
          console.warn('Could not fetch real plans, using defaults');
        }
      } catch (error) {
        console.error('Failed to fetch plans', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [storeId]);

  const handleSelectPlan = async (plan: PricingPlan) => {
    if (plan.has_trial && storeId) {
      setTrialLoading(true);
      try {
        const response = await api.post('/api/v1/billing/trial', {
          storeId,
          planId: plan.id
        });
        if (response.data?.error) {
          throw new Error(response.data.error.message);
        }
        // Success! Redirect to dashboard
        window.location.href = '/dashboard';
      } catch (err: any) {
        console.error('Failed to start trial', err);
        alert(err.message || 'Failed to start trial. Please try again.');
        setTrialLoading(false);
      }
      return;
    }

    const params = new URLSearchParams();
    if (storeId) params.set('storeId', storeId);
    params.set('planId', plan.id);
    params.set('billingCycle', billingCycle);
    navigate(`/checkout?${params.toString()}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen relative">
      <button 
        onClick={handleLogout}
        className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Log out
      </button>
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the best plan for your business. Upgrade or downgrade anytime.
          </p>
        </div>

        <div className="flex justify-center items-center mb-12">
          <Tabs 
            value={billingCycle} 
            onValueChange={(val) => setBillingCycle(val as 'monthly' | 'annually')}
          >
            <TabsList className="h-12 p-1 bg-gray-100 rounded-2xl">
              <TabsTrigger 
                value="monthly" 
                className="rounded-xl px-8 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Monthly
              </TabsTrigger>
              <TabsTrigger 
                value="annually" 
                className="rounded-xl px-8 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Annually
                <span className="ml-2 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                  Save 20%
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              billingCycle={billingCycle}
              onSelect={handleSelectPlan}
              loading={trialLoading}
            />
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="text-gray-500 mb-4 font-medium">Included in all plans:</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            <span className="flex items-center text-sm text-gray-600">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span> No setup fees
            </span>
            <span className="flex items-center text-sm text-gray-600">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span> 24/7 Support
            </span>
            <span className="flex items-center text-sm text-gray-600">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span> 1-month trial on paid plans
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
