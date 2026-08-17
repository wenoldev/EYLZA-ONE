
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import api from '@/lib/api';
import Loader from '@/components/common/Loader';
import { useNavigate } from 'react-router-dom';

const AdminTickets = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTickets = async () => {
    try {
      const response = await api.get('/api/v1/tickets');
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
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await api.patch(`/api/v1/tickets/${id}`,
        { status }
      );

      if (response.status === 200) {
        toast.success('Ticket status updated');
        fetchTickets();
      }
    } catch (error) {
      console.error('Failed to update ticket', error);
      toast.error('Failed to update ticket status');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Support Tickets</h2>
      <Card>
        <CardHeader>
          <CardTitle>All Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    No tickets found.
                  </TableCell>
                </TableRow>
              )}
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>{ticket.subject}</TableCell>
                  <TableCell>{ticket.users?.email}</TableCell>
                  <TableCell className="capitalize">{ticket.priority}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${ticket.status === 'open' ? 'bg-green-100 text-green-700' :
                      ticket.status === 'closed' ? 'bg-gray-100 text-gray-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(ticket.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Select
                        defaultValue={ticket.status}
                        onValueChange={(value) => updateStatus(ticket.id, value)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" onClick={() => navigate(`/admin/tickets/${ticket.id}`)}>
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTickets;
