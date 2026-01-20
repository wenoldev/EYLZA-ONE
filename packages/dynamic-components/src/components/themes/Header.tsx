import { useState, useEffect } from 'react';
import HeaderMain from '../theme-support/HeaderMain'
import type { HeaderConfig, HeaderMenus } from '../../types/Header'

const Header = ({ config, viewportSize }: { config: HeaderConfig, viewportSize?: string }) => {
  const [$menus, setMenus] = useState<HeaderMenus | null>(null);

  // @ts-ignore
  const $actions = typeof getHeaderActions === 'function' ? getHeaderActions() : {};

  useEffect(() => {
    // @ts-ignore
    if (typeof getHeaderMenus === 'function') {
      // @ts-ignore
      getHeaderMenus().then(setMenus);
    }
  }, []);

  if (!$menus) return null;

  return (
    <HeaderMain config={config} menus={$menus} actions={$actions} viewportSize={viewportSize} />
  )
}

export default Header