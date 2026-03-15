
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import { useStoreStore } from '@/stores/storeStore';
import { toast } from 'sonner';
import Loader from '@/components/common/Loader';
import { Plus, Eye, RotateCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const TicketList = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { stores } = useStoreStore();
  const navigate = useNavigate();
  const currentStore = stores?.[0];
  const currentStoreId = currentStore?.id;

  const fetchTickets = async () => {
    if (!currentStoreId) {
      setLoading(false);
      return;
    }
    try {
      const response = await api.get('/api/v1/tickets', {
        params: { store_id: currentStoreId }
      });
      if (response.data?.data?.tickets) {
        setTickets(response.data.data.tickets);
      }
    } catch (error) {
      console.error('Failed to fetch tickets', error);
      toast.error('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [currentStoreId]);

  if (loading) return <Loader />;

  if (!currentStoreId) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
        <h2 className="text-xl font-semibold">No Store Selected</h2>
        <p className="text-muted-foreground">Please select or create a store to manage tickets.</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-purple-100 text-purple-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Support Tickets</h2>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="px-3 py-1">
            Store: {currentStore.name}
          </Badge>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={fetchTickets} 
            disabled={loading}
            title="Refresh"
          >
            <RotateCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={() => navigate('create')}>
            <Plus className="mr-2 h-4 w-4" /> Create New Ticket
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.length > 0 ? (
                tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.subject}</TableCell>
                    <TableCell className="capitalize">{ticket.priority}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(ticket.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => navigate(ticket.id)}>
                        <Eye className="mr-2 h-4 w-4" /> View full summary
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No tickets found for this store.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketList;
