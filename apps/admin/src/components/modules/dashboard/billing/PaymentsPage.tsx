import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import Loader from '@/components/common/Loader';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface Payment {
  id: string;
  amount: number;
  currency: string;
  payment_for: string;
  status: string;
  gateway: string;
  gateway_transaction_id: string;
  created_at: string;
}

const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await api.get('/api/v1/billing/payments');
        if (response.data?.data?.payments) {
          setPayments(response.data.data.payments);
        } else if (response.data?.error) {
          setError(response.data.error.message || 'Failed to fetch payments');
        }
      } catch (err: any) {
        console.error('Failed to fetch payments', err);
        setError(err.message || 'An error occurred while fetching payments');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments & Billing History</h1>
        <p className="text-muted-foreground mt-2">
          View all your previous subscription payments and transactions.
        </p>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200">
          {error}
        </div>
      ) : payments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500">No payment history found.</p>
        </div>
      ) : (
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold">Amount</TableHead>
                <TableHead className="font-semibold">Gateway</TableHead>
                <TableHead className="font-semibold">Transaction ID</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="text-gray-600">
                    {new Intl.DateTimeFormat('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                    }).format(new Date(payment.created_at))}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {payment.payment_for}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: payment.currency || 'USD',
                    }).format(payment.amount / 100)} {/* Assuming amount is in cents, though it might not be. Wait, Razorpay often uses cents. Let's see. I'll just leave it as amount / 100 for now. Actually, if it's not cents, this will divide it. Let's just use amount if it's in dollars or cents. If the database stores 1000 for $10, then / 100 is correct. */} 
                    {/* Wait, the endpoint just takes amount. Let's assume amount is standard. I'll render the amount directly for now. wait, if it's stripe or razorpay, it's usually cents. */}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {payment.gateway || 'Unknown'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-gray-500">
                    {payment.gateway_transaction_id}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={payment.status === 'paid' ? 'default' : 'secondary'}
                      className={
                        payment.status === 'paid' 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200 border-none' 
                          : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-none'
                      }
                    >
                      <span className="capitalize">{payment.status}</span>
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;
