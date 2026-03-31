import type { EditorSchema } from "@/types/editor"

export const collectionGridSchema: EditorSchema = {
  label: "Collection Grid",
  icon: "layout-grid",
  group: "Content",
  tabs: [
    {
      label: "Layout & Design",
      controls: [
        {
          property: "layout",
          label: "Layout Mode",
          control: "select",
          options: [
            { label: "Normal Grid", value: "grid" },
            { label: "Horizontal Slider", value: "slider" }
          ],
          defaultValue: "grid",
        },
        {
          property: "template",
          label: "Select Design",
          control: "select",
          options: [
            { label: "Classic Cards", value: "categoryCard1" },
            { label: "Overlay Cards", value: "categoryCard2" },
            { label: "Minimalist", value: "category" }
          ],
          defaultValue: "categoryCard1",
        },
        {
          property: "arrowPosition",
          label: "Slider Arrows",
          control: "select",
          options: [
            { label: "On Sides", value: "sides" },
            { label: "Top Corner", value: "top" },
            { label: "Bottom Center", value: "bottom" },
            { label: "Hidden", value: "hidden" }
          ],
          defaultValue: "sides",
          visible: (props: any) => props.layout === "slider"
        }
      ]
    },
    {
      label: "Content",
      controls: [
        {
          property: "title",
          label: "Section Title",
          control: "input",
          type: "text",
          defaultValue: "Our Collections",
        },
        {
          property: "subtitle",
          label: "Subtitle",
          control: "input",
          type: "text",
          defaultValue: "Explore our premium categories",
        },
        {
          property: "items",
          label: "Collections",
          control: "repeater",
          itemLabel: "title",
          fields: [
            { property: "title", label: "Title", control: "input" },
            { property: "subtitle", label: "Subtitle", control: "input" },
            { property: "imageUrl", label: "Image URL", control: "image" },
            { property: "link", label: "Link", control: "input" }
          ],
          defaultValue: [
            { title: "Bridal Wear", subtitle: "Latest Designs", imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop", link: "/category/bridal" },
            { title: "Handwork", subtitle: "Premium Quality", imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop", link: "/category/handwork" },
            { title: "Daily Wear", subtitle: "Summer collection", imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=2070&auto=format&fit=crop", link: "/category/daily" }
          ]
        }
      ]
    },
    {
      label: "Styling",
      controls: [
        {
          property: "itemsPerRow.desktop",
          label: "Items Per Row (Desktop)",
          control: "slider",
          min: 1,
          max: 6,
          defaultValue: 4,
        },
        {
          property: "styles.gap",
          label: "Grid Gap",
          control: "slider",
          min: 0,
          max: 100,
          defaultValue: 24,
        },
        {
          property: "styles.backgroundColor",
          label: "Background Color",
          control: "color",
          defaultValue: "#ffffff",
        },
        {
          property: "styles.padding",
          label: "Padding",
          control: "input",
          defaultValue: "6rem 0",
        }
      ]
    }
  ]
}
