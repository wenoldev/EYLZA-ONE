import type { EditorSchema } from "@/types/editor"

export const gridSchema: EditorSchema = {
  label: "Product Grid",
  icon: "grid",
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
          placeholder: "Our Products",
          defaultValue: "Our Products",
        },
        {
          property: "subtitle",
          label: "Subtitle",
          control: "textarea",
          rows: 2,
        }
      ]
    },
    {
      label: "Layout",
      controls: [
        {
          property: "layout.desktop",
          label: "Desktop Columns",
          control: "select",
          options: [
            { label: "2", value: 2 },
            { label: "3", value: 3 },
            { label: "4", value: 4 },
          ],
          defaultValue: 4,
        },
        {
          property: "layout.tablet",
          label: "Tablet Columns",
          control: "select",
          options: [
            { label: "1", value: 1 },
            { label: "2", value: 2 },
          ],
          defaultValue: 2,
        },
        {
          property: "styles.gap",
          label: "Gap",
          control: "input",
          type: "text",
          defaultValue: "2rem",
        },
      ]
    },
    {
      label: "Styles",
      controls: [
        {
          property: "styles.backgroundColor",
          label: "Background Color",
          control: "color",
        },
        {
          property: "styles.titleColor",
          label: "Title Color",
          control: "color",
          defaultValue: "#111827",
        }
      ]
    }
  ]
}
