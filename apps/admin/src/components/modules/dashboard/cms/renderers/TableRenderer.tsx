/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit2, Trash2, Save, Image as ImageIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import FieldRenderer from './FieldRenderer';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TableRendererProps {
  schema: {
    fields: any[];
  };
  content: any[];
  onUpdate: (content: any[]) => Promise<void>;
  isSaving: boolean;
}

const TableRenderer: React.FC<TableRendererProps> = ({ schema, content = [], onUpdate, isSaving }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempItem, setTempItem] = useState<any>({});

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setTempItem(schema?.fields?.reduce((acc, f) => ({ ...acc, [f.name]: null }), {}) || {});
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (index: number) => {
    setEditingIndex(index);
    setTempItem({ ...content[index] });
    setIsDialogOpen(true);
  };

  const handleDelete = async (index: number) => {
    const newContent = [...content];
    newContent.splice(index, 1);
    await onUpdate(newContent);
  };

  const handleSaveItem = async () => {
    const newContent = [...content];
    if (editingIndex !== null) {
      newContent[editingIndex] = tempItem;
    } else {
      newContent.unshift(tempItem);
    }
    await onUpdate(newContent);
    setIsDialogOpen(false);
  };

  const renderCellContent = (field: any, value: any) => {
    if (value === null || value === undefined) return <span className="text-muted-foreground text-xs italic">Empty</span>;
    
    switch (field.type) {
      case 'image':
        return (
          <div className="w-10 h-10 rounded overflow-hidden bg-muted flex items-center justify-center border">
            {value ? (
                <img 
                  src={typeof value === 'string' ? value : (value?.fileContent || '')} 
                  alt="thumb" 
                  className="w-full h-full object-cover" 
                />
            ) : (
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        );
      case 'boolean':
      case 'toggle':
        return (
            <div className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold w-fit ${value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {value ? 'Yes' : 'No'}
            </div>
        );
      case 'object':
        return <span className="text-xs font-mono text-muted-foreground">Object</span>;
      case 'array':
        return <span className="text-xs font-mono text-muted-foreground">Array ({value?.length || 0})</span>;
      default:
        return <span className="truncate max-w-[200px] block">{String(value)}</span>;
    }
  };

  // Only show first 4 fields in table to avoid overcrowding
  const tableFields = schema.fields.slice(0, 4);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Entries</h3>
        <Button onClick={handleOpenAdd} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="rounded-md border bg-white dark:bg-black/20">
        <Table>
          <TableHeader>
            <TableRow>
              {tableFields.map((f) => (
                <TableHead key={f.name}>{f.label}</TableHead>
              ))}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {content.length > 0 ? (
              content.map((item, idx) => (
                <TableRow key={idx}>
                  {tableFields.map((f) => (
                    <TableCell key={f.name}>
                      {renderCellContent(f, item[f.name])}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenEdit(idx)}>
                            <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(idx)}>
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={tableFields.length + 1} className="h-24 text-center text-muted-foreground italic">
                  No entries found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>{editingIndex !== null ? 'Edit Item' : 'Add New Item'}</DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-6 pb-6">
                {schema?.fields?.map((field) => (
                    <FieldRenderer 
                        key={field.name} 
                        field={field} 
                        value={tempItem[field.name]} 
                        allValues={tempItem}
                        onChange={(val) => setTempItem({ ...tempItem, [field.name]: val })} 
                    />
                ))}
            </div>
          </ScrollArea>

          <DialogFooter className="p-6 pt-2 bg-muted/30 border-t">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveItem} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Item'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TableRenderer;
