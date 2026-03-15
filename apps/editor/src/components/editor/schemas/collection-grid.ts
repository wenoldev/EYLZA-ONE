import type { EditorSchema } from "@/types/editor"

export const collectionGridSchema: EditorSchema = {
  label: "Collection Grid",
  icon: "layout-grid",
  group: "Content",
  tabs: [
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
          property: "items",
          label: "Collections",
          control: "repeater",
          itemLabel: "title",
          fields: [
            { property: "title", label: "Title", control: "input" },
            { property: "subtitle", label: "Subtitle", control: "input" },
            { property: "imageUrl", label: "Image URL", control: "image" },
            { property: "link", label: "Link", control: "input" },
            { 
              property: "span", 
              label: "Grid Span", 
              control: "select",
              options: [
                { label: "Normal", value: "normal" },
                { label: "Tall", value: "tall" },
                { label: "Wide", value: "wide" },
                { label: "Large (2x2)", value: "large" }
              ]
            }
          ],
          defaultValue: [
            { title: "Bridal Wear", subtitle: "Latest Designs", imageUrl: "/placeholder-c1.jpg", link: "/category/bridal", span: "large" },
            { title: "Handwork", subtitle: "Premium Quality", imageUrl: "/placeholder-c2.jpg", link: "/category/handwork", span: "tall" },
            { title: "Daily Wear", subtitle: "Summer collection", imageUrl: "/placeholder-c3.jpg", link: "/category/daily", span: "normal" }
          ]
        }
      ]
    },
    {
      label: "Styling",
      controls: [
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
