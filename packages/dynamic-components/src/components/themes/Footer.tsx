import { useState, useEffect } from 'react';
import type { FooterConfig, FooterMenus, FooterCompanyInfo } from '../../types/Footer';
import { FooterMain } from '../theme-support/FooterMain';
import { mergeFooterSocialLinks, normalizeFooterConfig } from '../../utils/normalizeFooterConfig';

const MOCK_MENUS: FooterMenus = {
  quickLinks: [
    { label: 'Products', href: '/products' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  supportLinks: [
    { label: 'Contact', href: '/contact' },
    { label: 'Shipping', href: '/shipping' },
  ],
  policyLinks: [
    { label: 'Privacy', href: '/policy/privacy-policy' },
    { label: 'Terms and Condition', href: '/policy/terms-conditions' },
    { label: 'Refund Policy', href: '/policy/refund-policy' },
  ],
};

const MOCK_COMPANY_INFO: FooterCompanyInfo = {
  companyInfo: {
    name: 'Your Store Name',
    logoUrl: '/logo.png',
    description: 'We provide the best quality products for our customers.',
    tagline: 'Your tagline goes here',
    address: '123 Store St, City, Country',
    phone: '+1 234 567 890',
    email: 'support@example.com',
  },
  socialLinks: {
    facebook: '#',
    twitter: '#',
    instagram: '#',
    linkedin: '#',
    youtube: '#',
  },
};

const Footer = ({ config, viewportSize }: { config: FooterConfig, viewportSize?: 'mobile' | 'tablet' }) => {
  const [$footerMenus, setFooterMenus] = useState<FooterMenus | null>(null);
  const [$footerCompanyInfo, setFooterCompanyInfo] = useState<FooterCompanyInfo | null>(null);
  const normalizedConfig = normalizeFooterConfig(config);

  useEffect(() => {
    // @ts-ignore
    if (typeof getFooterMenus === 'function') {
      // @ts-ignore
      getFooterMenus().then(setFooterMenus);
    } else {
      setFooterMenus(MOCK_MENUS);
    }
    // @ts-ignore
    if (typeof getFooterCompanyInfo === 'function') {
      // @ts-ignore
      getFooterCompanyInfo().then(setFooterCompanyInfo);
    } else {
      setFooterCompanyInfo(MOCK_COMPANY_INFO);
    }
  }, []);

  if (!$footerMenus || !$footerCompanyInfo) return null;

  return (
    <FooterMain
      config={normalizedConfig}
      menus={$footerMenus}
      contactInfo={mergeFooterSocialLinks($footerCompanyInfo, config)}
      viewportSize={viewportSize}
    />
  );
};

export default Footer;
