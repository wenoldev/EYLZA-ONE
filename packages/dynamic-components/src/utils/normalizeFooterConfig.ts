import type { FooterConfig, FooterCompanyInfo } from '../types/Footer';

type LegacyFooterConfig = Partial<FooterConfig> & {
  hideFooter?: boolean;
  socialLinks?: Array<{ platform?: string; url?: string }>;
  sections?: FooterConfig['sections'] | Array<{ title?: string; links?: Array<{ label?: string; href?: string }> }>;
};

const DEFAULT_FOOTER_CONFIG: FooterConfig = {
  general: {
    design: 'design1',
    hideFooter: false,
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    accentColor: '#3b82f6',
    borderColor: '#e5e7eb',
    fontFamily: 'Inter',
    paddingTop: '7rem',
    paddingBottom: '3rem',
  },
  sections: {
    menuOrder: [
      { id: 'brand', visible: true },
      { id: 'quickLinks', visible: true },
      { id: 'supportLinks', visible: true },
      { id: 'policyLinks', visible: true },
      { id: 'social', visible: true },
      { id: 'contactInfo', visible: true },
    ],
    showPaymentMethods: false,
    paymentMethodsStyle: 'badges',
    showDividers: true,
    linksUnderline: false,
    socialIconStyle: 'circle',
  },
  mobile: {
    textAlignment: 'center',
    stackOrder: 'brand-first',
    layout: 'accordion',
    collapseSections: false,
    hideSocialOnMobile: false,
    hidePaymentOnMobile: false,
  },
  content: {
    copyrightText: '',
    showTagline: false,
    copyrightPosition: 'center',
  },
};

const DEFAULT_GENERAL = DEFAULT_FOOTER_CONFIG.general;
const DEFAULT_SECTIONS = DEFAULT_FOOTER_CONFIG.sections!;
const DEFAULT_MOBILE = DEFAULT_FOOTER_CONFIG.mobile!;
const DEFAULT_CONTENT = DEFAULT_FOOTER_CONFIG.content!;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isSectionsConfig = (value: unknown): value is FooterConfig['sections'] =>
  isRecord(value);

export const normalizeFooterConfig = (config?: LegacyFooterConfig | null): FooterConfig => {
  const legacyConfig = config ?? {};
  const general = (isRecord(legacyConfig.general) ? legacyConfig.general : {}) as Partial<FooterConfig['general']>;
  const sections = (isSectionsConfig(legacyConfig.sections) ? legacyConfig.sections : {}) as Partial<FooterConfig['sections']>;
  const mobile = (isRecord(legacyConfig.mobile) ? legacyConfig.mobile : {}) as Partial<NonNullable<FooterConfig['mobile']>>;
  const content = (isRecord(legacyConfig.content) ? legacyConfig.content : {}) as Partial<NonNullable<FooterConfig['content']>>;

  return {
    general: {
      ...DEFAULT_GENERAL,
      ...general,
      hideFooter:
        typeof general.hideFooter === 'boolean'
          ? general.hideFooter
          : typeof legacyConfig.hideFooter === 'boolean'
            ? legacyConfig.hideFooter
            : DEFAULT_GENERAL.hideFooter,
    },
    sections: {
      ...DEFAULT_SECTIONS,
      ...sections,
      menuOrder: Array.isArray(sections.menuOrder) && sections.menuOrder.length > 0
        ? sections.menuOrder
        : DEFAULT_SECTIONS.menuOrder,
    },
    mobile: {
      ...DEFAULT_MOBILE,
      ...mobile,
      layout:
        mobile.layout === 'row' || mobile.layout === 'grid-2' || mobile.layout === 'accordion'
          ? mobile.layout
          : DEFAULT_MOBILE.layout,
    },
    content: {
      ...DEFAULT_CONTENT,
      ...content,
    },
  };
};

export const mergeFooterSocialLinks = (
  contactInfo: FooterCompanyInfo,
  config?: LegacyFooterConfig | null
): FooterCompanyInfo => {
  const socialEntries = Array.isArray(config?.socialLinks) ? config.socialLinks : [];
  const legacySocialLinks = socialEntries.reduce<FooterCompanyInfo['socialLinks']>((acc, item) => {
    const platform = item?.platform?.toLowerCase();
    const url = item?.url;

    if (!platform || !url) return acc;
    if (platform === 'facebook' || platform === 'twitter' || platform === 'instagram' || platform === 'linkedin' || platform === 'youtube') {
      acc[platform] = url;
    }

    return acc;
  }, {});

  return {
    ...contactInfo,
    socialLinks: {
      ...contactInfo.socialLinks,
      ...legacySocialLinks,
    },
  };
};
