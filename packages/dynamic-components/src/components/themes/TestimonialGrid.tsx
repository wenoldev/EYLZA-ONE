import React from 'react';

type TestimonialItem = {
  author: string;
  quote: string;
};

type TestimonialGridProps = {
  title?: string;
  items?: TestimonialItem[];
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  containerWidth?: number;
  paddingTop?: number;
  paddingBottom?: number;
};

const TestimonialGrid: React.FC<TestimonialGridProps> = ({
  title = 'What Customer says about us.',
  items = [],
  backgroundColor = '#ffffff',
  textColor = '#1f1a17',
  accentColor = '#8f8667',
  containerWidth = 1200,
  paddingTop = 56,
  paddingBottom = 56
}) => {
  if (!items.length) return null;

  return (
    <section style={{ backgroundColor, paddingTop, paddingBottom }}>
      <div className="mx-auto px-4 md:px-8" style={{ maxWidth: containerWidth }}>
        <h2 className="mb-10 text-center font-serif text-4xl md:text-5xl" style={{ color: textColor }}>
          {title}
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {items.map((item) => (
            <article key={item.author} className="bg-[#f8f5ef] px-6 py-8 text-center">
              <h3 className="mb-3 text-sm font-semibold" style={{ color: textColor }}>
                {item.author}
              </h3>
              <p className="text-sm leading-7" style={{ color: accentColor }}>
                {item.quote}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialGrid;
