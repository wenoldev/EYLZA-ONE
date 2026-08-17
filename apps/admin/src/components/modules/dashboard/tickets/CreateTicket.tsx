
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/lib/api';
import { useStoreStore } from '@/stores/storeStore';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle2, ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UploadDialog } from '@/components/common/UploadImage';

const CreateTicket = () => {
  const [newTicket, setNewTicket] = useState({ subject: '', message: '', priority: 'normal', image_url: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { stores } = useStoreStore();
  const navigate = useNavigate();
  const currentStore = stores?.[0];
  const currentStoreId = currentStore?.id;

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
        setSubmitted(true);
        setTimeout(() => {
          navigate('/dashboard/tickets');
        }, 3000);
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

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="relative">
          <CheckCircle2 className="w-24 h-24 text-black animate-bounce" strokeWidth={1} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Ticket Submitted!</h2>
          <p className="text-xl text-muted-foreground font-medium">will respond soon</p>
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">Redirecting you back to your tickets...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">Create New Ticket</h2>
      </div>

      <Card className="border-2 shadow-lg">
        <CardHeader>
          <CardTitle>Issue Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm font-semibold">Subject</Label>
            <Input
              id="subject"
              value={newTicket.subject}
              onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
              placeholder="Brief description of the issue"
              className="py-6 text-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority" className="text-sm font-semibold">Priority</Label>
            <Select
              value={newTicket.priority}
              onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}
            >
              <SelectTrigger className="py-6">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-semibold">Message</Label>
            <Textarea
              id="message"
              value={newTicket.message}
              onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
              placeholder="Detailed explanation of your issue..."
              rows={8}
              className="resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Attachment (Optional)</Label>
            <div className="flex items-center gap-4">
              <UploadDialog 
                onImagesSelected={(images) => setNewTicket({ ...newTicket, image_url: images[0]?.url || '' })}
                initialValues={newTicket.image_url ? [{ url: newTicket.image_url, alt: '' }] : []}
                multiple={false}
              />
              {newTicket.image_url && (
                <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                  <img src={newTicket.image_url} alt="Attachment" className="h-full w-full object-cover" />
                </div>
              )}
            </div>
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={submitting || !newTicket.subject || !newTicket.message}
            className="w-full py-6 text-lg font-bold"
          >
            {submitting ? 'Submitting...' : 'Submit Ticket'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateTicket;
