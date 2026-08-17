import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '@/components/common/Loader';
import { ArrowLeft, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const AdminTicketDetail = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [replyMessage, setReplyMessage] = useState('');
  const [replying, setReplying] = useState(false);

  const fetchTicket = async () => {
    try {
      const response = await api.get(`/api/v1/tickets/${id}`);
      if (response.data?.data?.ticket) {
        setTicket(response.data.data.ticket);
      }
    } catch (error) {
      console.error('Failed to fetch ticket detail', error);
      toast.error('Failed to fetch ticket detail');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const handleSendReply = async () => {
    if (!replyMessage.trim()) return;
    setReplying(true);
    try {
      const res = await api.post(`/api/v1/tickets/${id}/messages`, {
        message: replyMessage,
        sender_type: 'admin'
      });
      if (res.data?.data?.message) {
        setTicket({ ...ticket, messages: [...(ticket.messages || []), res.data.data.message] });
        setReplyMessage('');
        toast.success('Reply sent');
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to send reply');
    } finally {
      setReplying(false);
    }
  };

  const updateStatus = async (status: string) => {
    try {
      const response = await api.patch(`/api/v1/tickets/${id}`, { status });
      if (response.status === 200) {
        toast.success('Ticket status updated');
        setTicket({ ...ticket, status });
      }
    } catch (error) {
      console.error('Failed to update ticket', error);
      toast.error('Failed to update ticket status');
    }
  };

  if (loading) return <Loader />;

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <h2 className="text-xl font-semibold">Ticket not found</h2>
        <Button onClick={() => navigate('/admin/tickets')}>Back to Tickets</Button>
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
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/tickets')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">{ticket.subject}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Created on {new Date(ticket.created_at).toLocaleString()} by {ticket.users?.email || 'Vendor'}</span>
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
        <CardContent className="pt-6 space-y-4">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="whitespace-pre-wrap text-lg leading-relaxed">{ticket.message}</p>
          </div>
          {ticket.image_url && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Attachment:</p>
              <div className="relative h-48 w-48 overflow-hidden rounded-md border">
                <a href={ticket.image_url} target="_blank" rel="noreferrer">
                  <img src={ticket.image_url} alt="Attachment" className="h-full w-full object-cover" />
                </a>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {ticket.messages && ticket.messages.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Replies</h3>
          {ticket.messages.map((msg: any) => (
            <Card key={msg.id} className={msg.sender_type === 'admin' ? 'border-primary/20 bg-primary/5' : ''}>
              <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-semibold">
                  {msg.sender_type === 'admin' ? 'You (Support)' : 'Vendor'}
                </CardTitle>
                <span className="text-xs text-muted-foreground">{new Date(msg.created_at).toLocaleString()}</span>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="whitespace-pre-wrap text-sm">{msg.message}</p>
                {msg.meta?.image_url && (
                  <div className="mt-2">
                    <a href={msg.meta.image_url} target="_blank" rel="noreferrer">
                      <img src={msg.meta.image_url} alt="Attachment" className="h-24 w-24 object-cover rounded border" />
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {ticket.status !== 'closed' && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Type your reply here..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
            />
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={() => navigate('/admin/tickets')}>Back to List</Button>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => updateStatus(ticket.status === 'in_progress' ? 'resolved' : 'in_progress')}>
                  Mark as {ticket.status === 'in_progress' ? 'Resolved' : 'In Progress'}
                </Button>
                <Button variant="destructive" onClick={() => updateStatus('closed')}>
                  Close Ticket
                </Button>
                <Button onClick={handleSendReply} disabled={!replyMessage.trim() || replying}>
                  {replying ? 'Sending...' : 'Send Reply'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {ticket.status === 'closed' && (
        <div className="flex justify-between items-center mt-4">
          <Button variant="outline" onClick={() => navigate('/admin/tickets')}>Back to List</Button>
          <Button variant="secondary" onClick={() => updateStatus('open')}>Reopen Ticket</Button>
        </div>
      )}
    </div>
  );
};

export default AdminTicketDetail;
