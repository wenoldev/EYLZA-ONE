import type { EditorSchema } from "@/types/editor"

export const bannerSchema: EditorSchema = {
  label: "Banner",
  icon: "image",
  group: "Content",
  tabs: [
    {
      label: "Content",
      controls: [
        {
          property: "title",
          label: "Title",
          control: "input",
          type: "text",
          placeholder: "Enter banner title",
          defaultValue: "Welcome to Our Store",
        },
        {
          property: "subtitle",
          label: "Subtitle",
          control: "input",
          type: "text",
          placeholder: "Enter banner subtitle",
          defaultValue: "Discover amazing products",
        },
        {
          property: "backgroundImage",
          label: "Background Image",
          control: "image",
          defaultValue: "/celebratory-banner.png",
        },
        {
          property: "ctaText",
          label: "CTA Button Text",
          control: "input",
          type: "text",
          placeholder: "Shop Now",
          defaultValue: "Shop Now",
        },
        {
          property: "ctaLink",
          label: "CTA Link",
          control: "input",
          type: "text",
          placeholder: "/products",
          defaultValue: "/products",
        },
      ]
    },
    {
      label: "Styles",
      controls: [
        {
          property: "variant",
          label: "Variant",
          control: "select",
          options: [
            { label: "Text Only", value: "text" },
            { label: "Image Left", value: "imageLeft" },
            { label: "Image Right", value: "imageRight" },
            { label: "Full Width", value: "fullWidth" },
          ],
          defaultValue: "fullWidth",
        },
        {
          property: "backgroundColor",
          label: "Background Color",
          control: "color",
          defaultValue: "#1e293b",
        },
        {
          property: "textColor",
          label: "Text Color",
          control: "color",
          defaultValue: "#ffffff",
        },
        {
          property: "height",
          label: "Height (px)",
          control: "input",
          type: "number",
          defaultValue: 400,
        },
      ]
    }
  ]
}
