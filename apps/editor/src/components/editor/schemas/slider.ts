import type { EditorSchema } from "@/types/editor"

export const sliderSchema: EditorSchema = {
  label: "Product / Category Slider",
  icon: "images",
  group: "Content",
  tabs: [
    {
      label: "Content",
      controls: [
        {
          property: "template",
          label: "Slider Template",
          control: "select",
          options: [
            { label: "Category Circles", value: "category" },
            { label: "Product Cards", value: "product" },
            { label: "Minimalist", value: "minimal" }
          ],
          defaultValue: "category",
        },
        {
          property: "title",
          label: "Slider Title",
          control: "input",
          type: "text",
          placeholder: "Featured Collections",
          defaultValue: "Featured Collections",
        },
        {
          property: "subtitle",
          label: "Subtitle",
          control: "textarea",
          defaultValue: "Explore our latest arrivals and trending categories.",
        },
        {
          property: "viewAllLabel",
          label: "Button Label",
          control: "input",
          defaultValue: "View All",
        },
        {
          property: "viewAllLink",
          label: "Button Link",
          control: "input",
          defaultValue: "/shop",
        }
      ]
    },
    {
      label: "Styling",
      controls: [
        {
          property: "styles.padding",
          label: "Section Padding",
          control: "input",
          defaultValue: "5rem 0",
        },
        {
          property: "styles.backgroundColor",
          label: "Background Color",
          control: "color",
          defaultValue: "#ffffff",
        },
        {
          property: "styles.titleColor",
          label: "Title Color",
          control: "color",
          defaultValue: "#111827",
        },
        {
          property: "itemsPerView.desktop",
          label: "Items (Desktop)",
          control: "select",
          options: [
            { label: "3 Items", value: 3 },
            { label: "4 Items", value: 4 },
            { label: "5 Items", value: 5 },
            { label: "6 Items", value: 6 }
          ],
          defaultValue: 4,
        }
      ]
    }
  ]
}
