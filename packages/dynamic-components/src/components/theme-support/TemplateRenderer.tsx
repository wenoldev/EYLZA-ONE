import { Suspense } from 'react';
import { TEMPLATE_MAP } from '../../registry/productListTemplates';

const TemplateRenderer = ({ template, data, styles }: any) => {
  const TemplateComponent = TEMPLATE_MAP[template] || TEMPLATE_MAP.minimal;

  return (
    <Suspense fallback={<div className="w-full aspect-square bg-gray-100 animate-pulse rounded-lg" />}>
      <TemplateComponent data={data} styles={styles} />
    </Suspense>
  );
};

export default TemplateRenderer;
