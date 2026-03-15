import { User, Heart, ShoppingBag, X, Menu, Search } from 'lucide-react';
import type { HeaderConfig } from '../../types/Header';

interface IconsComponentProps {
    config: HeaderConfig;
    isSearchExpanded: boolean;
    setIsSearchExpanded: (val: boolean) => void;
    onToggleLoginDialog?: () => void;
    onToggleCart?: () => void;
    onToggleWishlist?: () => void;
    onToggleMobileMenu?: () => void;
    cartCount?: number;
    isMobileMenuOpen: boolean;
    isSearchInputDesign?: boolean;
    viewportSize?: string;
}

const IconsComponent = ({ config, isSearchExpanded, setIsSearchExpanded, onToggleLoginDialog, onToggleCart, onToggleWishlist, onToggleMobileMenu, isMobileMenuOpen, cartCount, isSearchInputDesign, viewportSize }: IconsComponentProps) => {
    const accentColor = config.general.textColor || '#1f2937';
    const iconSize = 24;
    const strokeWidth = 2;

    const iconWrapperClass = "p-1 hover:opacity-70 transition-opacity";
    const isMobile = viewportSize ? (viewportSize === 'mobile' || viewportSize === 'tablet') : (typeof window !== 'undefined' && window.innerWidth < 1024);
    const showSearchIcon = (config.mainBar.searchDesign === 'icon' || isMobile || (config.mainBar.searchDesign === 'input' && isMobile)) && !isSearchExpanded && (config?.mainBar?.order?.find(
        item => item.id === "search"
    )?.visible);
    const showNavigationButton = (isMobile || isSearchInputDesign) && (config?.mainBar?.order?.find(
        item => item.id === "navigation"
    )?.visible);


    return (
        <div className="flex items-center gap-4">
            {showSearchIcon && (
                <button className={iconWrapperClass} onClick={() => setIsSearchExpanded(true)}>
                    <Search size={iconSize} strokeWidth={strokeWidth} style={{ color: accentColor }} />
                </button>
            )}
            {onToggleLoginDialog && (
                <button className={iconWrapperClass} onClick={onToggleLoginDialog}>
                    <User size={iconSize} strokeWidth={strokeWidth} style={{ color: accentColor }} />
                </button>
            )}
            {onToggleWishlist && (
                <button className={iconWrapperClass} onClick={onToggleWishlist}>
                    <Heart size={iconSize} strokeWidth={strokeWidth} style={{ color: accentColor }} />
                </button>
            )}
            {onToggleCart && (
                <button className={`${iconWrapperClass} relative`} onClick={onToggleCart}>
                    <ShoppingBag size={iconSize} strokeWidth={strokeWidth} style={{ color: accentColor }} />
                    {cartCount !== undefined && cartCount > 0 && (
                        <span
                            className={`absolute inline-flex items-center justify-center w-4 h-4 text-[8px] font-bold rounded-full transition-all duration-300 top-0 right-0`}
                            style={{
                                backgroundColor: '#ef4444',
                                color: '#ffffff'
                            }}
                        >
                            {cartCount}
                        </span>
                    )}
                </button>
            )}{showNavigationButton && (
                <button
                    onClick={onToggleMobileMenu}
                    className="p-1 flex items-center justify-center"
                    style={{ color: accentColor }}
                >
                    {isMobileMenuOpen ? <X size={iconSize} strokeWidth={strokeWidth} /> : <Menu size={iconSize} strokeWidth={strokeWidth} />}
                </button>
            )}
        </div>
    );
};

export default IconsComponent;
export type { IconsComponentProps };
