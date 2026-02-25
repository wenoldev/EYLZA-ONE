/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus, Database, ChevronRight, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loader from '@/components/common/Loader';
import { useStoreStore } from '@/stores/storeStore';
import { useCMSStore, type CMS } from '@/stores/cmsStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CMSListPage = () => {
    const navigate = useNavigate();
    const { stores } = useStoreStore();
    const { cmsList, isLoading, isCreating, isUpdating, fetchCMS, createCMS, deleteCMS } = useCMSStore();
    
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [newCMSName, setNewCMSName] = useState('');
    const [cmsToDelete, setCmsToDelete] = useState<CMS | null>(null);

    const storeId = stores?.[0]?.id;

    useEffect(() => {
        if (storeId) {
            fetchCMS(storeId);
        }
    }, [storeId, fetchCMS]);

    const handleCreate = async () => {
        if (!storeId || !newCMSName.trim()) return;
        try {
            await createCMS({ store_id: storeId, name: newCMSName });
            toast.success("CMS created successfully");
            setIsCreateDialogOpen(false);
            setNewCMSName('');
        } catch (err) {
            toast.error("Failed to create CMS");
        }
    };

    const handleDelete = async () => {
        if (!cmsToDelete) return;
        try {
            await deleteCMS(cmsToDelete.id);
            toast.success("CMS deleted successfully");
            setCmsToDelete(null);
        } catch (err) {
            toast.error("Failed to delete CMS");
        }
    };

    if (isLoading && cmsList.length === 0) {
        return <Loader />;
    }

    return (
        <div className="max-w-6xl mx-auto p-4 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">CMS</h2>
                    <p className="text-muted-foreground">Manage your dynamic content modules.</p>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add CMS
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New CMS</DialogTitle>
                            <DialogDescription>
                                Give your CMS a name. This will generate the necessary schema and content files.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">CMS Name</Label>
                                <Input 
                                    id="name" 
                                    placeholder="e.g. Services, Team, FAQ" 
                                    value={newCMSName}
                                    onChange={(e) => setNewCMSName(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreate} disabled={isCreating || !newCMSName.trim()}>
                                {isCreating ? 'Creating...' : 'Create CMS'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {cmsList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cmsList.map((cms) => (
                        <Card key={cms.id} className="group hover:shadow-lg transition-all cursor-pointer overflow-hidden border-2 hover:border-primary/50" onClick={() => navigate(`/dashboard/cms/${cms.id}`)}>
                            <CardHeader className="bg-muted/50 pb-4">
                                <div className="flex justify-between items-start">
                                    <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                        <Database className="h-6 w-6" />
                                    </div>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCmsToDelete(cms);
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <CardTitle className="mt-4">{cms.name}</CardTitle>
                                <CardDescription>ID: {cms.id.split('-')[0]}...</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4 flex justify-between items-center">
                                <span className="text-xs text-muted-foreground">
                                    Created {new Date(cms.created_at).toLocaleDateString()}
                                </span>
                                <Button variant="ghost" size="sm" className="group-hover:translate-x-1 transition-transform">
                                    Manage <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-muted/20 border-2 border-dashed rounded-xl">
                    <div className="bg-muted p-6 rounded-full mb-4">
                        <Database className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No CMS created yet</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm text-center">
                        CMS allows you to define custom data structures and manage content dynamically.
                    </p>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create your first CMS
                    </Button>
                </div>
            )}

            <Dialog open={!!cmsToDelete} onOpenChange={(open) => !open && setCmsToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete CMS</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <strong>{cmsToDelete?.name}</strong>? This will permanently delete the CMS and all its content. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCmsToDelete(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isUpdating}>
                            {isUpdating ? 'Deleting...' : 'Delete Permanently'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CMSListPage;
