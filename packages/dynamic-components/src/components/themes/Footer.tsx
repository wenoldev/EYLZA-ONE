import { useState, useEffect } from 'react';
import type { FooterConfig, FooterMenus, FooterCompanyInfo } from '../../types/Footer';
import { FooterMain } from '../theme-support/FooterMain';

const MOCK_MENUS: FooterMenus = {
  quickLinks: [
    { label: 'Search', href: '/search' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
  supportLinks: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQs', href: '/faqs' },
    { label: 'Shipping', href: '/shipping' },
  ],
  policyLinks: [
    { label: 'Refund Policy', href: '/refund' },
    { label: 'Terms & Conditions', href: '/terms-conditions' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
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

  return <FooterMain config={config} menus={$footerMenus} contactInfo={$footerCompanyInfo} viewportSize={viewportSize} />;
};

export default Footer;
