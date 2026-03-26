import type { EditorSchema } from "@/types/editor"

export const footerSchema: EditorSchema = {
  label: "Footer",
  icon: "layout-bottom",
  group: "Layout",
  tabs: [
    {
      label: "Layout",
      controls: [
        {
          property: "general.design",
          label: "Design Style",
          control: "select",
          options: [
            { label: "Multi-Column Grid (Classic)", value: "design1" },
            { label: "Centered Minimal", value: "design2" },
            { label: "Horizontal Compact", value: "design3" },
          ],
          defaultValue: "design1",
        },
        {
          property: "general.hideFooter",
          label: "Hide Footer",
          control: "switch",
          defaultValue: false,
        },
        {
          property: "sections.menuOrder",
          label: "Section Layout",
          control: "repeater",
          options: [
            { label: "Brand & Logo", value: "brand" },
            { label: "Quick Links", value: "quickLinks" },
            { label: "Support Links", value: "supportLinks" },
            { label: "Policy Links", value: "policyLinks" },
            { label: "Social Media", value: "social" },
            { label: "Contact Information", value: "contactInfo" },
          ],
          defaultValue: [
            { id: "brand", visible: true },
            { id: "quickLinks", visible: true },
            { id: "supportLinks", visible: true },
            { id: "contactInfo", visible: true },
          ],
        },
      ]
    },
    {
      label: "Appearance",
      controls: [
        {
          property: "general.backgroundColor",
          label: "Background Color",
          control: "color",
          defaultValue: "#ffffff",
        },
        {
          property: "general.textColor",
          label: "Text Color",
          control: "color",
          defaultValue: "#1f2937",
        },
        {
          property: "general.accentColor",
          label: "Accent / Link Color",
          control: "color",
          defaultValue: "#3b82f6",
        },
        {
          property: "general.borderColor",
          label: "Border / Divider Color",
          control: "color",
          defaultValue: "#e5e7eb",
        },
        {
          property: "general.fontFamily",
          label: "Font Family",
          control: "select",
          options: [
            { label: "Inter", value: "Inter" },
            { label: "Roboto", value: "Roboto" },
            { label: "Playfair Display", value: "'Playfair Display', serif" },
            { label: "Montserrat", value: "Montserrat" },
            { label: "Lora", value: "Lora" },
            { label: "Oswald", value: "Oswald" },
            { label: "Poppins", value: "Poppins" },
            { label: "Open Sans", value: "'Open Sans'" },
            { label: "System Default", value: "system-ui" },
          ],
          defaultValue: "Inter",
        },
      ]
    },
    {
      label: "Spacing",
      controls: [
        {
          property: "general.paddingTop",
          label: "Top Padding",
          control: "select",
          options: [
            { label: "None", value: "0" },
            { label: "Small", value: "2rem" },
            { label: "Medium", value: "4rem" },
            { label: "Large", value: "7rem" },
            { label: "Extra Large", value: "10rem" },
          ],
          defaultValue: "7rem",
        },
        {
          property: "general.paddingBottom",
          label: "Bottom Padding",
          control: "select",
          options: [
            { label: "None", value: "0" },
            { label: "Small", value: "2rem" },
            { label: "Medium", value: "3rem" },
            { label: "Large", value: "4rem" },
            { label: "Extra Large", value: "6rem" },
          ],
          defaultValue: "3rem",
        },
      ]
    },
    {
      label: "Features",
      controls: [
        {
          property: "sections.linksUnderline",
          label: "Underline Links on Hover",
          control: "switch",
          defaultValue: false,
        },
        {
          property: "sections.socialIconStyle",
          label: "Social Icon Style",
          control: "select",
          options: [
            { label: "Circle", value: "circle" },
            { label: "Square", value: "square" },
            { label: "Rounded Square", value: "rounded" },
            { label: "Plain (No background)", value: "plain" },
          ],
          defaultValue: "circle",
        },
      ]
    },
    {
      label: "Mobile",
      controls: [
        {
          property: "mobile.layout",
          label: "Layout",
          control: "select",
          options: [
            { label: "Accordion", value: "accordion" },
            { label: "Row", value: "row" },
            { label: "Grid (2 Columns)", value: "grid-2" },
          ],
          defaultValue: "accordion",
        },
        {
          property: "mobile.textAlignment",
          label: "Text Alignment",
          control: "select",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
          ],
          defaultValue: "center",
        },
        {
          property: "mobile.collapseSections",
          label: "Collapsible Sections (Accordion)",
          control: "switch",
          defaultValue: false,
          visibleWhen: { property: "mobile.layout", value: "accordion" }
        },
      ]
    },
    {
      label: "Copyright",
      controls: [
        {
          property: "content.copyrightText",
          label: "Copyright Text",
          control: "input",
          type: "text",
          placeholder: "© 2025 Your Company. All rights reserved.",
          defaultValue: "© 2025 ZARISHKA. All rights reserved.",
        },
        {
          property: "content.copyrightPosition",
          label: "Copyright Position",
          control: "select",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
          defaultValue: "center",
          visibleWhen: { property: "general.design", value: "design1" }
        },
      ]
    },
  ]
}
