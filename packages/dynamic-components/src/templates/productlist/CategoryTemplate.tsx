// CategoryTemplate.tsx

const CategoryTemplate = ({ data, styles }: any) => {
  const {
    imageShape = 'circle',
    aspectRatio = '1/1',
    textAlign = 'center',
    titleColor = '#111827',
    subtitleColor = '#6b7280',
    showShadow = false
  } = styles;

  const shapeClasses: any = {
    circle: 'rounded-full',
    square: 'rounded-none',
    rounded: 'rounded-2xl'
  };

  const alignmentClasses: any = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end'
  };

  return (
    <div
      className={`flex flex-col ${alignmentClasses[textAlign]} transition-transform duration-300 hover:scale-[1.02] group`}
    >
      <div
        className={`relative overflow-hidden mb-4 ${shapeClasses[imageShape]} transition-shadow duration-300`}
        style={{
          aspectRatio,
          width: '100%',
          boxShadow: showShadow ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' : 'none'
        }}
      >
        <img
          src={data.imageUrl || data.image}
          alt={data.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <h3
        className="text-lg font-bold uppercase tracking-wider mb-1"
        style={{ color: titleColor }}
        dangerouslySetInnerHTML={{ __html: data.title }}
      />
      {data.subtitle && (
        <p
          className="text-sm opacity-70"
          style={{ color: subtitleColor }}
          dangerouslySetInnerHTML={{ __html: data.subtitle }}
        />
      )}
    </div>
  );
};

export default CategoryTemplate;
