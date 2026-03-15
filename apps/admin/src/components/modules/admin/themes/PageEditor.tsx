import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import Loader from '@/components/common/Loader';
import { useNavigate, useParams } from 'react-router-dom';

const PageEditor = () => {
  const { id, pageId } = useParams();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<any>(null);
  const [page, setPage] = useState<any>(null);
  const [jsonContent, setJsonContent] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchThemeDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/v1/admin/themes/${id}`);
      if (response.data?.data?.theme) {
        const themeData = response.data.data.theme;
        setTheme(themeData);
        const pageData = themeData.pages?.find((p: any) => p.id === pageId);
        if (pageData) {
          setPage(pageData);
          setJsonContent(JSON.stringify(pageData.content || [], null, 2));
        }
      }
    } catch (error) {
      toast.error('Failed to load theme/page details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThemeDetails();
  }, [id, pageId]);

  const handleSavePage = async () => {
    if (!theme || !page) return;
    try {
      const parsedContent = JSON.parse(jsonContent);
      setLoading(true);

      const updatedPages = theme.pages.map((p: any) =>
        p.id === page.id ? { ...p, content: parsedContent } : p
      );

      await api.patch(`/api/v1/admin/themes/${id}`,
        { pages: updatedPages }
      );

      toast.success('Page saved successfully');
      navigate(`/admin/themes/pages/${id}`);
    } catch (err: any) {
      if (err instanceof SyntaxError) {
        toast.error('Invalid JSON format');
      } else {
        toast.error(err.response?.data?.error?.message || 'Failed to save page');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/themes/pages/${id}`)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">
          Editing Content: {page?.name}
        </h2>
      </div>

      <Card className="border-t-4 border-t-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-xl">JSON Editor</CardTitle>
            <p className="text-sm text-muted-foreground">Modify the component structure for this template page.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/admin/themes/pages/${id}`)}>Cancel</Button>
            <Button onClick={handleSavePage} disabled={loading}>
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <textarea
            value={jsonContent}
            onChange={(e) => setJsonContent(e.target.value)}
            className="w-full min-h-[600px] p-4 font-mono text-sm bg-zinc-950 text-zinc-100 rounded-md border border-input focus:ring-2 focus:ring-primary outline-none resize-none"
            spellCheck={false}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PageEditor;
