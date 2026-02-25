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
            // Convert string "true"/"false" back to boolean if it came from the select
            const formattedData = {
                ...formData,
                is_active: (formData as any).is_active === "true" || (formData as any).is_active === true
            };

            if (editingItem) {
                await updateTestimonial(editingItem.id, formattedData);
                toast.success("Testimonial updated successfully");
            } else {
                await createTestimonial({ ...formattedData, store_id: userStoreId });
                toast.success("Testimonial added successfully");
            }
            setIsSheetOpen(false);
            setEditingItem(null);
        } catch (err) {
            console.error("Submit error:", err);
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
                <DynamicForm
                    fields={formFields}
                    onSubmit={handleFormSubmit}
                    initialValues={editingItem ? {
                        ...editingItem,
                        is_active: editingItem.is_active?.toString()
                    } : {}}
                />
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
