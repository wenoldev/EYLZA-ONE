import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, ArrowLeft, FileJson } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import Loader from '@/components/common/Loader';
import { useNavigate, useParams } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Page {
  id: string;
  name: string;
  slug: string;
  content: any[];
}

const ThemePageList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // For adding new page
  const [isAddPageDialogOpen, setIsAddPageDialogOpen] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');

  const fetchThemeDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/v1/admin/themes/${id}`);
      if (response.data?.data?.theme) {
        setTheme(response.data.data.theme);
      }
    } catch (error) {
      toast.error('Failed to load theme details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThemeDetails();
  }, [id]);

  const handleAddNewPage = async () => {
    if (newPageName && newPageSlug && theme) {
      try {
        setLoading(true);
        const newPage = { name: newPageName, slug: newPageSlug, content: [] };
        await api.patch(`/api/v1/admin/themes/${id}`,
          { pages: [...(theme.pages || []), newPage] }
        );
        toast.success('Page added successfully');
        setIsAddPageDialogOpen(false);
        setNewPageName('');
        setNewPageSlug('');
        fetchThemeDetails();
      } catch (err: any) {
        toast.error('Failed to add page');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/themes')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">
          Pages: {theme?.name}
        </h2>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Sections</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {theme?.pages?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                    No pages found in this theme.
                  </TableCell>
                </TableRow>
              )}
              {theme?.pages?.map((page: Page) => (
                <TableRow key={page.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{page.name}</TableCell>
                  <TableCell>
                    <code className="bg-muted px-1.5 py-0.5 rounded text-xs">/{page.slug}</code>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <FileJson className="h-3 w-3" />
                      {page.content?.length || 0} Sections
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="secondary" size="sm" onClick={() => navigate(`edit/${page.id}`)}>
                      Edit JSON Content
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={4} className="p-0">
                  <Button
                    variant="ghost"
                    className="w-full h-12 rounded-none border-t border-dashed hover:bg-muted/30 text-muted-foreground"
                    onClick={() => setIsAddPageDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add New Page
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isAddPageDialogOpen} onOpenChange={setIsAddPageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Page</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="pageName">Page Name</Label>
              <Input
                id="pageName"
                value={newPageName}
                onChange={(e) => setNewPageName(e.target.value)}
                placeholder="e.g. Contact Us"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pageSlug">Page Slug</Label>
              <Input
                id="pageSlug"
                value={newPageSlug}
                onChange={(e) => setNewPageSlug(e.target.value)}
                placeholder="e.g. contact"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPageDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddNewPage} disabled={loading || !newPageName || !newPageSlug}>
              {loading ? 'Adding...' : 'Add Page'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ThemePageList;
