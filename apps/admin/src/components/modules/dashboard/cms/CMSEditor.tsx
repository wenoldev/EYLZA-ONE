/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Save, Code, Layout, Settings2, Copy, ExternalLink } from 'lucide-react';
import Loader from '@/components/common/Loader';
import { useCMSStore, type CMS } from '@/stores/cmsStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FormRenderer from './renderers/FormRenderer.tsx';
import TableRenderer from './renderers/TableRenderer.tsx';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import Editor from '@monaco-editor/react';

interface CMSSchema {
  displayType: 'table' | 'form';
  fields: any[];
}

const CMSEditorPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { updateCMSContent } = useCMSStore();
    
    const [cms, setCms] = useState<CMS | null>(null);
    const [schema, setSchema] = useState<CMSSchema | null>(null);
    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [editorValue, setEditorValue] = useState<string>('');
    const [contentEditorValue, setContentEditorValue] = useState<string>('');

    const fetchData = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        try {
            // Fetch CMS record with content
            const response = await api.get(`/api/v1/cms/${id}?include_content=true`);
            const { cms, content } = response.data.data;
            setCms(cms);
            setSchema(content.editor);
            setContent(content.data);
            setEditorValue(JSON.stringify(content.editor, null, 2));
            setContentEditorValue(JSON.stringify(content.data, null, 2));
        } catch (err) {
            toast.error("Failed to fetch CMS content");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleCopyUrl = () => {
        if (!cms?.content_json_url) return;
        navigator.clipboard.writeText(cms.content_json_url);
        toast.success("Content URL copied to clipboard");
    };

    const handleSaveContent = async (newContent: any) => {
        if (!id) return;
        setIsSaving(true);
        try {
            const result = await updateCMSContent(id, 'content', newContent);
            const processed = result.data.content;
            setContent(processed);
            setContentEditorValue(JSON.stringify(processed, null, 2));
            toast.success("Content saved successfully");
        } catch (err) {
            toast.error("Failed to save content");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveRawContent = async () => {
        if (!id) return;
        try {
            const newContent = JSON.parse(contentEditorValue);
            setIsSaving(true);
            const result = await updateCMSContent(id, 'content', newContent);
            const processed = result.data.content;
            setContent(processed);
            setContentEditorValue(JSON.stringify(processed, null, 2));
            toast.success("Raw content updated successfully");
        } catch (err: any) {
            toast.error(`Invalid Content JSON: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveSchema = async () => {
        if (!id) return;
        try {
            const newSchema = JSON.parse(editorValue);
            setIsSaving(true);
            const result = await updateCMSContent(id, 'editor', newSchema);
            const processed = result.data.content; // Content is named 'content' in PUT response but contains updated schema if type=editor
            setSchema(processed);
            setEditorValue(JSON.stringify(processed, null, 2));
            toast.success("Structure updated successfully");
        } catch (err: any) {
            toast.error(`Invalid Structure JSON: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <Loader />;
    if (!cms || !schema) return <div className="p-10 text-center">CMS not found</div>;

    return (
        <div className="flex flex-col h-full space-y-4">
            <div className="flex justify-between items-center p-4 bg-background border-b sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/cms')}>
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold">{cms.name}</h2>
                            <Badge variant="outline">{schema.displayType}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground italic">
                            Last updated: {new Date(cms.updated_at).toLocaleString()}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="sm" onClick={handleCopyUrl} className="flex items-center gap-2">
                                    <Copy className="h-4 w-4" />
                                    Copy Content URL
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-xs">Direct JSON link for developers</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <Button variant="outline" size="sm" onClick={() => window.open(cms.content_json_url, '_blank')} title="View Raw JSON">
                        <ExternalLink className="h-4 w-4" />
                    </Button>

                    <Button variant="outline" size="sm" onClick={() => fetchData()}>
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-4 max-w-[1600px] mx-auto w-full">
                <Tabs defaultValue="content" className="w-full">
                    <div className="flex justify-between items-center mb-6">
                        <TabsList>
                            <TabsTrigger value="content" className="flex items-center gap-2">
                                <Layout className="h-4 w-4" />
                                Content Preview
                            </TabsTrigger>
                            <TabsTrigger value="schema" className="flex items-center gap-2">
                                <Settings2 className="h-4 w-4" />
                                Developer (JSON)
                            </TabsTrigger>
                        </TabsList>
                        
                        <div className="text-xs text-muted-foreground">
                            {Array.isArray(content) ? `${content.length} items` : '1 Item (Form)'}
                        </div>
                    </div>

                    <TabsContent value="content" className="mt-0">
                        {schema.displayType === 'table' ? (
                            <TableRenderer 
                                schema={schema} 
                                content={content} 
                                onUpdate={handleSaveContent}
                                isSaving={isSaving}
                            />
                        ) : (
                            <FormRenderer 
                                schema={schema} 
                                content={content} 
                                onUpdate={handleSaveContent}
                                isSaving={isSaving}
                            />
                        )}
                    </TabsContent>

                    <TabsContent value="schema" className="mt-0">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[700px]">
                            {/* Editor Schema / Structure */}
                            <div className="flex flex-col space-y-4 h-full border rounded-xl bg-muted/30 p-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-bold flex items-center gap-2">
                                        <Settings2 className="h-4 w-4" />
                                        Structure Schema
                                    </h3>
                                    <Button size="sm" onClick={handleSaveSchema} disabled={isSaving}>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Structure
                                    </Button>
                                </div>
                                <div className="flex-1 border rounded-lg overflow-hidden bg-[#1e1e1e]">
                                    <Editor
                                        height="100%"
                                        defaultLanguage="json"
                                        value={editorValue}
                                        theme="vs-dark"
                                        onChange={(value) => setEditorValue(value || '')}
                                        options={{
                                            minimap: { enabled: false },
                                            fontSize: 13,
                                            formatOnPaste: true,
                                            scrollBeyondLastLine: false,
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Content Data JSON */}
                            <div className="flex flex-col space-y-4 h-full border rounded-xl bg-muted/30 p-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-bold flex items-center gap-2">
                                        <Code className="h-4 w-4" />
                                        Content Data (Raw)
                                    </h3>
                                    <Button size="sm" variant="outline" onClick={handleSaveRawContent} disabled={isSaving}>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Content
                                    </Button>
                                </div>
                                <div className="flex-1 border rounded-lg overflow-hidden bg-[#1e1e1e]">
                                    <Editor
                                        height="100%"
                                        defaultLanguage="json"
                                        value={contentEditorValue}
                                        theme="vs-dark"
                                        onChange={(value) => setContentEditorValue(value || '')}
                                        options={{
                                            minimap: { enabled: false },
                                            fontSize: 13,
                                            formatOnPaste: true,
                                            scrollBeyondLastLine: false,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-6 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                           <p className="text-xs text-blue-700 dark:text-blue-300">
                             <strong>Developer Tip:</strong> Use the left editor to define your UI fields and the right editor to manually adjust or batch-edit your data. Both sync to Cloudinary.
                           </p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default CMSEditorPage;
