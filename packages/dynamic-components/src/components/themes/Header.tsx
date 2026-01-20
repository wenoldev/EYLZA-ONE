import { useState, useEffect } from 'react';
import HeaderMain from '../theme-support/HeaderMain'
import type { HeaderConfig, HeaderMenus } from '../../types/Header'

const MOCK_MENUS: HeaderMenus = {
  mainSection: [
    { title: 'Home', link: '/' },
    { title: 'Shop', link: '/shop' },
    { title: 'About', link: '/about' },
    { title: 'Contact', link: '/contact' },
  ],
  categoryBar: [
    { title: 'Electronics', link: '/category/electronics' },
    { title: 'Fashion', link: '/category/fashion' },
    { title: 'Home & Living', link: '/category/home-living' },
  ]
};

const Header = ({ config, viewportSize }: { config: HeaderConfig, viewportSize?: string }) => {
  const [$menus, setMenus] = useState<HeaderMenus | null>(null);

  // @ts-ignore
  const $actions = typeof getHeaderActions === 'function' ? getHeaderActions() : {};

  useEffect(() => {
    // @ts-ignore
    if (typeof getHeaderMenus === 'function') {
      // @ts-ignore
      getHeaderMenus().then(setMenus);
    } else {
      setMenus(MOCK_MENUS);
    }
  }, []);

  if (!$menus) return null;

  return (
    <HeaderMain config={config} menus={$menus} actions={$actions} viewportSize={viewportSize} />
  )
}

export default Header