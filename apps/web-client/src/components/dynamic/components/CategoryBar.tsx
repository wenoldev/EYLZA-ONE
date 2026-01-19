import { Link } from 'react-router-dom';
import type { HeaderConfig, HeaderMenus } from '../types/Header';

const CategoryBar = ({ config, menus }: { config: HeaderConfig; menus: HeaderMenus }) => {
    if (!config.bottomBar?.show) return null;

    return (
        <div
            className="py-3 border-b border-gray-100 overflow-x-auto no-scrollbar"
            style={{
                backgroundColor: config.general.backgroundColor,
                color: config.general.textColor,
            }}
        >
            <div className={`px-6 flex items-center ${config.bottomBar.alignment == 'center' ? 'justify-center':'justify-start'} md:gap-8 gap-4 whitespace-nowrap min-w-max md:min-w-0`}>
                {menus.categoryBar.map((category) => (
                    <Link
                        key={category.title}
                        to={category.link}
                        className="text-sm font-medium hover:opacity-70 transition-opacity"
                        style={{ color: config.general.textColor }}
                    >
                        {category.title}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategoryBar;
