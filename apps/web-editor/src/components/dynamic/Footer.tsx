import { useState, useEffect } from 'react';
import type { FooterConfig, FooterMenus, FooterCompanyInfo } from './types/Footer';
import {FooterMain} from './components/FooterMain';
import { getFooterCompanyInfo, getFooterMenus } from '@/utils/getFooterApiData';

const Footer = ({ config, viewportSize }: { config: FooterConfig, viewportSize?:  'mobile' | 'tablet' }) => {
  const [$footerMenus, setFooterMenus] = useState<FooterMenus | null>(null);
  const [$footerCompanyInfo, setFooterCompanyInfo] = useState<FooterCompanyInfo | null>(null);

  useEffect(() => {
    getFooterMenus().then(setFooterMenus);
    getFooterCompanyInfo().then(setFooterCompanyInfo);
  }, []);

  if (!$footerMenus || !$footerCompanyInfo) return null;

  return <FooterMain config={config} menus={$footerMenus} contactInfo={$footerCompanyInfo} viewportSize={viewportSize} />;
};

export default Footer;
