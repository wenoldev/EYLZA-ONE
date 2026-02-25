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
    const [showAddForm, setShowAddForm] = useState(false);
    const [newPlugin, setNewPlugin] = useState({
        name: '',
        slug: '',
        description: '',
        price: 0,
        currency: 'INR'
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

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/api/v1/plugins', newPlugin);
            if (res.data?.data) {
                toast.success('Plugin created successfully');
                setShowAddForm(false);
                fetchPlugins();
            }
        } catch (error) {
            toast.error('Failed to create plugin');
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Manage Plugins</h1>
                    <p className="text-muted-foreground">Admin panel to add/remove store plugins.</p>
                </div>
                <Button onClick={() => setShowAddForm(!showAddForm)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Plugin
                </Button>
            </div>

            {showAddForm && (
                <Card className="mb-8">
                    <CardHeader><CardTitle>Add New Plugin</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Name</label>
                                    <Input
                                        value={newPlugin.name}
                                        onChange={e => setNewPlugin({ ...newPlugin, name: e.target.value })}
                                        placeholder="e.g. Gallery"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Slug</label>
                                    <Input
                                        value={newPlugin.slug}
                                        onChange={e => setNewPlugin({ ...newPlugin, slug: e.target.value })}
                                        placeholder="e.g. gallery"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <Textarea
                                    value={newPlugin.description}
                                    onChange={e => setNewPlugin({ ...newPlugin, description: e.target.value })}
                                    placeholder="Plugin description..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Price (INR)</label>
                                    <Input
                                        type="number"
                                        value={newPlugin.price}
                                        onChange={e => setNewPlugin({ ...newPlugin, price: Number(e.target.value) })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit">Create Plugin</Button>
                                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="space-y-4">
                {plugins.map(plugin => (
                    <Card key={plugin.id}>
                        <CardContent className="flex items-center justify-between py-4">
                            <div>
                                <h3 className="text-lg font-semibold">{plugin.name} ({plugin.slug})</h3>
                                <p className="text-sm text-muted-foreground">{plugin.description}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="font-bold">₹{plugin.price}</span>
                                <Button variant="ghost" size="icon" className="text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AdminPluginsPage;
