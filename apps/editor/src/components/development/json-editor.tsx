import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Editor from '@monaco-editor/react';

export default function JsonEditor() {
  const [pages, setPages] = useState<any[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>('');
  const [jsonText, setJsonText] = useState<string>('');

  const getStorageKey = (slug: string) => slug === '__global_config__' ? 'dev_global_config' : `dev_page_${slug}`;

  useEffect(() => {
    try {
      const storedPages = localStorage.getItem('dev_pages_list');
      if (storedPages) {
        const parsedPages = JSON.parse(storedPages);
        setPages(parsedPages);
        if (parsedPages.length > 0) {
          const firstSlug = parsedPages[0].slug || parsedPages[0].name.toLowerCase().replace(/\s+/g, "-");
          setSelectedSlug(firstSlug);
        }
      }
    } catch (e) {
      console.error('Failed to parse dev_pages_list', e);
    }
  }, []);

  useEffect(() => {
    if (selectedSlug) {
      const existing = localStorage.getItem(getStorageKey(selectedSlug));
      if (existing) {
        setJsonText(existing);
      } else {
        setJsonText(selectedSlug === '__global_config__' ? '{}' : '[]');
      }
    }
  }, [selectedSlug]);

  const handleSave = () => {
    if (!selectedSlug) return;
    try {
      JSON.parse(jsonText); // Validate JSON
      localStorage.setItem(getStorageKey(selectedSlug), jsonText);
      toast.success('JSON saved to localStorage!');
    } catch (e) {
      toast.error('Invalid JSON!');
    }
  };

  const handleClear = () => {
    if (!selectedSlug) return;
    localStorage.removeItem(getStorageKey(selectedSlug));
    setJsonText(selectedSlug === '__global_config__' ? '{}' : '[]');
    toast.success('Cleared from localStorage!');
  }

  return (
    <div className="p-4 space-y-4 max-w-4xl mx-auto h-screen flex flex-col font-sans">
      <div className="flex items-center gap-4 border-b pb-4">
        <h1 className="text-xl font-bold flex-1">Theme JSON Editor (Dev)</h1>
        <Select value={selectedSlug} onValueChange={setSelectedSlug}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select a page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__global_config__">
              Global Settings (Header/Footer)
            </SelectItem>
            {pages.map((page: any) => {
              const slug = page.slug || page.name.toLowerCase().replace(/\s+/g, "-");
              return (
                <SelectItem key={slug} value={slug}>
                  {page.name} ({slug})
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <Button onClick={handleSave}>Save Override</Button>
        <Button variant="destructive" onClick={handleClear}>Clear Override</Button>
      </div>
      
      <div className="flex-1 min-h-0 flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">
          Editing localStorage override for: <strong>{getStorageKey(selectedSlug)}</strong>
          <br />
          Note: Ensure `isDev` is true in your store for the editor to load this override! Refresh the main editor after saving.
        </p>
        <div className="flex-1 border rounded-md overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage="json"
            value={jsonText}
            onChange={(value) => setJsonText(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              wordWrap: 'on',
              formatOnPaste: true,
              tabSize: 2,
            }}
          />
        </div>
      </div>
    </div>
  );
}