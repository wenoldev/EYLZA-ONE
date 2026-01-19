export interface ComponentVariant {
  id: string
  name: string
  thumbnail?: string
  type: string
  defaultProps: Record<string, any>
}

export interface ComponentGalleryItem {
  type: string
  label: string
  variants: ComponentVariant[]
}

export const componentGallery: ComponentGalleryItem[] = [
  {
    type: "banner",
    label: "Banner",
    variants: [
      {
        id: "banner-hero-center",
        name: "Hero Centered",
        type: "banner",
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
        type: "banner",
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
        type: "banner",
        thumbnail: "/full-width-banner.jpg",
        defaultProps: {
          variant: "fullWidth",
          title: "Welcome",
        },
      },
    ],
  },
  {
    type: "slider",
    label: "Image Slider",
    variants: [
      {
        id: "slider-auto",
        name: "Auto Play",
        type: "slider",
        thumbnail: "/image-slider-carousel.jpg",
        defaultProps: {
          autoplay: true,
          autoplaySpeed: 3000,
        },
      },
      {
        id: "slider-manual",
        name: "Manual Control",
        type: "slider",
        thumbnail: "/image-gallery.png",
        defaultProps: {
          autoplay: false,
          showArrows: true,
          showDots: true,
        },
      },
    ],
  },
  {
    type: "carousel",
    label: "Carousel",
    variants: [
      {
        id: "carousel-products",
        name: "Product Carousel",
        type: "carousel",
        thumbnail: "/product-carousel.png",
        defaultProps: {
          type: "products",
          itemsPerView: 4,
        },
      },
      {
        id: "carousel-testimonials",
        name: "Testimonials",
        type: "carousel",
        thumbnail: "/testimonial-carousel.png",
        defaultProps: {
          type: "testimonials",
          itemsPerView: 3,
        },
      },
    ],
  },
  {
    type: "grid",
    label: "Product Grid",
    variants: [
      {
        id: "grid-3col",
        name: "3 Columns",
        type: "grid",
        thumbnail: "/product-grid-3-columns.jpg",
        defaultProps: {
          columns: 3,
          gap: 16,
        },
      },
      {
        id: "grid-4col",
        name: "4 Columns",
        type: "grid",
        thumbnail: "/product-grid-4-columns.jpg",
        defaultProps: {
          columns: 4,
          gap: 16,
        },
      },
    ],
  },
  {
    type: "productList",
    label: "Product List",
    variants: [
      {
        id: "product-list-standard",
        name: "Standard List",
        type: "productList",
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
    type: "productDetail",
    label: "Product Detail",
    variants: [
      {
        id: "product-detail-split",
        name: "Standard Split",
        type: "productDetail",
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
    type: "text",
    label: "Text Content",
    variants: [
      {
        id: "text-simple",
        name: "Simple Text",
        type: "text",
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
