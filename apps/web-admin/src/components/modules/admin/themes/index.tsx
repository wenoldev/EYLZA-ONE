import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronRight, ArrowLeft, Save, Plus, FileJson } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import Loader from '@/components/common/Loader';

type ViewState = 'themes' | 'pages' | 'editor';

interface Page {
  id: string;
  name: string;
  slug: string;
  content: any[];
}

interface Theme {
  id: string;
  name: string;
  created_at: string;
  pages: Page[];
  global_config?: {
    [key: string]: any;
  };
  ispaid: boolean;
  amount?: string;
}

const AVAILABLE_PAGES = [
  { name: 'Home', slug: 'home' },
  { name: 'About Us', slug: 'about' },
  { name: 'Contact Us', slug: 'contact' },
  { name: 'Products', slug: 'products' },
  { name: 'Product Detail', slug: 'product-detail' },
  { name: 'Cart', slug: 'cart' },
  { name: 'Checkout', slug: 'checkout' },
  { name: 'Privacy Policy', slug: 'privacy' },
  { name: 'Terms of Service', slug: 'terms' },
];

const AdminThemes = () => {
  const [view, setView] = useState<ViewState>('themes');
  const [themes, setThemes] = useState<Theme[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [jsonContent, setJsonContent] = useState('');
  const [loading, setLoading] = useState(false);

  // For creating/editing theme
  const [formMode, setFormMode] = useState<'create' | 'edit' | null>(null);
  const [newThemeName, setNewThemeName] = useState('');
  const [isFree, setIsFree] = useState(true);
  const [selectedPages, setSelectedPages] = useState<string[]>(['home']);
  const [globalConfigJson, setGlobalConfigJson] = useState('{\n  "global": {}\n}');

  // For adding new page
  const [isAddPageDialogOpen, setIsAddPageDialogOpen] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');

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

  const fetchThemeDetails = async (themeId: string) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/v1/admin/themes/${themeId}`);
      if (response.data?.data?.theme) {
        setSelectedTheme(response.data.data.theme);
        setView('pages');
      }
    } catch (error) {
      console.error('Failed to fetch theme details', error);
      toast.error('Failed to load theme details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThemes();
  }, []);

  const handleSaveTheme = async () => {
    if (!newThemeName) return;
    setLoading(true);
    try {
      let parsedGlobalConfig = { global: {} };
      try {
        parsedGlobalConfig = JSON.parse(globalConfigJson);
      } catch (e) {
        toast.error('Invalid Global Config JSON');
        setLoading(false);
        return;
      }

      if (formMode === 'create') {
        const pagesToCreate = AVAILABLE_PAGES.filter(p => selectedPages.includes(p.slug))
          .map(p => ({ ...p, content: [] }));

        const response = await api.post('/api/v1/admin/themes',
          {
            name: newThemeName,
            global_config: parsedGlobalConfig,
            ispaid: !isFree,
            amount: isFree ? '0' : '10',
            pages: pagesToCreate
          }
        );

        if (response.data.error) {
          toast.error(response.data.error.message);
        } else {
          toast.success('Theme created successfully');
          resetForm();
          fetchThemes();
        }
      } else if (formMode === 'edit' && selectedTheme) {
        // For editing, we only update basic info and potentially add new pages
        // Existing pages content is preserved by the backend sync logic
        const pagesToSync = AVAILABLE_PAGES.filter(p => selectedPages.includes(p.slug))
          .map(p => {
            const existing = (selectedTheme.pages || []).find(ep => ep.slug === p.slug);
            return { ...p, content: existing ? existing.content : [] };
          });

        const response = await api.patch(`/api/v1/admin/themes/${selectedTheme.id}`,
          {
            name: newThemeName,
            global_config: parsedGlobalConfig,
            ispaid: !isFree,
            amount: isFree ? '0' : '10',
            pages: pagesToSync
          }
        );

        if (response.data.error) {
          toast.error(response.data.error.message);
        } else {
          toast.success('Theme updated successfully');
          resetForm();
          fetchThemes();
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Failed to save theme');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewThemeName('');
    setIsFree(true);
    setSelectedPages(['home']);
    setGlobalConfigJson('{\n  "global": {}\n}');
    setFormMode(null);
    setSelectedTheme(null);
  };

  const handleEditThemeBasicInfo = async (theme: Theme) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/v1/admin/themes/${theme.id}`);
      const fullTheme = response.data?.data?.theme;
      if (fullTheme) {
        setSelectedTheme(fullTheme);
        setNewThemeName(fullTheme.name);
        setIsFree(!fullTheme.ispaid);
        setSelectedPages(fullTheme.pages?.map((p: any) => p.slug) || []);
        setGlobalConfigJson(JSON.stringify(fullTheme.global_config || { global: {} }, null, 2));
        setFormMode('edit');
      }
    } catch (error) {
      console.error('Failed to fetch theme details', error);
      toast.error('Failed to load theme details');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPage = (page: Page) => {
    setSelectedPage(page);
    setJsonContent(JSON.stringify(page.content || [], null, 2));
    setView('editor');
  };

  const handleSavePage = async () => {
    if (!selectedTheme || !selectedPage) return;
    try {
      const parsedContent = JSON.parse(jsonContent);
      setLoading(true);

      const updatedPages = selectedTheme.pages.map((p: Page) =>
        p.id === selectedPage.id ? { ...p, content: parsedContent } : p
      );

      const response = await api.patch(`/api/v1/admin/themes/${selectedTheme.id}`,
        { pages: updatedPages }
      );

      if (response.data.error) {
        toast.error(response.data.error.message);
      } else {
        toast.success('Page saved successfully');
        setSelectedTheme({ ...selectedTheme, pages: updatedPages });
        setView('pages');
      }
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

  const handleBack = () => {
    if (view === 'editor') setView('pages');
    else if (view === 'pages') setView('themes');
  };

  const togglePageSelection = (slug: string) => {
    setSelectedPages(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const handleAddNewPage = async () => {
    if (newPageName && newPageSlug && selectedTheme) {
      try {
        setLoading(true);
        const newPage = { name: newPageName, slug: newPageSlug, content: [] };
        const response = await api.patch(`/api/v1/admin/themes/${selectedTheme.id}`,
          { pages: [...(selectedTheme.pages || []), newPage] }
        );

        if (response.data.error) {
          toast.error(response.data.error.message);
        } else {
          toast.success('Page added successfully');
          setIsAddPageDialogOpen(false);
          setNewPageName('');
          setNewPageSlug('');
          fetchThemeDetails(selectedTheme.id);
        }
      } catch (err: any) {
        toast.error('Failed to add page');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && view === 'themes' && !formMode) return <Loader />;

  return (
    <div className="space-y-6 container mx-auto py-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {view !== 'themes' && (
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h2 className="text-3xl font-bold tracking-tight">
            {view === 'themes' && 'Theme Templates'}
            {view === 'pages' && `Pages: ${selectedTheme?.name}`}
            {view === 'editor' && `Editing Content: ${selectedPage?.name}`}
          </h2>
        </div>
        {view === 'themes' && !formMode && (
          <Button onClick={() => setFormMode('create')}>
            <Plus className="mr-2 h-4 w-4" /> New Theme
          </Button>
        )}
      </div>

      {view === 'themes' && formMode && (
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-xl">
              {formMode === 'create' ? 'Create New Theme Template' : `Edit Theme: ${selectedTheme?.name}`}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="themeName">Theme Name</Label>
                <Input
                  id="themeName"
                  value={newThemeName}
                  onChange={(e) => setNewThemeName(e.target.value)}
                  placeholder="e.g. Modern Minimalist"
                />
              </div>
              <div className="space-y-2">
                <Label>Theme Type</Label>
                <div className="flex gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={isFree}
                      onChange={() => setIsFree(true)}
                      className="w-4 h-4 text-primary"
                    />
                    <span>Free</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={!isFree}
                      onChange={() => setIsFree(false)}
                      className="w-4 h-4 text-primary"
                    />
                    <span>Paid</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Select Pages to Include</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {AVAILABLE_PAGES.map((page) => (
                  <div
                    key={page.slug}
                    onClick={() => togglePageSelection(page.slug)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all text-sm flex items-center gap-2 ${selectedPages.includes(page.slug)
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-background border-input hover:border-primary/50'
                      }`}
                  >
                    <div className={`w-4 h-4 rounded-sm border flex items-center justify-center ${selectedPages.includes(page.slug) ? 'bg-primary border-primary' : 'border-input'}`}>
                      {selectedPages.includes(page.slug) && <Plus className="w-3 h-3 text-white" />}
                    </div>
                    {page.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="globalConfig">Global Config (JSON)</Label>
              <textarea
                id="globalConfig"
                value={globalConfigJson}
                onChange={(e) => setGlobalConfigJson(e.target.value)}
                className="w-full min-h-[200px] p-4 font-mono text-sm bg-zinc-950 text-zinc-100 rounded-md border border-input focus:ring-2 focus:ring-primary outline-none resize-none"
                spellCheck={false}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="ghost" onClick={resetForm}>Cancel</Button>
              <Button onClick={handleSaveTheme} disabled={loading || !newThemeName || selectedPages.length === 0}>
                {loading ? 'Saving...' : formMode === 'create' ? 'Create Theme Template' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {view === 'themes' && !formMode && (
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
                {themes.length === 0 && !loading && (
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
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${!theme.ispaid ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {!theme.ispaid ? 'Free' : 'Paid'}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(theme.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditThemeBasicInfo(theme)}>
                        Basic Info
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => fetchThemeDetails(theme.id)}>
                        Edit Pages <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {view === 'pages' && (
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
                {selectedTheme?.pages?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                      No pages found in this theme.
                    </TableCell>
                  </TableRow>
                )}
                {selectedTheme?.pages?.map((page: Page) => (
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
                      <Button variant="secondary" size="sm" onClick={() => handleEditPage(page)}>
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
      )}

      {view === 'editor' && (
        <div className="space-y-4">
          <Card className="border-t-4 border-t-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-xl">JSON Editor</CardTitle>
                <p className="text-sm text-muted-foreground">Modify the component structure for this template page.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleBack}>Cancel</Button>
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
      )}

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

export default AdminThemes;
