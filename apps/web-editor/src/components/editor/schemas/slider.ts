import type { EditorSchema } from "@/types/editor"

export const sliderSchema: EditorSchema = {
  label: "Image Slider",
  icon: "images",
  group: "Content",
  tabs: [
    {
      label: "Content",
      controls: [
        {
          property: "title",
          label: "Slider Title",
          control: "input",
          type: "text",
          placeholder: "Featured Products",
          defaultValue: "Featured Products",
        },
      ]
    },
    {
      label: "Settings",
      controls: [
        {
          property: "autoplay",
          label: "Autoplay",
          control: "switch",
          defaultValue: true,
        },
        {
          property: "autoplaySpeed",
          label: "Autoplay Speed (ms)",
          control: "input",
          type: "number",
          defaultValue: 3000,
        },
        {
          property: "showArrows",
          label: "Show Navigation Arrows",
          control: "switch",
          defaultValue: true,
        },
        {
          property: "showDots",
          label: "Show Dots",
          control: "switch",
          defaultValue: true,
        },
      ]
    }
  ]
}
