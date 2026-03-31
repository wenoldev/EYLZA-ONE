export interface ComponentVariant {
  id: string
  name: string
  thumbnail?: string
  selector: string
  defaultProps: Record<string, any>
  hidden?: boolean
}

export interface ComponentGalleryItem {
  selector: string
  label: string
  variants: ComponentVariant[]
  hidden?: boolean
}

export const componentGallery: ComponentGalleryItem[] = [
  {
    selector: "banner",
    label: "Banner",
    variants: [
      {
        id: "banner-hero-center",
        name: "Hero Centered",
        selector: "banner",
        thumbnail: "/hero-banner-centered.jpg",
        defaultProps: {
          variant: "centered",
          title: "Welcome",
          subtitle: "Your subtitle here",
        },
      },
      {
        id: "banner-hero-split",
        name: "Hero Split",
        selector: "banner",
        thumbnail: "/hero-banner-split-image.jpg",
        defaultProps: {
          variant: "split",
          title: "Welcome",
          subtitle: "Your subtitle here",
        },
      },
      {
        id: "banner-fullwidth",
        name: "Full Width",
        selector: "banner",
        thumbnail: "/full-width-banner.jpg",
        defaultProps: {
          variant: "fullWidth",
          title: "Welcome",
        },
      },
      {
        id: "zaraishka-hero",
        name: "Zarishka Hero (Serif)",
        type: "banner",
        thumbnail: "https://images.unsplash.com/photo-1515562141207-7a18b5ce7142?q=80&w=2070&auto=format&fit=crop",
        defaultProps: {
          imageUrl: "https://images.unsplash.com/photo-1515562141207-7a18b5ce7142?q=80&w=2070&auto=format&fit=crop",
          title: "Wear Your Story.",
          subTitle: "HANDMADE JEWELRY FOR EVERY MOMENT",
          textAlignment: 'center',
          verticalAlignment: 'center',
          layout: 'background',
          buttons: [{ label: "SHOP NOW", link: "/collections/all", style: 'outline', showArrow: true }],
          styles: {
            backgroundColor: "#f4f4f0",
            titleFontSize: "4rem",
            titleColor: "#333333",
            height: "90vh"
          }
        }
      },
      {
        id: "aayura-sale",
        name: "Aayura Sale (Colorful)",
        type: "banner",
        thumbnail: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e12?q=80&w=2070&auto=format&fit=crop",
        defaultProps: {
          imageUrl: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e12?q=80&w=2070&auto=format&fit=crop",
          title: "<span style='font-size: 8rem; font-weight: 900; background: url(https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop); -webkit-background-clip: text; -webkit-text-fill-color: transparent;'>SALE</span>",
          subTitle: "UP TO 50% OFF",
          textAlignment: 'center',
          verticalAlignment: 'center',
          layout: 'background',
          buttons: [{ label: "SHOP THE SALE", link: "/collections/sale", style: 'primary' }],
          styles: { backgroundColor: "#000000", titleColor: "#ffffff", height: "80vh" }
        }
      },
      {
        id: "aayura-promo",
        name: "Aayura Promo (Vibrant)",
        type: "banner",
        thumbnail: "https://images.unsplash.com/photo-1617142108319-66c7ab468b5b?q=80&w=2070&auto=format&fit=crop",
        defaultProps: {
          imageUrl: "https://images.unsplash.com/photo-1617142108319-66c7ab468b5b?q=80&w=2070&auto=format&fit=crop",
          title: "Enjoy special offers on your first order",
          subTitle: "WELCOME OFFER",
          textAlignment: 'left',
          verticalAlignment: 'center',
          layout: 'split',
          imagePosition: 'right',
          buttons: [{ label: "GET IT NOW", link: "/register", style: 'secondary' }],
          styles: { backgroundColor: "#7c3aed", titleColor: "#ffffff", subTitleColor: "#e9d5ff", height: "60vh" }
        }
      }
    ],
  },
  {
    selector: "slider",
    label: "Image Slider",
    variants: [
      {
        id: "slider-auto",
        name: "Auto Play",
        selector: "slider",
        thumbnail: "/image-slider-carousel.jpg",
        defaultProps: {
          autoplay: true,
          autoplaySpeed: 3000,
        },
      },
      {
        id: "slider-manual",
        name: "Manual Control",
        selector: "slider",
        thumbnail: "/image-gallery.png",
        defaultProps: {
          autoplay: false,
          showArrows: true,
          showDots: true,
        },
      },
      {
        id: "slider-category-circles",
        name: "Category Circles (Premium)",
        selector: "slider",
        thumbnail: "/category-slider.png",
        defaultProps: {
          template: "category",
          title: "Explore Collections",
          subtitle: "Discover our curated picks",
          items: [
            { title: "Sarees", imageUrl: "/cat1.jpg", link: "/category/saree" },
            { title: "Blouses", imageUrl: "/cat2.jpg", link: "/category/blouse" },
            { title: "Accessories", imageUrl: "/cat3.jpg", link: "/category/acc" }
          ],
          itemsPerView: { desktop: 5, tablet: 4, mobile: 2 },
          styles: { padding: "5rem 0", gap: "2rem" }
        }
      },
      {
        id: "zaraishka-testimonials",
        name: "Zarishka Testimonials",
        type: "slider",
        thumbnail: "/zaraishka-testimonials.jpg",
        defaultProps: {
          title: "What Customer says about us.",
          template: 'minimal',
          items: [
            { title: "Tanika Sehgal", subtitle: "I absolutely love the earrings I bought! They are even more beautiful in person." },
            { title: "Radhika Maavi", subtitle: "The packaging was so beautiful and the jewelry is top notch." },
            { title: "Ankit Jain", subtitle: "Great quality and fast shipping. Highly recommend Zarishka." }
          ],
          itemsPerView: { desktop: 3, tablet: 2, mobile: 1 },
          styles: { backgroundColor: "#f9f9f7", padding: "5rem 0", gap: "2rem", cardStyles: { textAlign: 'center' } }
        }
      },
      {
        id: "aayura-categories",
        name: "Aayura Categories (Circle)",
        type: "slider",
        thumbnail: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1974&auto=format&fit=crop",
        defaultProps: {
          title: "Shop by Category",
          template: 'category',
          items: [
            { title: "Sarees", imageUrl: "/cat1.jpg", link: "/category/sarees" },
            { title: "Blouses", imageUrl: "/cat2.jpg", link: "/category/blouses" },
            { title: "Lehengas", imageUrl: "/cat3.jpg", link: "/category/lehengas" },
            { title: "Kurtas", imageUrl: "/cat4.jpg", link: "/category/kurtas" },
            { title: "Dupattas", imageUrl: "/cat5.jpg", link: "/category/dupattas" }
          ],
          itemsPerView: { desktop: 5, tablet: 4, mobile: 2 },
          styles: { backgroundColor: "#ffffff", padding: "4rem 0", gap: "2rem", cardStyles: { imageShape: 'circle', textAlign: 'center' } }
        }
      },
    ],
  },
  {
    selector: "collectionGrid",
    label: "Collection Grid",
    variants: [
      {
        id: "collection-grid-masonry",
        name: "Masonry Collections",
        selector: "collectionGrid",
        thumbnail: "/collection-grid.png",
        defaultProps: {
          title: "Our Signature Styles",
          items: [
            { title: "Bridal Couture", subtitle: "Traditional", imageUrl: "/c1.jpg", link: "/bridal", span: "large" },
            { title: "Handwork", subtitle: "Artisan Made", imageUrl: "/c2.jpg", link: "/handwork", span: "tall" },
            { title: "Summer Basics", subtitle: "Lightweight", imageUrl: "/c3.jpg", link: "/summer", span: "normal" }
          ]
        }
      }
    ]
  },
  {
    selector: "carousel",
    label: "Carousel",
    variants: [
      {
        id: "carousel-premium-fade",
        name: "Premium Fade Carousel",
        selector: "carousel",
        thumbnail: "/carousel-premium.png",
        defaultProps: {
          items: [
            {
              image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e12?auto=format&fit=crop&q=80",
              title: "ELEVATE YOUR STYLE",
              subtitle: "NEW ARRIVALS 2024",
              buttonText: "SHOP THE COLLECTION",
              buttonLink: "/products",
              textAlignment: "center",
              overlayOpacity: 40
            },
            {
              image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80",
              title: "MODERN ESSENTIALS",
              subtitle: "CURATED SELECTION",
              buttonText: "VIEW ALL",
              buttonLink: "/products",
              textAlignment: "left",
              overlayOpacity: 30
            }
          ],
          height: "650px",
          autoplay: true,
          interval: 5000,
          indicatorPosition: "right",
          showArrows: true
        }
      }
    ],
  },
  {
    selector: "grid",
    label: "Product Grid",
    variants: [
      {
        id: "grid-3col",
        name: "3 Columns",
        selector: "grid",
        thumbnail: "/product-grid-3-columns.jpg",
        defaultProps: {
          columns: 3,
          gap: 16,
        },
      },
      {
        id: "grid-4col",
        name: "4 Columns",
        selector: "grid",
        thumbnail: "/product-grid-4-columns.jpg",
        defaultProps: {
          columns: 4,
          gap: 16,
        },
      },
    ],
  },
  {
    selector: "productList",
    label: "Product List",
    hidden: true,
    variants: [
      {
        id: "product-list-standard",
        name: "Standard List",
        selector: "productList",
        thumbnail: "/product-list.png",
        defaultProps: {
          template: "product",
          layout: {
            desktop: 4,
            tablet: 2,
            mobile: 1
          }
        }
      }
    ]
  },
  {
    selector: "productDetail",
    label: "Product Detail",
    hidden: true,
    variants: [
      {
        id: "product-detail-split",
        name: "Standard Split",
        selector: "productDetail",
        thumbnail: "/product-detail.png",
        defaultProps: {
          layout: "split",
          gallery: {
            position: "left",
            showThumbnails: true,
            aspectRatio: "4/5",
            imageShape: "rounded"
          }
        }
      }
    ]
  },
  {
    selector: "contact",
    label: "Contact",
    variants: [
      { id: "contact-standard", name: "Standard Contact", selector: "contact", thumbnail: "/contact.png", defaultProps: {} }
    ]
  },
  {
    selector: "login",
    label: "Login",
    hidden: true,
    variants: [
      { id: "login-standard", name: "Modern Login", selector: "login", thumbnail: "/login.png", defaultProps: {} }
    ]
  },
  {
    selector: "cart",
    label: "Shopping Cart",
    hidden: true,
    variants: [
      { id: "cart-standard", name: "Standard Cart", selector: "cart", thumbnail: "/cart.png", defaultProps: {} }
    ]
  },
  {
    selector: "checkout",
    label: "Checkout",
    hidden: true,
    variants: [
      { id: "checkout-standard", name: "Standard Checkout", selector: "checkout", thumbnail: "/checkout.png", defaultProps: {} }
    ]
  },
  {
    selector: "orders",
    label: "Orders",
    hidden: true,
    variants: [
      { id: "orders-standard", name: "Standard Orders", selector: "orders", thumbnail: "/orders.png", defaultProps: {} }
    ]
  },
  {
    selector: "text",
    label: "Text Content",
    variants: [
      {
        id: "text-simple",
        name: "Simple Text",
        selector: "text",
        thumbnail: "/text-content.png",
        defaultProps: {
          data: {
            title: "Your Title",
            content: "<p>Your content goes here...</p>",
          },
          styles: {
            backgroundColor: "#ffffff",
          }
        }
      },
      {
        id: "zaraishka-about",
        name: "Zarishka About (Serif)",
        type: "text",
        thumbnail: "https://images.unsplash.com/photo-1573408301185-9146fe624df0?q=80&w=2070&auto=format&fit=crop",
        defaultProps: {
          title: "About Us",
          content: "<p>Zarishka is a handcrafted jewellery brand that focuses on creating unique pieces that tells a story. We believe that every piece of jewelry you wear should be a reflection of your personality and a testament to your style.</p><p>Our journey began with a simple passion for art and a desire to bring something different to the world of accessories. Today, we are proud to offer a diverse collection that blends traditional craftsmanship with modern design.</p>",
          alignment: 'center',
          styles: {
            backgroundColor: "#ffffff",
            titleColor: "#333333",
            textColor: "#666666",
            fontFamily: 'serif',
            maxWidth: '900px'
          }
        }
      }
    ]
  },
  {
    type: "mediaText",
    label: "Media & Text",
    variants: [
      {
        id: "zaraishka-gift",
        name: "Zarishka Gift Section",
        type: "mediaText",
        thumbnail: "https://images.unsplash.com/photo-1573408301185-9146fe624df0?q=80&w=2070&auto=format&fit=crop",
        defaultProps: {
          title: "A Perfect Gift",
          subTitle: "FOR HER",
          mediaType: 'image',
          mediaUrl: "https://images.unsplash.com/photo-1573408301185-9146fe624df0?q=80&w=2070&auto=format&fit=crop",
          mediaPosition: 'right',
          buttons: [{ label: "SHOP NOW", link: "/collections/gifts", style: 'outline' }],
          styles: { backgroundColor: "#ffffff", textColor: "#333333", buttonAlignment: 'left' }
        }
      }
    ]
  }
]
