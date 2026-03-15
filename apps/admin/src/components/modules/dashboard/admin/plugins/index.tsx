import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import Loader from '@/components/common/Loader';
import api from '@/lib/api';

const AdminPluginsPage = () => {
    const [plugins, setPlugins] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        price: 0,
        currency: 'INR',
        image_url: ''
    });

    const fetchPlugins = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/v1/plugins?status=active');
            if (res.data?.data) {
                setPlugins(res.data.data.plugins);
            }
        } catch (error) {
            toast.error('Failed to load plugins');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlugins();
    }, []);

    const resetForm = () => {
        setFormData({
            name: '',
            slug: '',
            description: '',
            price: 0,
            currency: 'INR',
            image_url: ''
        });
        setIsEditing(false);
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (plugin: any) => {
        setFormData({
            name: plugin.name || '',
            slug: plugin.slug || '',
            description: plugin.description || '',
            price: plugin.price || 0,
            currency: plugin.currency || 'INR',
            image_url: plugin.image_url || ''
        });
        setEditingId(plugin.id);
        setIsEditing(true);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && editingId) {
                await api.patch(`/api/v1/plugins/${editingId}`, formData);
                toast.success('Plugin updated successfully');
            } else {
                await api.post('/api/v1/plugins', formData);
                toast.success('Plugin created successfully');
            }
            resetForm();
            fetchPlugins();
        } catch (error: any) {
            toast.error(error.response?.data?.error?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete the plugin "${name}"?`)) return;
        try {
            await api.delete(`/api/v1/plugins/${id}`);
            toast.success('Plugin moved to trash');
            fetchPlugins();
        } catch (error) {
            toast.error('Failed to delete plugin');
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Manage Plugins</h1>
                    <p className="text-muted-foreground">Admin panel to configure marketplace plugins.</p>
                </div>
                <Button onClick={() => { if(showForm) resetForm(); else setShowForm(true); }}>
                    {showForm ? 'Cancel' : <><Plus className="mr-2 h-4 w-4" /> Add Plugin</>}
                </Button>
            </div>

            {showForm && (
                <Card className="mb-8 border-primary/20 shadow-sm">
                    <CardHeader>
                        <CardTitle>{isEditing ? 'Edit Plugin' : 'Add New Plugin'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Name</label>
                                    <Input
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Advanced Analytics"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Slug (Unique)</label>
                                    <Input
                                        value={formData.slug}
                                        onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                        placeholder="e.g. analytics"
                                        required
                                        disabled={isEditing}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <Textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief explanation of plugin features..."
                                    rows={3}
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Price</label>
                                    <Input
                                        type="number"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Currency</label>
                                    <Input
                                        value={formData.currency}
                                        onChange={e => setFormData({ ...formData, currency: e.target.value })}
                                        placeholder="INR"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Icon URL</label>
                                    <Input
                                        value={formData.image_url}
                                        onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <Button type="submit" className="px-8">
                                    {isEditing ? 'Update Plugin' : 'Create Plugin'}
                                </Button>
                                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4">
                {plugins.length === 0 ? (
                    <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
                        <p className="text-muted-foreground">No active plugins found.</p>
                    </div>
                ) : (
                    plugins.map(plugin => (
                        <Card key={plugin.id} className="transition-all hover:border-primary/30">
                            <CardContent className="flex items-center justify-between py-4">
                                <div className="flex items-center gap-4">
                                    {plugin.image_url && (
                                        <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center p-2">
                                            <img src={plugin.image_url} alt="" className="w-full h-full object-contain" />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            {plugin.name} 
                                            <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                                                {plugin.slug}
                                            </span>
                                        </h3>
                                        <p className="text-sm text-muted-foreground line-clamp-1 max-w-xl">
                                            {plugin.description || 'No description provided.'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="font-bold text-lg">
                                            {plugin.price === 0 ? (
                                                <span className="text-emerald-600">Free</span>
                                            ) : (
                                                `₹${plugin.price}`
                                            )}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
                                            {plugin.currency}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 border-l pl-4">
                                        <Button 
                                            variant="ghost" 
                                            size="sm"
                                            onClick={() => handleEdit(plugin)}
                                            className="hover:bg-primary/5 hover:text-primary"
                                        >
                                            Edit
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="text-destructive hover:bg-destructive/10"
                                            onClick={() => handleDelete(plugin.id, plugin.name)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminPluginsPage;
