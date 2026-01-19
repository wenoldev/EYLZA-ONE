import { useState, useEffect } from 'react';
import HeaderMain from './components/HeaderMain'
import type { HeaderConfig, HeaderMenus } from './types/Header'
import { getHeaderActions, getHeaderMenus } from '@/utils/getHeaderApiData';

const Header = ({ config, viewportSize }: { config: HeaderConfig, viewportSize?: string }) => {
  const [$menus, setMenus] = useState<HeaderMenus | null>(null);
  const $actions = getHeaderActions();

  useEffect(() => {
    getHeaderMenus().then(setMenus);
  }, []);

  if (!$menus) return null;

  return (
    <HeaderMain config={config} menus={$menus} actions={$actions} viewportSize={viewportSize} />
  )
}

export default Header