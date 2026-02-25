/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Save, RefreshCcw } from 'lucide-react';
import FieldRenderer from './FieldRenderer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FormRendererProps {
  schema: {
    fields: any[];
  };
  content: any;
  onUpdate: (content: any) => Promise<void>;
  isSaving: boolean;
}

const FormRenderer: React.FC<FormRendererProps> = ({ schema, content, onUpdate, isSaving }) => {
  const [formData, setFormData] = useState<any>(content || {});

  useEffect(() => {
    setFormData(content || {});
  }, [content]);

  const handleSave = async () => {
    await onUpdate(formData);
  };

  const handleReset = () => {
    setFormData(content || {});
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <CardTitle className="text-sm font-medium">Edit Content</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset} disabled={isSaving}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Content'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {schema.fields.map((field) => (
            <FieldRenderer 
              key={field.name} 
              field={field} 
              value={formData[field.name]} 
              allValues={formData}
              onChange={(value) => setFormData({ ...formData, [field.name]: value })} 
            />
          ))}
        </CardContent>
      </Card>
      
      <div className="flex justify-end pt-4 border-t">
        <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving Changes...' : 'Save All Changes'}
        </Button>
      </div>
    </div>
  );
};

export default FormRenderer;
