export interface ComponentVariant {
  id: string
  name: string
  thumbnail?: string
  selector: string
  defaultProps: Record<string, any>
}

export interface ComponentGalleryItem {
  selector: string
  label: string
  variants: ComponentVariant[]
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
    variants: [
      { id: "login-standard", name: "Modern Login", selector: "login", thumbnail: "/login.png", defaultProps: {} }
    ]
  },
  {
    selector: "cart",
    label: "Shopping Cart",
    variants: [
      { id: "cart-standard", name: "Standard Cart", selector: "cart", thumbnail: "/cart.png", defaultProps: {} }
    ]
  },
  {
    selector: "checkout",
    label: "Checkout",
    variants: [
      { id: "checkout-standard", name: "Standard Checkout", selector: "checkout", thumbnail: "/checkout.png", defaultProps: {} }
    ]
  },
  {
    selector: "orders",
    label: "Orders",
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
      }
    ]
  }
]
