import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { HeaderConfig, HeaderMenus } from '../types/Header';

interface NavigationComponentProps {
    menus: HeaderMenus;
    activeDropdown: string | null;
    setActiveDropdown: (val: string | null) => void;
}

const NavigationComponent = ({ menus, activeDropdown, setActiveDropdown }: NavigationComponentProps) => {

    const spacing = 'gap-6';

    const getHighlightClass = (isActive: boolean) => {
        return `text-sm font-medium transition-colors hover:opacity-70 ${isActive ? 'opacity-100 font-bold' : 'opacity-80'}`;
    };

    return (
        <nav className={`hidden lg:flex items-center ${spacing}`}>
            {menus.mainSection.map((item) => (
                <div
                    key={item.title}
                    className="relative group h-full flex items-center"
                    onMouseEnter={() => setActiveDropdown(item.title)}
                    onMouseLeave={() => setActiveDropdown(null)}
                >
                    <Link
                        to={item.link || '#'}
                        className={`flex items-center gap-1 text-[14px] font-semibold transition-colors py-2 ${getHighlightClass(activeDropdown === item.title)}`}
                    >
                        {item.title}
                        {item.subMenu && item.subMenu.length > 0 && <ChevronDown size={14} className="ml-1 opacity-50" />}
                    </Link>

                    {item.subMenu && activeDropdown === item.title && (
                        <>
                            {/* Transparent bridge to maintain hover */}
                            <div className="absolute top-full left-0 w-full h-4 z-40" />

                            <div className="absolute top-full left-0 mt-2 bg-white border shadow-xl rounded-xl py-4 min-w-[220px] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                {item.subMenu.map((child) => (
                                    <Link
                                        key={child.title}
                                        to={child.link || '#'}
                                        className="block w-full text-left px-6 py-3 text-sm font-medium hover:bg-gray-50 text-gray-700 hover:text-black transition-colors"
                                    >
                                        {child.title}
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            ))}
        </nav>
    );
};

export default NavigationComponent;
export type { NavigationComponentProps };
