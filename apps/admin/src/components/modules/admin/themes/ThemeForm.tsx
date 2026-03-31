import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import Loader from '@/components/common/Loader';
import { useNavigate, useParams } from 'react-router-dom';

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

const ThemeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [isFree, setIsFree] = useState(true);
  const [amount, setAmount] = useState('0');
  const [selectedPages, setSelectedPages] = useState<string[]>(['home']);
  const [globalConfigJson, setGlobalConfigJson] = useState('{\n  "global": {}\n}');

  useEffect(() => {
    if (isEditing) {
      fetchThemeDetails();
    }
  }, [id]);

  const fetchThemeDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/v1/admin/themes/${id}`);
      const theme = response.data?.data?.theme;
      if (theme) {
        setName(theme.name);
        setIsFree(!theme.ispaid);
        setAmount(theme.amount || '0');
        setSelectedPages(theme.pages?.map((p: any) => p.slug) || []);
        setGlobalConfigJson(JSON.stringify(theme.global_config || { global: {} }, null, 2));
      }
    } catch (error) {
      toast.error('Failed to load theme details');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name) return;
    setLoading(true);
    try {
      let parsedJson: any = { global: {} };
      try {
        parsedJson = JSON.parse(globalConfigJson);
      } catch (e) {
        toast.error('Invalid JSON');
        setLoading(false);
        return;
      }

      // If the user pasted a full theme object, use its properties
      const finalName = parsedJson.name || name;
      const finalGlobalConfig = parsedJson.global_config || (parsedJson.global ? parsedJson : { global: parsedJson });
      const finalIsPaid = parsedJson.ispaid !== undefined ? parsedJson.ispaid : !isFree;
      const finalAmount = parsedJson.amount !== undefined ? parsedJson.amount : (isFree ? '0' : amount);
      
      // Use pages from JSON if present, otherwise use selected pages with empty content
      const finalPages = parsedJson.pages || AVAILABLE_PAGES.filter(p => selectedPages.includes(p.slug))
        .map(p => ({ ...p, content: [] }));

      const payload = {
        name: finalName,
        global_config: finalGlobalConfig,
        ispaid: finalIsPaid,
        amount: finalAmount,
        pages: finalPages
      };

      if (isEditing) {
        await api.patch(`/api/v1/admin/themes/${id}`, payload);
        toast.success('Theme updated successfully');
      } else {
        await api.post('/api/v1/admin/themes', payload);
        toast.success('Theme created successfully');
      }
      navigate('/admin/themes');
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Failed to save theme');
    } finally {
      setLoading(false);
    }
  };

  const togglePageSelection = (slug: string) => {
    setSelectedPages(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  if (loading && isEditing) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/themes')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">
          {isEditing ? `Edit Theme: ${name}` : 'Create New Theme Template'}
        </h2>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-xl">
            {isEditing ? 'Basic Information' : 'Theme Details'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="themeName">Theme Name</Label>
              <Input
                id="themeName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Modern Minimalist"
              />
            </div>
            <div className="space-y-2">
              <Label>Theme Type</Label>
              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      checked={isFree}
                      onChange={() => setIsFree(true)}
                      className="w-4 h-4 text-primary focus:ring-offset-0 focus:ring-0"
                    />
                    <span className="group-hover:text-primary transition-colors">Free</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      checked={!isFree}
                      onChange={() => setIsFree(false)}
                      className="w-4 h-4 text-primary focus:ring-offset-0 focus:ring-0"
                    />
                    <span className="group-hover:text-primary transition-colors">Paid</span>
                  </label>
                </div>

                {!isFree && (
                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                    <Label htmlFor="amount" className="whitespace-nowrap">Price (INR)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-32 bg-background"
                      placeholder="0"
                    />
                  </div>
                )}
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
            <Button variant="ghost" onClick={() => navigate('/admin/themes')}>Cancel</Button>
            <Button onClick={handleSave} disabled={loading || !name || selectedPages.length === 0}>
              {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Theme Template'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeForm;
