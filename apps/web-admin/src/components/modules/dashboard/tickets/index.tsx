
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import { useStoreStore } from '@/stores/storeStore';
import { toast } from 'sonner';
import Loader from '@/components/common/Loader';

const VendorTickets = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTicket, setNewTicket] = useState({ subject: '', message: '', priority: 'normal' });
  const [submitting, setSubmitting] = useState(false);
  const { stores } = useStoreStore();
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

  const handleSubmit = async () => {
    if (!newTicket.subject || !newTicket.message) {
      toast.error('Subject and message are required');
      return;
    }
    if (!currentStoreId) {
      toast.error('No store selected');
      return;
    }
    setSubmitting(true);

    try {
      const response = await api.post('/api/v1/tickets', {
        ...newTicket,
        store_id: currentStoreId
      });

      if (response.status === 200 || response.status === 201) {
        setNewTicket({ subject: '', message: '', priority: 'normal' });
        fetchTickets();
        toast.success('Ticket created successfully');
      } else {
        toast.error(`Error: ${response.data.error?.message}`);
      }
    } catch (error: any) {
      console.error('Failed to create ticket', error);
      toast.error(`Error: ${error.response?.data?.error?.message || error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  if (!currentStoreId) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
        <h2 className="text-xl font-semibold">No Store Selected</h2>
        <p className="text-muted-foreground">Please select or create a store to manage tickets.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Support Tickets</h2>
        <Badge variant="outline" className="px-3 py-1">
          Store: {currentStore.name}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Ticket</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={newTicket.subject}
              onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
              placeholder="Brief description of the issue"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={newTicket.priority}
              onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={newTicket.message}
              onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
              placeholder="Detailed explanation of your issue..."
              rows={4}
            />
          </div>
          <Button onClick={handleSubmit} disabled={submitting || !newTicket.subject || !newTicket.message}>
            {submitting ? 'Submitting...' : 'Submit Ticket'}
          </Button>
        </CardContent>
      </Card>

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
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.length > 0 ? (
                tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>{ticket.subject}</TableCell>
                    <TableCell className="capitalize">{ticket.priority}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs capitalize ${ticket.status === 'open' ? 'bg-green-100 text-green-800' :
                        ticket.status === 'closed' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(ticket.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
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

export default VendorTickets;
