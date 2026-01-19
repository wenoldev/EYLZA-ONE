import SearchComponent from './SearchComponent';
import IconsComponent from './IconsComponent';
import NavigationComponent from './NavigationComponent';
import type { HeaderConfig, HeaderMenus } from '../types/Header';

interface MainBarProps {
    config: HeaderConfig;
    menus: HeaderMenus;
    activeDropdown: string | null;
    setActiveDropdown: (val: string | null) => void;
    searchKeyword: string;
    setSearchKeyword: (val: string) => void;
    isSearchExpanded: boolean;
    setIsSearchExpanded: (val: boolean) => void;
    onToggleLoginDialog?: () => void;
    onToggleCart?: () => void;
    onToggleWishlist?: () => void;
    cartCount?: number;
    onToggleMobileMenu?: () => void;
    isMobileMenuOpen: boolean;
    viewportSize?: string;
}

const MainBar = ({
    config, menus, activeDropdown, setActiveDropdown,
    searchKeyword, setSearchKeyword, isSearchExpanded, setIsSearchExpanded,
    onToggleLoginDialog, onToggleCart, onToggleWishlist, cartCount, onToggleMobileMenu, isMobileMenuOpen, viewportSize
}: MainBarProps) => {
    const mainConfig = config?.mainBar;

    if (!mainConfig) return null;

    const isMobile = viewportSize ? (viewportSize === 'mobile' || viewportSize === 'tablet') : (typeof window !== 'undefined' && window.innerWidth < 1024);
    const isSearchInputDesign = mainConfig.searchDesign === 'input';

    // On mobile, we force 'icon' design even if 'input' is selected
    const effectiveSearchDesign = isMobile ? 'icon' : mainConfig.searchDesign;
    const showSearchAsInput = isSearchExpanded || (effectiveSearchDesign === 'input');

    const elements: Record<string, React.ReactNode> = {
        logo: !isSearchExpanded && (
            <div className="flex items-center">
                <h1 className="text-2xl font-black tracking-tighter" style={{
                    fontFamily: (config.general?.fontFamily as string) === 'serif' ? 'serif' : 'sans-serif',
                    color: config.general.textColor
                }}>
                    {config.general.logoText || 'LOGO'}
                </h1>
            </div>
        ),
        search: (
            showSearchAsInput && (
                <div className={`flex items-center ${showSearchAsInput ? 'flex-1' : ''}`}>
                    <SearchComponent
                        config={config}
                        searchKeyword={searchKeyword}
                        setSearchKeyword={setSearchKeyword}
                        isSearchExpanded={isSearchExpanded}
                        setIsSearchExpanded={setIsSearchExpanded}
                    />
                </div>
            )
        ),
        navigation: !isSearchExpanded && !isSearchInputDesign && !isMobile && <NavigationComponent menus={menus} activeDropdown={activeDropdown} setActiveDropdown={setActiveDropdown} />,
        icons: !isSearchExpanded && (
            <IconsComponent
                config={config}
                isSearchExpanded={isSearchExpanded}
                setIsSearchExpanded={setIsSearchExpanded}
                onToggleLoginDialog={onToggleLoginDialog}
                onToggleCart={onToggleCart}
                onToggleWishlist={onToggleWishlist}
                onToggleMobileMenu={onToggleMobileMenu}
                cartCount={cartCount}
                isMobileMenuOpen={isMobileMenuOpen}
                isSearchInputDesign={isSearchInputDesign}
                viewportSize={viewportSize}
            />
        ),
        __gap__: !isSearchExpanded && <div className="flex-1" />
    };

    return (
        <div
            className={`py-5 border-b border-gray-100 backdrop-blur-md transition-all duration-300 ${config.general.behaviour === 'sticky' ? 'sticky top-0 z-50' : ''}`}
            style={{
                backgroundColor: config.general.backgroundColor,
                color: config.general.textColor,
            }}
        >
            <div className={`px-6 h-full`}>
                <div className="flex items-center justify-between gap-8 h-full">
                    {isSearchExpanded
                        ? elements.search
                        : mainConfig.order?.map((item: any, idx: number) => {
                            const itemId = typeof item === 'object' ? item.id : item;

                            const isVisible = typeof item === 'object' ? item.visible !== false : true;
                            if (!isVisible || !elements[itemId]) return null;

                            return (
                                <div key={`${itemId}-${idx}`} className={itemId === '__gap__' ? 'flex-1' : ''}>
                                    {elements[itemId]}
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
};

export default MainBar;
