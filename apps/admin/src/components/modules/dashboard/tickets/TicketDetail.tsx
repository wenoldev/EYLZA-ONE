
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '@/components/common/Loader';
import { ArrowLeft, Clock, AlertCircle } from 'lucide-react';

const TicketDetail = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await api.get(`/api/v1/tickets/${id}`);
        if (response.data?.data?.ticket) {
          setTicket(response.data.data.ticket);
        }
      } catch (error) {
        console.error('Failed to fetch ticket detail', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  if (loading) return <Loader />;

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <h2 className="text-xl font-semibold">Ticket not found</h2>
        <Button onClick={() => navigate('/dashboard/tickets')}>Back to Tickets</Button>
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/tickets')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">{ticket.subject}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Created on {new Date(ticket.created_at).toLocaleString()}</span>
            </div>
          </div>
        </div>
        <Badge className={`px-3 py-1 text-sm capitalize ${getStatusColor(ticket.status)}`}>
          {ticket.status.replace('_', ' ')}
        </Badge>
      </div>

      <Card className="border-2">
        <CardHeader className="bg-muted/30 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Original Message</CardTitle>
            <Badge variant="outline" className="capitalize">Priority: {ticket.priority}</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="whitespace-pre-wrap text-lg leading-relaxed">{ticket.message}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate('/dashboard/tickets')}>Back to List</Button>
        {ticket.status !== 'closed' && (
          <Button variant="destructive" onClick={() => {/* Handle close if needed */}}>
            Close Ticket
          </Button>
        )}
      </div>
    </div>
  );
};

export default TicketDetail;
