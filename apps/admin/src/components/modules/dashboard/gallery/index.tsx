import { useState, useEffect } from 'react';
import { useStoreStore } from '@/stores/storeStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Loader from '@/components/common/Loader';
import { Upload, Copy } from 'lucide-react';
import { Card } from '@/components/ui/card';

const GalleryPage = () => {
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const { stores } = useStoreStore();
    const currentStore = stores?.[0];

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

    const fetchGallery = async () => {
        if (!currentStore) return;
        try {
            setLoading(true);
            const token = localStorage.getItem('auth_token');
            const res = await fetch(`${API_URL}/gallery?store_id=${currentStore.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await res.json();
            if (result.data) {
                setImages(result.data.resources || []);
            } else {
                toast.error(result.error?.message || 'Failed to load gallery');
            }
        } catch (error) {
            console.error('Gallery fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGallery();
    }, [currentStore]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !currentStore) return;

        try {
            setUploading(true);
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64Content = reader.result as string;
                const token = localStorage.getItem('auth_token');

                const res = await fetch(`${API_URL}/gallery`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        store_id: currentStore.id,
                        fileName: file.name,
                        fileContent: base64Content
                    })
                });

                const result = await res.json();
                if (result.data) {
                    toast.success('Image uploaded to gallery');
                    fetchGallery();
                } else {
                    toast.error(result.error?.message || 'Upload failed');
                }
            };
            reader.readAsDataURL(file);
        } catch (error) {
            toast.error('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
        toast.success('URL copied to clipboard');
    };

    if (loading) return <Loader />;

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Media Gallery</h1>
                    <p className="text-muted-foreground">Manage your store images and assets.</p>
                </div>
                <div className="relative">
                    <Input
                        type="file"
                        id="gallery-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={uploading}
                    />
                    <Button onClick={() => document.getElementById('gallery-upload')?.click()} disabled={uploading}>
                        {uploading ? 'Uploading...' : (
                            <><Upload className="mr-2 h-4 w-4" /> Upload Image</>
                        )}
                    </Button>
                </div>
            </div>

            {images.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">No images found in gallery.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {images.map((img: any) => (
                        <Card key={img.public_id} className="group relative overflow-hidden aspect-square border-muted">
                            <img
                                src={img.secure_url}
                                alt={img.public_id}
                                className="object-cover w-full h-full transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button size="icon" variant="secondary" onClick={() => copyToClipboard(img.secure_url)}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GalleryPage;
