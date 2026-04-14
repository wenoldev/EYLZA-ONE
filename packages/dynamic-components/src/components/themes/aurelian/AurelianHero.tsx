import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface AurelianHeroProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  badge?: string;
}

const AurelianHero: React.FC<AurelianHeroProps> = ({
  title = "The Art of Permanent Radiance",
  subtitle = "Forged in Silence, Worn with Intention.",
  backgroundImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuDbndfZmT_g_P3YJAKoQ4Dh2xYC8l6nc5RQ3t8cdXsd2ng34xD8y8Ftm1sa5gTNNibm_DAJXoq1dEt2pWnfFd2jJSoXzIp7-azRQadwIPo1z6u7bbudoCsQkqB6Wcp5EqsTKvdGd24g6gbkUus1uN2XiVDdN9ghXg9Q-TBkzp5zowhYskpPt5Nej0o1RYo-T9LqaDGqmKfgpOOi3hACXuXRd_lkJwRHKUFTZ4K-i9rzhUunEAUg17ZJrlSMmAhoOvQY109ji8AVxkE",
  primaryButtonText = "Explore Collection",
  primaryButtonLink = "/products",
  secondaryButtonText = "Our Heritage",
  secondaryButtonLink = "/about",
  badge = "Est. 1924 • Atelier Aurum"
}) => {
  const navigate = useNavigate();
  const { storeSlug } = useParams();

  const handleNavClick = (href: string) => {
    const prefix = storeSlug ? `/${storeSlug}` : "";
    navigate(`${prefix}${href}`);
  };

  // Convert "The Art of <br/> Permanent Radiance" style titles to JSX
  const renderTitle = (text: string) => {
    return text.split('<br/>').map((part, index) => (
      <React.Fragment key={index}>
        {index > 0 && <br />}
        {part}
      </React.Fragment>
    ));
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 z-0">
        <img 
          className="w-full h-full object-cover" 
          src={backgroundImage}
          alt={title}
        />
        <div className="absolute inset-0 bg-stone-900/10"></div>
      </div>
      <div className="relative z-10 text-center px-6">
        <span className="font-sans uppercase tracking-[0.4em] text-[10px] md:text-xs text-on-surface-variant mb-6 block drop-shadow-sm">
          {badge}
        </span>
        <h1 className="text-5xl md:text-8xl font-serif italic font-light tracking-tight text-on-surface mb-8 max-w-4xl mx-auto leading-[0.9] drop-shadow-sm">
          {renderTitle(title)}
        </h1>
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center mt-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <button 
            onClick={() => handleNavClick(primaryButtonLink)}
            className="bg-primary text-on-primary px-12 py-5 uppercase tracking-[0.3em] text-[11px] font-sans hover:bg-stone-800 transition-all duration-300 shadow-2xl shadow-stone-900/20 whitespace-nowrap flex items-center justify-center min-w-[240px]"
          >
            {primaryButtonText}
          </button>
          <button 
            onClick={() => handleNavClick(secondaryButtonLink)}
            className="bg-transparent border border-white/40 text-stone-900 px-12 py-5 uppercase tracking-[0.3em] text-[11px] font-sans hover:bg-white/10 transition-all duration-300 backdrop-blur-md whitespace-nowrap flex items-center justify-center min-w-[240px]"
          >
            {secondaryButtonText}
          </button>
        </div>
      </div>
    </section>
  );
};

export default AurelianHero;
