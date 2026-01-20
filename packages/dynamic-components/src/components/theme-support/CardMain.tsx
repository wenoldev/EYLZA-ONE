import type { CardConfig } from '../../types/Card';

const CardMain = ({ config }: { config: CardConfig }) => {
    const shadowClasses = {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg'
    };

    const borderRadiusMap: Record<string, string> = {
        none: '0',
        sm: '4px',
        md: '8px',
        lg: '12px',
        full: '999px'
    };

    return (
        <div
            className={`transition-shadow duration-300 overflow-hidden ${shadowClasses[config.styles.shadow]} hover:shadow-xl`}
            style={{
                backgroundColor: config.styles.backgroundColor,
                borderRadius: borderRadiusMap[config.styles.borderRadius as string] || config.styles.borderRadius
            }}
        >
            {config.image && (
                <div className="w-full h-48 overflow-hidden bg-gray-200">
                    <img src={config.image} alt={config.title} className="w-full h-full object-cover" />
                </div>
            )}
            <div className="p-4" style={{ padding: config.styles.padding }}>
                {config.badge && (
                    <span
                        className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-2"
                        style={{ backgroundColor: config.styles.badgeColor, color: config.styles.badgeTextColor }}
                    >
                        {config.badge}
                    </span>
                )}
                <h3 className="text-xl font-bold mb-2" style={{ color: config.styles.textColor }}>{config.title}</h3>
                <p className="opacity-80 text-sm mb-4" style={{ color: config.styles.textColor }}>{config.description}</p>
                {config.footer && (
                    <div
                        className="text-sm opacity-60 pt-4 border-t"
                        style={{ borderTopColor: config.styles.textColor + '20', color: config.styles.textColor }}
                    >
                        {config.footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CardMain;
