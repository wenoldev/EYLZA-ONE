import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface CollectionItem {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

interface AurelianFeaturedProps {
  title?: string;
  description?: string;
  viewAllText?: string;
  viewAllLink?: string;
  collections?: CollectionItem[];
}

const AurelianFeatured: React.FC<AurelianFeaturedProps> = ({
  title = "Curated Collections",
  description = "Selected pieces from our latest archives, highlighting the intersection of raw geological beauty and refined gold smithery.",
  viewAllText = "View All Collections",
  viewAllLink = "/products",
  collections = [
    {
      id: "c1",
      title: "The Terra Series",
      description: "Organic textures meet precise engineering.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBEnRgfUC0e40YAP4HGxtif9A7ftSC5Q0zZMuBIeVMRhG6Vx6JWbDLLuttMUTwdhYpVueDFcU1ICy2ousEL7_VsXgbrF8RQRnHUGgsGI836LOy9rInvOOEsOodaoOKpRT1dMoJgO-ZnkUay3IckoPCVkBoGsVt-DDzOmub1IRklaoP_QgS3Npe_lVpR57PXPWR7MJ_xhx8E6qfHS8N_KhBPe9DakPIWO0e36lkH9Pb-33PYcJtzpO6JK6rJZj7GpnFcxw7wnnJPJik",
      link: "/products?category=terra"
    },
    {
      id: "c2",
      title: "Ethereal Drops",
      description: "Lightweight movement, profound impact.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDaWclJrWRSem0O7_w6PFYKVnHTzay7ZNd-RgEq4cmb9fw2XzanrB0yZzJXquZBCbuAeKdWnk3qnx5tzGs46us99esaB-zERADisNX_YO9gfxvtwwFjf0IEbCuFq56rrv7qVwBjglgBmHT_sF52i8D4xEpjhjDE6MqRiUeAclhQchKzlcP4zl0AgK9sRMDKPtv5BZvkmOWo0L1jtbvab5MTkBim_ntKwXT-LLFfso50usswsoc_3uEiY0UtSd20uaI_C0UbcMR6Fw8",
      link: "/products?category=earrings"
    },
    {
      id: "c3",
      title: "Chained Heritage",
      description: "Bold silhouettes for the modern icon.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhEYHm8YIyt3c3DSLg5aET0MHi_gDWCY7Gk2iFycfqGXqRo-TsAjtEDef0v5cuzjJXMLpWiEqvD5iFTUaCdS8IMJGqUqzdZzPkUnsYvvDOsOh87LkX4Ur1eIQ0eBJn6qwlhG0ddiT5vhoC0-fi6EHGcOIyEoYWEntd1y_sx0JK6opVxFAEXZeQ23zxyPvdzrfj9_Rp0grvYtQxSlpq5CS_xytp4pCVlzFwco82dpk_bxhbFTX_TqDZN5rfNKBAVMN9IsXO8ZQ2qzI",
      link: "/products?category=bracelets"
    }
  ]
}) => {
  const navigate = useNavigate();
  const { storeSlug } = useParams();

  const handleNavClick = (href: string) => {
    const prefix = storeSlug ? `/${storeSlug}` : "";
    navigate(`${prefix}${href}`);
  };

  return (
    <section className="py-32 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-serif mb-6">{title}</h2>
            <p className="text-stone-500 leading-relaxed font-sans">{description}</p>
          </div>
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); handleNavClick(viewAllLink); }}
            className="mt-8 md:mt-0 font-sans uppercase tracking-widest text-[10px] border-b border-primary text-primary pb-1 hover:opacity-70 transition-all font-bold"
          >
            {viewAllText}
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          {/* Large Feature Card */}
          {collections[0] && (
            <div className="md:col-span-7 group cursor-pointer" onClick={() => handleNavClick(collections[0].link)}>
              <div className="aspect-[4/5] overflow-hidden mb-6 bg-stone-50 border border-stone-100">
                <img 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                  src={collections[0].image}
                  alt={collections[0].title}
                />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-serif italic">{collections[0].title}</h3>
                  <p className="text-stone-500 text-sm mt-2">{collections[0].description}</p>
                </div>
                <div className="w-10 h-10 rounded-full border border-stone-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          )}

          {/* Offset Column */}
          <div className="md:col-span-5 flex flex-col gap-16 md:mt-24">
            {collections.slice(1, 3).map((col) => (
              <div key={col.id} className="group cursor-pointer" onClick={() => handleNavClick(col.link)}>
                <div className="aspect-square md:aspect-[4/3] overflow-hidden mb-6 bg-stone-50 border border-stone-100">
                  <img 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                    src={col.image}
                    alt={col.title}
                  />
                </div>
                <h3 className="text-xl font-serif italic">{col.title}</h3>
                <p className="text-stone-500 text-sm mt-2">{col.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AurelianFeatured;
