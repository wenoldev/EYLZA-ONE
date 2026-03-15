import SearchComponent from './SearchComponent';
import IconsComponent from './IconsComponent';
import NavigationComponent from './NavigationComponent';
import type { HeaderConfig, HeaderMenus } from '../../types/Header';
import { motion, AnimatePresence } from 'framer-motion';

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
            <div className="flex items-center group cursor-pointer overflow-hidden">
                <h1 className="text-2xl md:text-3xl font-black tracking-tighter transition-transform duration-500 group-hover:scale-105" style={{
                    fontFamily: (config.general?.fontFamily as string) === 'serif' ? 'serif' : 'sans-serif',
                    color: config.general.textColor
                }}>
                    {config.general.logoText || 'LOGO'}
                </h1>
            </div>
        ),
        search: (
            showSearchAsInput && (
                <div className={`flex items-center ${showSearchAsInput ? 'flex-1 max-w-xl mx-auto' : ''}`}>
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
        navigation: !isSearchExpanded && !isSearchInputDesign && !isMobile && (
            <div className="flex-1 flex justify-center">
                <NavigationComponent menus={menus} activeDropdown={activeDropdown} setActiveDropdown={setActiveDropdown} />
            </div>
        ),
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
        <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`w-full transition-all duration-500 border-b border-gray-100 ${config.general.behaviour === 'sticky' ? 'sticky top-0 z-[100]' : ''}`}
            style={{
                backgroundColor: `${config.general.backgroundColor}f2`, // Subtle transparency
                color: config.general.textColor,
                backdropFilter: 'blur(12px)',
                boxShadow: config.general.behaviour === 'sticky' ? '0 10px 30px -10px rgba(0,0,0,0.05)' : 'none'
            }}
        >
            <div className={`max-w-[1920px] mx-auto transition-all duration-300 ${isMobile ? 'py-4 px-4' : 'py-6 px-10 lg:px-16'}`}>
                <div className="flex items-center justify-between gap-8 h-full">
                    <AnimatePresence mode="wait">
                        {isSearchExpanded ? (
                            <motion.div 
                                key="search"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex-1"
                            >
                                {elements.search}
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="normal"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center justify-between w-full gap-8"
                            >
                                {mainConfig.order?.map((item: any, idx: number) => {
                                    const itemId = typeof item === 'object' ? item.id : item;
                                    const isVisible = typeof item === 'object' ? item.visible !== false : true;
                                    if (!isVisible || !elements[itemId]) return null;

                                    return (
                                        <div key={`${itemId}-${idx}`} className={`${itemId === '__gap__' || itemId === 'navigation' ? 'flex-1' : 'shrink-0'}`}>
                                            {elements[itemId]}
                                        </div>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default MainBar;
