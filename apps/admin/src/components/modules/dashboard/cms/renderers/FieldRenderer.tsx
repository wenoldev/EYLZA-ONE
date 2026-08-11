/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { UploadDialog } from "@/components/common/UploadImage";
import { UploadVideoDialog } from "@/components/common/UploadVideo";
import { X, Plus, Trash2, Wand2, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface FieldProps {
  field: {
    type: string;
    name: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    condition?: {
      field: string;
      operator?: '===' | '!==' | 'includes' | 'exists';
      value?: any;
    };
    options?: { label: string; value: string }[];
    fields?: any[]; // For nested objects/arrays
  };
  value: any;
  allValues?: any;
  onChange: (value: any) => void;
}

const FieldRenderer: React.FC<FieldProps> = ({ field, value, onChange, allValues = {} }) => {
  const { type, name, label, placeholder, options, required, condition } = field;

  // Check if field should be hidden based on conditions
  if (condition && allValues) {
    const targetValue = allValues[condition.field];
    const op = condition.operator || '===';
    
    let isMatch = false;
    if (op === '===') isMatch = targetValue === condition.value;
    else if (op === '!==') isMatch = targetValue !== condition.value;
    else if (op === 'includes') isMatch = Array.isArray(targetValue) && targetValue.includes(condition.value);
    else if (op === 'exists') isMatch = targetValue !== undefined && targetValue !== null && targetValue !== '';

    if (!isMatch) return null;
  }

  const generateRandomId = () => {
    const randomStr = Math.random().toString(36).substring(2, 8);
    const timestamp = Date.now().toString().substring(8);
    onChange(`id-${randomStr}-${timestamp}`);
  };

  const renderInput = () => {
    switch (type) {
      case 'text':
      case 'email':
        return (
          <div className="flex gap-2">
            <Input 
              value={value || ''} 
              onChange={(e) => onChange(e.target.value)} 
              placeholder={placeholder} 
              className="flex-1"
            />
            {name === 'id' && (
              <Button 
                type="button" 
                variant="outline" 
                size="icon" 
                onClick={generateRandomId}
                title="Generate Random ID"
              >
                <Wand2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      
      case 'number':
        return (
          <Input 
            type="number" 
            value={value || ''} 
            onChange={(e) => onChange(parseFloat(e.target.value))} 
            placeholder={placeholder} 
          />
        );

      case 'textarea':
        return (
          <Textarea 
            value={value || ''} 
            onChange={(e) => onChange(e.target.value)} 
            placeholder={placeholder} 
          />
        );

      case 'boolean':
      case 'toggle':
        return (
          <div className="flex items-center space-x-2 py-2">
            <Switch 
              checked={!!value} 
              onCheckedChange={(checked) => onChange(checked)} 
            />
            <Label>{label}</Label>
          </div>
        );

      case 'select':
        return (
          <Select onValueChange={onChange} value={value || ''}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder || "Select option"} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'radio':
        return (
          <div className="flex flex-wrap gap-4 pt-1">
            {options?.map((opt) => (
              <div key={opt.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`${name}-${opt.value}`}
                  name={name}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={() => onChange(opt.value)}
                  className="h-4 w-4 border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
                <Label htmlFor={`${name}-${opt.value}`} className="cursor-pointer font-normal">{opt.label}</Label>
              </div>
            ))}
          </div>
        );

      case 'checkbox': {
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
            {options?.map((opt) => (
              <div key={opt.value} className="flex items-center space-x-2">
                <Checkbox 
                  id={`${name}-${opt.value}`}
                  checked={selectedValues.includes(opt.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onChange([...selectedValues, opt.value]);
                    } else {
                      onChange(selectedValues.filter((v: any) => v !== opt.value));
                    }
                  }}
                />
                <Label htmlFor={`${name}-${opt.value}`} className="text-sm font-normal cursor-pointer">
                  {opt.label}
                </Label>
              </div>
            ))}
          </div>
        );
      }

      case 'image':
        return (
           <div className="space-y-4">
              <UploadDialog
                multiple={false}
                onImagesSelected={(images) => {
                  if (images.length > 0) {
                    onChange(images[0].image_url || '');
                  }
                }}
                initialValues={value ? [{ image_url: value, isPrimary: true }] : []}
              />
              {value && (
                <div className="relative w-32 h-32 group">
                  <img
                    src={typeof value === 'string' ? value : (value?.fileContent || '/placeholder.svg')}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-md border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onChange(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
           </div>
        );

      case 'multiImage': {
        const images = Array.isArray(value) ? value : [];
        return (
           <div className="space-y-4">
              <UploadDialog
                multiple={true}
                onImagesSelected={(selectedImages) => {
                  const urls = selectedImages.map(img => 
                    typeof img.image_url === 'string' ? img.image_url : img.image_url.fileContent
                  );
                  onChange(urls);
                }}
                initialValues={images.map(url => ({ image_url: url, isPrimary: false }))}
              />
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
                  {images.map((url, idx) => (
                    <div key={idx} className="relative aspect-square group">
                      <img
                        src={url || '/placeholder.svg'}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover rounded-md border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                        onClick={() => {
                          const newImages = [...images];
                          newImages.splice(idx, 1);
                          onChange(newImages);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
           </div>
        );
      }

      case 'video':
        return (
           <div className="space-y-4">
              <UploadVideoDialog
                multiple={false}
                onVideosSelected={(videos) => {
                  if (videos.length > 0) {
                    onChange(videos[0].video_url); 
                  }
                }}
                initialValues={value ? [{ video_url: value, isPrimary: true }] : []}
              />
              {value && (
                <div className="relative w-full aspect-video group max-w-sm">
                  <video
                    src={value || ''}
                    controls
                    className="w-full h-full object-contain rounded-md border bg-black"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    onClick={() => onChange(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
           </div>
        );

      case 'multiVideo': {
        const videos = Array.isArray(value) ? value : [];
        return (
           <div className="space-y-4">
              <UploadVideoDialog
                multiple={true}
                onVideosSelected={(selectedVideos) => {
                  const urls = selectedVideos.map(vid => vid.video_url);
                  onChange(urls);
                }}
                initialValues={videos.map(url => ({ video_url: url, isPrimary: false }))}
              />
              {videos.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  {videos.map((url, idx) => (
                    <div key={idx} className="relative aspect-video group border rounded-md bg-black">
                      <video
                        src={url || ''}
                        controls
                        className="w-full h-full object-contain rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm"
                        onClick={() => {
                          const newVideos = [...videos];
                          newVideos.splice(idx, 1);
                          onChange(newVideos);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
           </div>
        );
      }

      case 'object':
        return (
          <Card className="border-l-4 border-l-primary/30">
            <CardContent className="pt-6 space-y-4">
              {field.fields?.map((f) => (
                <div key={f.name} className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{f.label}</Label>
                  <FieldRenderer 
                    field={f} 
                    value={value?.[f.name]} 
                    onChange={(v) => onChange({ ...value, [f.name]: v })} 
                    allValues={value}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        );

      case 'array': {
        const items = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="relative group">
                <div className="absolute -left-3 top-0 bottom-0 w-1 bg-primary/20 rounded-full" />
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-muted-foreground">Item #{index + 1}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-destructive"
                      onClick={() => {
                        const newArr = [...items];
                        newArr.splice(index, 1);
                        onChange(newArr);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
                {field.fields ? (
                   // If array of objects
                   <Card className="border-dashed">
                     <CardContent className="pt-6 space-y-4">
                        {field.fields.map((f) => (
                           <div key={f.name} className="space-y-2">
                             <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{f.label}</Label>
                             <FieldRenderer 
                                field={f} 
                                value={item?.[f.name]} 
                                allValues={item}
                                onChange={(v) => {
                                  const newArr = [...items];
                                  newArr[index] = { ...item, [f.name]: v };
                                  onChange(newArr);
                                }} 
                             />
                           </div>
                        ))}
                     </CardContent>
                   </Card>
                ) : (
                   // If array of simple values
                   <FieldRenderer 
                      field={{ ...field, type: 'text', label: '' }} 
                      value={item} 
                      onChange={(v) => {
                        const newArr = [...items];
                        newArr[index] = v;
                        onChange(newArr);
                      }} 
                   />
                )}
              </div>
            ))}
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full border-dashed"
              onClick={() => {
                const newItem = field.fields 
                  ? field.fields.reduce((acc: any, f: any) => ({ ...acc, [f.name]: null }), {})
                  : '';
                onChange([...items, newItem]);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item to {label}
            </Button>
          </div>
        );
      }

      default:
        return <div className="text-destructive">Unsupported field type: {type}</div>;
    }
  };

  return (
    <div className="space-y-2">
      {type !== 'boolean' && type !== 'toggle' && type !== 'object' && type !== 'array' && (
        <Label className="flex items-center gap-1">
          {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      {renderInput()}
    </div>
  );
};

export default FieldRenderer;
