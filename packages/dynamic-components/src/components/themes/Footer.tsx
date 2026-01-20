import { useState, useEffect } from 'react';
import type { FooterConfig, FooterMenus, FooterCompanyInfo } from '../../types/Footer';
import { FooterMain } from '../theme-support/FooterMain';

const Footer = ({ config, viewportSize }: { config: FooterConfig, viewportSize?: 'mobile' | 'tablet' }) => {
  const [$footerMenus, setFooterMenus] = useState<FooterMenus | null>(null);
  const [$footerCompanyInfo, setFooterCompanyInfo] = useState<FooterCompanyInfo | null>(null);

  useEffect(() => {
    // @ts-ignore
    if (typeof getFooterMenus === 'function') {
      // @ts-ignore
      getFooterMenus().then(setFooterMenus);
    }
    // @ts-ignore
    if (typeof getFooterCompanyInfo === 'function') {
      // @ts-ignore
      getFooterCompanyInfo().then(setFooterCompanyInfo);
    }
  }, []);

  if (!$footerMenus || !$footerCompanyInfo) return null;

  return <FooterMain config={config} menus={$footerMenus} contactInfo={$footerCompanyInfo} viewportSize={viewportSize} />;
};

export default Footer;
