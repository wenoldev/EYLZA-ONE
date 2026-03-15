import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import api from '@/lib/api';

const AdminPlans = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [newPlan, setNewPlan] = useState({ name: '', monthlyPrice: '', annuallyPrice: '' });

  const fetchPlans = async () => {
    try {
      const response = await api.get('/api/v1/admin/plans');
      if (response.data?.data?.plans) {
        setPlans(response.data.data.plans);
      }
    } catch (error) {
      console.error('Failed to fetch plans', error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleCreate = async () => {
    if (!newPlan.name || !newPlan.monthlyPrice || !newPlan.annuallyPrice) return;

    try {
      const response = await api.post('/api/v1/admin/plans',
        {
          name: newPlan.name,
          price: {
            monthly: parseFloat(newPlan.monthlyPrice),
            annually: parseFloat(newPlan.annuallyPrice)
          },
          features: [], // Add feature input later if needed
          is_active: true
        }
      );

      if (response.status === 200 || response.status === 201) {
        setNewPlan({ name: '', monthlyPrice: '', annuallyPrice: '' });
        fetchPlans();
      }
    } catch (error) {
      console.error('Failed to create plan', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Plan Settings</h2>

      <Card>
        <CardHeader>
          <CardTitle>Create New Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="planName">Plan Name</Label>
              <Input
                id="planName"
                value={newPlan.name}
                onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                placeholder="e.g. Pro Plan"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthlyPrice">Monthly Price</Label>
              <Input
                id="monthlyPrice"
                type="number"
                value={newPlan.monthlyPrice}
                onChange={(e) => setNewPlan({ ...newPlan, monthlyPrice: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="annuallyPrice">Annually Price</Label>
              <Input
                id="annuallyPrice"
                type="number"
                value={newPlan.annuallyPrice}
                onChange={(e) => setNewPlan({ ...newPlan, annuallyPrice: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>
          <Button onClick={handleCreate}>Create Plan</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Monthly Price</TableHead>
                <TableHead>Annually Price</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>{plan.name}</TableCell>
                  <TableCell>₹{plan.price?.monthly}</TableCell>
                  <TableCell>₹{plan.price?.annually}</TableCell>
                  <TableCell>{plan.is_active ? 'Active' : 'Inactive'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPlans;
