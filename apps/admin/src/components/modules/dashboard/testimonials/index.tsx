/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SideSheet } from '@/components/common/SideSheet';
import DynamicForm from '@/components/common/DynamicForm';
import type { FormField } from '@/types/form';
import DraggableContent from '@/components/common/DraggableContent';
import { useTestimonialStore, type Testimonial } from '@/stores/testimonialStore';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Loader from '@/components/common/Loader';
import { useStoreStore } from '@/stores/storeStore';
import api from '@/lib/api';

const TestimonialPage = () => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [hasInitialized, setHasInitialized] = useState(false);

    const { stores } = useStoreStore();
    const {
        testimonials,
        isLoading,
        isCreating,
        isUpdating,
        error,
        fetchTestimonials,
        createTestimonial,
        updateTestimonial,
        deleteTestimonial,
        reorderTestimonials,
        clearError
    } = useTestimonialStore();

    const userStoreId = stores?.[0]?.id;

    const fetchTestimonialsData = useCallback(async () => {
        if (!userStoreId) return;
        try {
            await fetchTestimonials(userStoreId);
        } catch (err) {
            console.error("Error fetching testimonials:", err);
        }
    }, [userStoreId, fetchTestimonials]);

    useEffect(() => {
        if (!userStoreId || hasInitialized) return;
        fetchTestimonialsData();
        setHasInitialized(true);
    }, [userStoreId, hasInitialized, fetchTestimonialsData]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            clearError();
        }
    }, [error, clearError]);

    const formFields: FormField[] = [
        { name: "name", label: "Customer Name", type: "text", required: true },
        { name: "review", label: "Review", type: "textarea", required: true },
        { name: "profile_image", label: "Profile Image", type: "file" },
        {
            name: "is_active",
            label: "Visible",
            type: "select",
            options: [
                { label: "Visible", value: "true" },
                { label: "Hidden", value: "false" }
            ],
            defaultValue: "true"
        }
    ];

    const handleFormSubmit = async (formData: Partial<Testimonial>) => {
        if (!userStoreId) return;
        try {
            let finalImageUrl = formData.profile_image;

            // Handle image upload if it's a new file (object with fileContent)
            if (formData.profile_image && typeof formData.profile_image === 'object' && (formData.profile_image as any).fileContent) {
                const imgData = formData.profile_image as any;
                
                // Convert base64 to File object
                const res = await fetch(imgData.fileContent);
                const blob = await res.blob();
                const file = new File([blob], imgData.fileName || 'profile.png', { type: blob.type });

                const uploadFormData = new FormData();
                uploadFormData.append('files', file);
                uploadFormData.append('store_id', userStoreId);

                const uploadResponse = await api.post('/api/v1/public/upload', uploadFormData);

                if (uploadResponse.data?.data?.results?.[0]?.status === 'success') {
                    finalImageUrl = uploadResponse.data.data.results[0].publicUrl;
                } else {
                    throw new Error("Failed to upload image");
                }
            }

            // Extract metadata fields from form if they were added
            const meta_data = {
                ...(editingItem?.meta_data || {}),
                visited_place: (formData as any).visited_place,
                service_type: (formData as any).service_type,
                trip_type: (formData as any).trip_type,
                subtitle: (formData as any).subtitle,
            };

            const formattedData = {
                ...formData,
                profile_image: finalImageUrl,
                is_active: (formData as any).is_active === "true" || (formData as any).is_active === true,
                meta_data
            };

            // Remove temporary fields that should go into meta_data
            delete (formattedData as any).visited_place;
            delete (formattedData as any).service_type;
            delete (formattedData as any).trip_type;
            delete (formattedData as any).subtitle;

            if (editingItem) {
                await updateTestimonial(editingItem.id, formattedData);
                toast.success("Testimonial updated successfully");
            } else {
                await createTestimonial({ ...formattedData, store_id: userStoreId });
                toast.success("Testimonial added successfully");
            }
            setIsSheetOpen(false);
            setEditingItem(null);
        } catch (err: any) {
            console.error("Submit error:", err);
            toast.error(err.message || "Failed to save testimonial");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteTestimonial(id);
            toast.success("Testimonial deleted successfully");
            setDeleteDialogOpen(false);
            setItemToDelete(null);
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    const handleStatusChange = async (id: string, is_active: boolean) => {
        try {
            await updateTestimonial(id, { is_active });
            toast.success(`Testimonial is now ${is_active ? 'visible' : 'hidden'}`);
        } catch (err) {
            console.error("Status update error:", err);
        }
    };

    const handleReorder = async (updatedItems: Testimonial[]) => {
        try {
            await reorderTestimonials(updatedItems);
            toast.success("Order updated successfully");
        } catch (err) {
            console.error("Reorder error:", err);
        }
    };

    if (isLoading && testimonials.length === 0 && !hasInitialized) {
        return <Loader />;
    }

    return (
        <div className="max-w-5xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Testimonials</h2>
                <Button onClick={() => { setEditingItem(null); setIsSheetOpen(true); }} disabled={isCreating}>
                    <Plus className="h-4 w-4 mr-2" />
                    {isCreating ? 'Adding...' : 'Add Testimonial'}
                </Button>
            </div>

            {testimonials.length > 0 ? (
                <div className="space-y-4">
                    <DraggableContent
                        data={testimonials}
                        setData={(val) => {
                            if (typeof val === 'function') {
                                const updated = val(testimonials);
                                handleReorder(updated);
                            }
                        }}
                        component="testimonials"
                        onEdit={(item) => { setEditingItem(item); setIsSheetOpen(true); }}
                        onDelete={(id) => { setItemToDelete(id); setDeleteDialogOpen(true); }}
                        onStatusChange={handleStatusChange}
                        selectedRows={new Set()}
                        toggleRowSelection={() => { }}
                        showSelect={false}
                        permissions={['view', 'edit', 'delete', 'drag']}
                    />
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-500">No testimonials found. Add your first one!</p>
                </div>
            )}

            <SideSheet
                isOpen={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                title={editingItem ? "Edit Testimonial" : "Add Testimonial"}
            >
                <div className="space-y-6">
                    <DynamicForm
                        fields={formFields}
                        onSubmit={handleFormSubmit}
                        initialValues={editingItem ? {
                            ...editingItem,
                            is_active: editingItem.is_active?.toString(),
                            visited_place: editingItem.meta_data?.visited_place || "",
                            service_type: editingItem.meta_data?.service_type || "",
                            trip_type: editingItem.meta_data?.trip_type || "",
                            subtitle: editingItem.meta_data?.subtitle || "",
                        } : {}}
                    />
                    
                    {editingItem?.meta_data && (
                        <div className="mt-4 p-4 bg-muted rounded-lg">
                            <h4 className="text-sm font-semibold mb-2">Metadata (Object View)</h4>
                            <pre className="text-xs overflow-auto max-h-40 p-2 bg-black text-white rounded">
                                {JSON.stringify(editingItem.meta_data, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            </SideSheet>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Testimonial</DialogTitle>
                        <DialogDescription>Are you sure? This cannot be undone.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={() => itemToDelete && handleDelete(itemToDelete)} disabled={isUpdating}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TestimonialPage;
