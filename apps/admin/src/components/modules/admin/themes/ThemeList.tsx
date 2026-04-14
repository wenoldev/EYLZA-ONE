import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronRight, Plus, Laptop } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import Loader from '@/components/common/Loader';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

interface Theme {
  id: string;
  name: string;
  created_at: string;
  ispaid: boolean;
  amount?: string;
}

const ThemeList = () => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
   const navigate = useNavigate();
   const { user, session } = useAuthStore();

   const navigateToVisualEditor = (themeId: string) => {
     const url = new URL(import.meta.env.VITE_EDITOR_URL);
     url.searchParams.set("uid", user?.id ?? "");
     url.searchParams.set("themeId", themeId);
     url.searchParams.set("isAdminMode", "true");
     url.searchParams.set("access_token", session?.access_token ?? "");
     url.searchParams.set("refresh_token", session?.refresh_token ?? "");
     url.searchParams.set("expires_at", session?.expires_at?.toString() ?? "");
     window.open(url.toString(), "_blank");
   };

  const fetchThemes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/v1/admin/themes');
      if (response.data?.data?.themes) {
        setThemes(response.data.data.themes);
      }
    } catch (error) {
      console.error('Failed to fetch themes', error);
      toast.error('Failed to load themes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThemes();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Theme Templates</h2>
        <Button onClick={() => navigate('create')}>
          <Plus className="mr-2 h-4 w-4" /> New Theme
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Theme Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {themes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                    No themes found. Create one to get started.
                  </TableCell>
                </TableRow>
              )}
              {themes.map((theme) => (
                <TableRow key={theme.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{theme.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${!theme.ispaid ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                            {!theme.ispaid ? 'Free' : 'Paid'}
                        </span>
                        {theme.ispaid && <span className="text-sm font-semibold">₹{theme.amount}</span>}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(theme.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => navigate(`edit/${theme.id}`)}>
                      Basic Info
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigate(`pages/${theme.id}`)}>
                      Edit Pages <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="default" size="sm" onClick={() => navigateToVisualEditor(theme.id)}>
                      <Laptop className="mr-2 h-4 w-4" /> Visual Editor
                    </Button>
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

export default ThemeList;
