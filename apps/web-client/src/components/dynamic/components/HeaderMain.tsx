import { useState, lazy, Suspense } from 'react';
import type { HeaderProps } from '../types/Header';
import SideBar from './common/SideBar';

// Modular Components (Lazy Loaded)
const TopBar = lazy(() => import('./TopBar'));
const MainBar = lazy(() => import('./MainBar'));
const CategoryBar = lazy(() => import('./CategoryBar'));


const HeaderMain = ({ config, actions, menus, viewportSize }: HeaderProps & { viewportSize?: string }) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  if (!config || !menus) return null;

  const onToggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      <header className="bg-white flex flex-col relative">
        <Suspense fallback={null}>
          <TopBar config={config} />
          <MainBar
            config={config}
            menus={menus}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            isSearchExpanded={isSearchExpanded}
            setIsSearchExpanded={setIsSearchExpanded}
            onToggleLoginDialog={actions?.onToggleLoginDialog}
            cartCount={actions?.cartCount}
            onToggleCart={actions?.onToggleCart}
            onToggleWishlist={actions?.onToggleWishlist}
            onToggleMobileMenu={onToggleMobileMenu}
            isMobileMenuOpen={isMobileMenuOpen}
            viewportSize={viewportSize}
          />
          <CategoryBar config={config} menus={menus} />
        </Suspense>
      </header>


      {/* Mobile Side Menu */}
      <SideBar
        logoSrc="/logo.png"
        isNavOpen={isMobileMenuOpen}
        toggleNav={onToggleMobileMenu}
        pages={menus.mainSection.map(m => ({ name: m.title, link: m.link }))}
      />
    </>
  );
};

export default HeaderMain;
