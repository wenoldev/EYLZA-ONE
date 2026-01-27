import type { EditorSchema } from "@/types/editor"

export const textSchema: EditorSchema = {
  label: "Text Block",
  icon: "type",
  group: "Content",
  tabs: [
    {
      label: "Content",
      controls: [
        {
          property: "data.title",
          label: "Title (Optional)",
          control: "input",
          type: "text",
          placeholder: "Section Title",
        },
        {
          property: "data.content",
          label: "Content",
          control: "textarea",
          placeholder: "Enter your text content",
          defaultValue: "This is a text block",
        },
      ]
    },
    {
      label: "Settings",
      controls: [
        {
          property: "settings.alignment",
          label: "Alignment",
          control: "select",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
          defaultValue: "left",
        },
        {
          property: "settings.maxWidth",
          label: "Max Width",
          control: "select",
          options: [
            { label: "Small", value: "sm" },
            { label: "Medium", value: "md" },
            { label: "Large", value: "lg" },
            { label: "Extra Large", value: "xl" },
            { label: "Full Width", value: "full" },
          ],
          defaultValue: "lg",
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
          property: "styles.textColor",
          label: "Text Color",
          control: "color",
          defaultValue: "#000000",
        },
        {
          property: "styles.fontSize",
          label: "Font Size (px)",
          control: "input",
          type: "number",
          defaultValue: 16,
        },
        {
          property: "styles.fontWeight",
          label: "Font Weight",
          control: "select",
          options: [
            { label: "Normal", value: "normal" },
            { label: "Bold", value: "bold" },
          ],
          defaultValue: "normal",
        },
      ]
    }
  ]
}
