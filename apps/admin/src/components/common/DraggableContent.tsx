/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { type JSX } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AtSign, GripVertical, MessageSquareMore, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import ImageViewer from '@/components/common/ImageViewer';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';


type DraggableItem = {
    id: string;
    order?: number;
    [key: string]: any;
};

interface DraggableProps<T extends DraggableItem> {
    data: T[];
    setData: React.Dispatch<React.SetStateAction<T[]>>;
    filter?: string | null;
    filterDataArray?: T[];
    component: 'product' | 'category' | 'queries' | 'testimonials';
    onReorder?: (updatedItems: T[]) => void;
    onEdit?: (item: T) => void;
    onDelete?: (id: string) => void;
    selectedRows: Set<number>;
    toggleRowSelection: (index: number) => void;
    showSelect?: boolean;
    onStatusChange?: (id: string, isActive: boolean) => void;
    permissions: ('view' | 'edit' | 'delete' | 'drag')[]
}

function SortableItem(props: {
    id: string;
    draggable?: boolean;
    children: React.ReactNode;
    onEdit: () => void;
    onDelete: () => void;
    isSelected: boolean;
    showSelect?: boolean;
    canEdit: boolean;
    canDelete: boolean;
    onToggleSelect: () => void;
    isActive?: boolean;
    onStatusChange?: (checked: boolean) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: props.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <li ref={setNodeRef} style={style} {...attributes} className="list-none">
            <Card>
                <CardContent className="flex items-center">
                    {props?.showSelect &&
                        <Checkbox
                            checked={props.isSelected}
                            onCheckedChange={props.onToggleSelect}
                            className="mr-2"
                        />
                    }
                    {props.draggable && !props.showSelect && (
                        <div {...listeners} className="mr-2 cursor-move">
                            <GripVertical className="h-5 w-5 text-gray-500" />
                        </div>
                    )}
                    {props.children}
                    <div className="ml-auto flex items-center space-x-2">
                        {props.onStatusChange && (
                            <div className="flex items-center space-x-2 mr-2">
                                <Switch
                                    id={`active-${props.id}`}
                                    checked={props.isActive !== false}
                                    onCheckedChange={props.onStatusChange}
                                />
                                <Label htmlFor={`active-${props.id}`} className="text-xs text-gray-400 hidden sm:block">
                                    {props.isActive !== false ? 'Visible' : 'Hidden'}
                                </Label>
                            </div>
                        )}
                        {props.canEdit && (
                            <Button variant="ghost" size="sm" onClick={props.onEdit}>
                                <Pencil className="h-4 w-4" />
                            </Button>
                        )}
                        {props.canDelete && (
                            <Button variant="ghost" size="sm" onClick={props.onDelete}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </li>
    );
}

const DraggableContent = <T extends DraggableItem>({
    data,
    setData,
    component,
    onReorder,
    onEdit,
    permissions,
    onDelete,
    selectedRows,
    showSelect,
    toggleRowSelection,
    onStatusChange,
}: DraggableProps<T>): JSX.Element => {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = data.findIndex((item) => item.id === active.id);
        const newIndex = data.findIndex((item) => item.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
            const newItems = arrayMove(data, oldIndex, newIndex);
            const updatedItems = newItems.map((item, index) => ({
                ...item,
                order: index
            }));

            setData(updatedItems as T[]);
            onReorder?.(updatedItems as T[]);
        }
    };

    const sortedItems = [...data].sort((a, b) => (a.order || 0) - (b.order || 0));

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sortedItems.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                <ul className="space-y-2">
                    {sortedItems.map((item, index) => (
                        <SortableItem
                            key={item.id}
                            id={item.id}
                            draggable={permissions.includes('drag')}
                            canEdit={permissions.includes('edit')}
                            canDelete={permissions.includes('delete')}
                            onEdit={() => onEdit && onEdit(item)}
                            onDelete={() => onDelete && onDelete(item.id)}
                            isSelected={selectedRows.has(index)}
                            onToggleSelect={() => toggleRowSelection(index)}
                            showSelect={showSelect}
                            isActive={item.is_active}
                            onStatusChange={onStatusChange ? (checked) => onStatusChange(item.id, checked) : undefined}
                        >
                            {component === 'product' && (
                                <div className="flex flex-row items-center gap-4">
                                    <div className="w-24 h-24 flex justify-center items-center flex-shrink-0">
                                        <ImageViewer
                                            src={item.images?.[0]?.url ? item.images?.[0]?.url : '/noimage.png'}
                                            alt={item.name}
                                            className="object-contain w-4/5 h-4/5"
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h3 className="font-semibold text-lg">{item.name}</h3>
                                        <p className="flex gap-2 text-sm text-gray-600">
                                            <span className='hidden sm:block'>Price:</span> ₹{Number(item.price ?? 0).toFixed(2)}
                                        </p>
                                        {item.category && (
                                            <p className="text-sm text-gray-400">
                                                Category: {item.category}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {component === 'category' && (
                                <div className="flex flex-row items-center gap-4">
                                    <div className="w-24 h-24 flex justify-center items-center flex-shrink-0 relative overflow-hidden">
                                        <ImageViewer
                                            src={item.image_url ? item.image_url : '/noimage.png'}
                                            alt={item.name || 'No Image'}
                                            className="object-contain w-4/5 h-4/5"
                                        />
                                    </div>
                                    <div className="flex flex-col flex-grow space-y-2">
                                        <h3 className="font-semibold text-lg">{item.name}</h3>
                                        <p className="text-sm text-gray-600">{item.description}</p>
                                    </div>
                                </div>
                            )}

                            {/* {component === 'queries' && (
                                <div className="flex-grow">
                                    <h3 className="font-semibold text-lg">{item.name}</h3>
                                    <p className="text-sm text-gray-600">Email: {item.email}</p>
                                    <p className="text-sm text-gray-400">Phone: {item.phone}</p>
                                </div>
                            )} */}

                            {component === 'queries' && (
                                <div className="flex flex-row items-start gap-4">
                                    <div className="flex flex-col flex-grow space-y-2">
                                        <h3 className="font-semibold text-lg">{item.name}</h3>
                                        <p className="text-sm text-gray-600 flex gap-1"><AtSign className='text-gray-300' />{item.email}</p>
                                        <p className="text-sm text-gray-600 flex gap-1"><MessageSquareMore className='text-gray-300' /> {item.message}</p>
                                    </div>
                                </div>
                            )}

                            {component === 'testimonials' && (
                                <div className="flex flex-row items-center gap-4">
                                    <div className="w-16 h-16 flex justify-center items-center flex-shrink-0 relative overflow-hidden rounded-full border">
                                        <ImageViewer
                                            src={item.profile_image ? item.profile_image : '/noimage.png'}
                                            alt={item.name || 'No Image'}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <div className="flex flex-col flex-grow space-y-1">
                                        <h3 className="font-semibold text-lg">{item.name}</h3>
                                        <p className="text-sm text-gray-600 italic">"{item.review}"</p>
                                    </div>
                                </div>
                            )}
                        </SortableItem>
                    ))}
                </ul>
            </SortableContext>
        </DndContext>
    );
};

export default DraggableContent;

