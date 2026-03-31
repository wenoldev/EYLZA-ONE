import React, { useMemo, Suspense } from 'react'
import { useStore } from '@/store/useStore'
import ShadeLoader from '../loader/ShadeLoader'
import { ComponentRegistry } from '@eylza/dynamic-components'


interface DynamicPageRendererProps {
  pageKey: string;
}

const DynamicPageRenderer: React.FC<DynamicPageRendererProps> = ({ pageKey }) => {
  const { themeData, pagesContent, isLoading, fetchPageContent } = useStore()

  React.useEffect(() => {
    if (pageKey) {
      fetchPageContent(pageKey);
    }
  }, [pageKey, fetchPageContent]);

  const currentPage = useMemo(() => {
    if (!themeData?.pages) return null;
    return themeData.pages.find((p: any) => p.slug === pageKey || p.name.toLowerCase() === pageKey.toLowerCase());

  }, [themeData, pageKey]);

  const content = useMemo(() => {
    return pagesContent[pageKey] || null;
  }, [pagesContent, pageKey]);

  if (isLoading && !content) return <ShadeLoader />;

  if (!currentPage) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-xl font-semibold">Page not found: {pageKey}</h2>
      </div>
    );
  }

  return (
    <div className="w-full">
      {content && Array.isArray(content) && content.length > 0 ? (
        content.map((component: any, index: number) => { // eslint-disable-line @typescript-eslint/no-explicit-any
          const Component = ComponentRegistry[component.type as keyof typeof ComponentRegistry] as any;

          if (!Component) {
            return (
              <div key={component.id || index} className="py-10 border-b border-dashed border-border/30 bg-card/10">
                <div className="max-w-7xl mx-auto px-4 text-center">
                  <p className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-2">Section: {component.type}</p>
                  <h3 className="text-2xl font-bold">{component.props?.title || 'Component Content'}</h3>
                </div>
              </div>
            );
          }

          return (
            <Suspense key={component.id || index} fallback={<ShadeLoader />}>
              <Component config={component.props} {...component.props} />
            </Suspense>
          );
        })
      ) : (
        <div className="p-20 text-center text-muted-foreground italic">
          {isLoading ? <ShadeLoader /> : 'This page has no content yet.'}
        </div>
      )}
    </div>
  )
}

export default DynamicPageRenderer