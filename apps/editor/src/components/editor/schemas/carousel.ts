import type { EditorSchema } from "@/types/editor"

export const carouselSchema: EditorSchema = {
  label: "Carousel",
  icon: "gallery-horizontal",
  group: "Content",
  tabs: [
    {
      label: "Content",
      controls: [
        {
          property: "title",
          label: "Carousel Title",
          control: "input",
          type: "text",
          placeholder: "Featured Items",
          defaultValue: "Featured Items",
        },
      ]
    },
    {
      label: "Settings",
      controls: [
        {
          property: "showArrows",
          label: "Show Arrows",
          control: "switch",
          defaultValue: true,
        },
      ]
    }
  ]
}
