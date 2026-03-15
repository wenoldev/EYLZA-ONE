import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { type PricingPlan, CURRENCY_SYMBOL } from '@/constants/plans';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ChevronLeft, Loader2, CreditCard, ShieldCheck } from 'lucide-react';
import { loadRazorpayScript } from '@/lib/razorpay';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

export const CheckoutPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const planId = searchParams.get('planId');
  const storeId = searchParams.get('storeId');
  const billingCycle = (searchParams.get('billingCycle') || 'monthly') as 'monthly' | 'annually';
  const pluginId = searchParams.get('pluginId');

  const [plan, setPlan] = useState<PricingPlan | null>(null);
  const [plugin] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    name: user?.user_metadata?.full_name || user?.user_metadata?.name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  useEffect(() => {
    const fetchSelectedData = async () => {
      if (planId) {
        try {
          const response = await api.get('/api/v1/admin/plans');
          if (response.data?.data?.plans) {
            const plans: PricingPlan[] = response.data.data.plans;
            const selectedPlan = plans.find(p => p.id === planId);
            if (selectedPlan) setPlan(selectedPlan);
          }
        } catch (error) {
          console.error("Failed to fetch plan details", error);
        }
      }

      if (pluginId) {
        // Fetch plugin details if needed
        // setPlugin({ id: pluginId, name: 'Sample Plugin', price: 19 });
      }
    };
    
    fetchSelectedData();
  }, [planId, pluginId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingDetails(prev => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    if (plugin) return plugin.price;
    if (!plan) return 0;
    
    if (plan.id === 'free') return 2; // Flat 2 RS for verification
    
    return billingCycle === 'annually' ? plan.price.annually : plan.price.monthly;
  };

  const handlePayment = async () => {
    if (!plan && !plugin) return;
    
    setLoading(true);
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error('Razorpay SDK failed to load. Please try again.');
        return;
      }

      const amount = calculateTotal();
      
      // 1. Create Razorpay Order
      const orderRes = await api.post('/api/v1/billing/razorpay/order', {
        amount: amount,
        currency: 'INR',
        receipt: `checkout_${Date.now()}`
      });

      const { order } = orderRes.data.data;

      // 2. Trigger Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'EYLZA',
        description: plugin ? `Purchase ${plugin.name}` : `Subscription for ${plan?.name}`,
        order_id: order.id,
        handler: async (response: any) => {
          try {
            await api.post('/api/v1/billing/razorpay/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              storeId: storeId,
              planId: plan?.id,
              pluginId: plugin?.id,
              amount: amount,
              billingDetails,
              interval: billingCycle === 'annually' ? 'year' : 'month'
            });
            
            toast.success('Payment successful!');
            navigate('/dashboard');
          } catch (err) {
            console.error('Payment verification failed', err);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: billingDetails.name,
          email: billingDetails.email,
          contact: billingDetails.phone
        },
        theme: {
          color: '#3e89ff'
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment failed', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!plan && !plugin) {
    return <div className="p-12 text-center text-gray-500">Item not found. Please go back and try again.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-8 hover:bg-white"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to selection
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Billing Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={billingDetails.name} 
                      onChange={handleInputChange} 
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email"
                      value={billingDetails.email} 
                      onChange={handleInputChange} 
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={billingDetails.phone} 
                    onChange={handleInputChange} 
                    placeholder="+91 9876543210"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Billing Address</Label>
                  <Input 
                    id="address" 
                    name="address" 
                    value={billingDetails.address} 
                    onChange={handleInputChange} 
                    placeholder="123 Main St, Apartment 4B"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city" 
                      name="city" 
                      value={billingDetails.city} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input 
                      id="state" 
                      name="state" 
                      value={billingDetails.state} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input 
                      id="zip" 
                      name="zip" 
                      value={billingDetails.zip} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 text-blue-600 mt-1 shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900">Secure Payment</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Your payment information is processed securely through Razorpay. We do not store your credit card details on our servers.
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="border-none shadow-md overflow-hidden">
              <CardHeader className="bg-gray-900 text-white">
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {plugin ? plugin.name : plan?.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {plugin ? 'One-time purchase' : `${billingCycle === 'annually' ? 'Annual' : 'Monthly'} subscription`}
                    </p>
                  </div>
                  <span className="font-bold">
                    {CURRENCY_SYMBOL}{plugin ? plugin.price : (plan?.id === 'free' ? 0 : (billingCycle === 'annually' ? plan?.price.annually : plan?.price.monthly))}
                  </span>
                </div>

                {plan?.id === 'free' && (
                  <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-800">
                    <strong>Verification Required:</strong> A nominal charge of {CURRENCY_SYMBOL}2 will be applied for payment proof validation.
                  </div>
                )}

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{CURRENCY_SYMBOL}{calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span>{CURRENCY_SYMBOL}0.00</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold pt-2 text-gray-900 border-t">
                    <span>Total</span>
                    <span>{CURRENCY_SYMBOL}{calculateTotal()}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 bg-gray-50">
                <Button 
                  className="w-full py-6 text-lg font-bold bg-blue-600 hover:bg-blue-700"
                  onClick={handlePayment}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Complete Payment
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <div className="text-center px-4">
              <p className="text-xs text-gray-500">
                By completing this purchase, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
