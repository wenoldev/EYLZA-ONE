import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import api from '@/lib/api';

const AdminPlans = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [newPlan, setNewPlan] = useState({ name: '', price: '', interval: 'month' });

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
    if (!newPlan.name || !newPlan.price) return;

    try {
      const response = await api.post('/api/v1/admin/plans',
        {
          name: newPlan.name,
          price: parseFloat(newPlan.price),
          interval: newPlan.interval,
          features: [] // Add feature input later if needed
        }
      );

      if (response.status === 200 || response.status === 201) {
        setNewPlan({ name: '', price: '', interval: 'month' });
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
              <Label htmlFor="planPrice">Price</Label>
              <Input
                id="planPrice"
                type="number"
                value={newPlan.price}
                onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="planInterval">Interval</Label>
              <select
                id="planInterval"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newPlan.interval}
                onChange={(e) => setNewPlan({ ...newPlan, interval: e.target.value })}
              >
                <option value="month">Monthly</option>
                <option value="year">Yearly</option>
              </select>
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
                <TableHead>Price</TableHead>
                <TableHead>Interval</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>{plan.name}</TableCell>
                  <TableCell>${plan.price}</TableCell>
                  <TableCell>{plan.interval}</TableCell>
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
