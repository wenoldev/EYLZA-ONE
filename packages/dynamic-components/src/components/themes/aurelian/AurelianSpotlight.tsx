import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface AurelianSpotlightProps {
  title?: string;
  badge?: string;
  description?: string;
  image?: string;
  buttonText?: string;
  buttonLink?: string;
}

const AurelianSpotlight: React.FC<AurelianSpotlightProps> = ({
  title = "The Solstice Pendant",
  badge = "Limited Edition • 12 Pieces",
  description = "Inspired by the winter sun, this 18k yellow gold pendant features a 2.4-carat pear-cut diamond suspended within a hand-hammered halo.",
  image = "https://lh3.googleusercontent.com/aida-public/AB6AXuAUVGhvB6B80fv46vU2fY0osFuRDBe-Ky4_7ggJAYMP4vAxA-VOzv9KduS3fx8WLqATksrkFzTrTilmj48kZGlgtF2kQb2CrGvrrLmyaZyQ-pKnjaOPznbE39RNVotcMXh_Omj4zxZyLQITMfJ_-FsobJ404QIMEyQgr8reursbRPXiEVvYrpehwzwA1Gw3HuQtQnB63UyeG6bWrLV71kiYHA-L-ozVYA0vwRpF3le4JWSdqJrcRLesnlS3StFh8ZZJFf3slXJmY8A",
  buttonText = "Enquire for Price",
  buttonLink = "/contact?subject=Solstice%20Pendant"
}) => {
  const navigate = useNavigate();
  const { storeSlug } = useParams();

  const handleNavClick = (href: string) => {
    const prefix = storeSlug ? `/${storeSlug}` : "";
    navigate(`${prefix}${href}`);
  };

  return (
    <section className="py-32 px-6 md:px-12 relative">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-white"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-stone-50"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="bg-white/40 backdrop-blur-3xl border border-white/20 p-8 md:p-24 shadow-2xl shadow-stone-900/10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center rounded-[3rem] animate-in fade-in zoom-in duration-700">
          <div className="relative group overflow-hidden rounded-2xl">
            <img 
              className="w-full h-auto object-cover shadow-2xl transition-transform duration-1000 group-hover:scale-110" 
              src={image}
              alt={title}
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif italic mb-2 tracking-tight">{title}</h2>
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-sans font-bold mb-8">
              {badge}
            </p>
            <p className="text-stone-500 mb-10 leading-relaxed font-sans text-sm md:text-base">
              {description}
            </p>
            <button 
              onClick={() => handleNavClick(buttonLink)}
              className="bg-primary text-on-primary px-12 py-4 uppercase tracking-widest text-xs font-sans font-bold hover:bg-stone-800 transition-all shadow-xl shadow-primary/20"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AurelianSpotlight;
