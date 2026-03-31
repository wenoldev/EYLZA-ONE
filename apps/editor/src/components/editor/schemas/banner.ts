import type { EditorSchema } from "@/types/editor"

export const bannerSchema: EditorSchema = {
  label: "Banner",
  icon: "image",
  group: "Content",
  tabs: [
    {
      label: "Layout & Design",
      controls: [
        {
          property: "template",
          label: "Select Design",
          control: "select",
          options: [
            { label: "Classic Wide", value: "fullWidth" },
            { label: "Split Image Right", value: "splitRight" },
            { label: "Split Image Left", value: "splitLeft" },
          ],
          defaultValue: "fullWidth",
        },
        {
          property: "textAlignment",
          label: "Text Alignment",
          control: "select",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
          defaultValue: "left",
        },
        {
          property: "verticalAlignment",
          label: "Vertical Alignment",
          control: "select",
          options: [
            { label: "Top", value: "top" },
            { label: "Center", value: "center" },
            { label: "Bottom", value: "bottom" },
          ],
          defaultValue: "center",
        }
      ]
    },
    {
      label: "Content",
      controls: [
        {
          property: "showTitle",
          label: "Show Title",
          control: "switch",
          defaultValue: true,
        },
        {
          property: "title",
          label: "Title",
          control: "textarea",
          placeholder: "Enter banner title",
          defaultValue: "Welcome to Our Store",
          condition: { property: "showTitle", value: true, operator: "==" }
        },
        {
          property: "showSubtitle",
          label: "Show Subtitle",
          control: "switch",
          defaultValue: true,
        },
        {
          property: "subtitle",
          label: "Subtitle",
          control: "textarea",
          placeholder: "Enter banner subtitle",
          defaultValue: "Discover amazing products",
          condition: { property: "showSubtitle", value: true, operator: "==" }
        },
        {
          property: "showDescription",
          label: "Show Description",
          control: "switch",
          defaultValue: true,
        },
        {
          property: "description",
          label: "Description",
          control: "textarea",
          placeholder: "Enter banner description",
          defaultValue: "Add more details about your promotion here.",
          condition: { property: "showDescription", value: true, operator: "==" }
        },
        {
          property: "backgroundType",
          label: "Background Mode",
          control: "select",
          options: [
            { label: "Image", value: "image" },
            { label: "Color", value: "color" },
          ],
          defaultValue: "image",
        },
        {
          property: "backgroundColor",
          label: "Background Color",
          control: "color",
          defaultValue: "#1e293b",
          condition: { property: "backgroundType", value: "color", operator: "==" }
        },
        {
          property: "backgroundImage",
          label: "Background Image",
          control: "image",
          defaultValue: "/celebratory-banner.png",
          condition: { property: "backgroundType", value: "image", operator: "==" }
        },
        {
          property: "buttons",
          label: "Buttons",
          control: "repeater",
          itemLabel: "label",
          fields: [
            { property: "label", label: "Button Label", control: "input" },
            { property: "link", label: "Link URL", control: "input" },
            { 
              property: "style", 
              label: "Style", 
              control: "select",
              options: [
                { label: "Primary", value: "primary" },
                { label: "Secondary", value: "secondary" },
                { label: "Outline", value: "outline" }
              ],
              defaultValue: "primary"
            },
            { property: "backgroundColor", label: "Button Background Color", control: "color" },
            { property: "textColor", label: "Button Text Color", control: "color" },
            { property: "borderRadius", label: "Button Border Radius (px)", control: "input", type: "number", defaultValue: 8 },
            { 
              property: "padding", 
              label: "Padding (Vertical Horizontal)", 
              control: "input", 
              placeholder: "16px 32px",
              defaultValue: "16px 32px" 
            },
            {
              property: "contentAlignment",
              label: "Content Alignment",
              control: "select",
              options: [
                { label: "Center", value: "center" },
                { label: "Left", value: "start" },
                { label: "Right", value: "end" },
              ],
              defaultValue: "center"
            },
            {
              property: "fontFamily",
              label: "Font Family",
              control: "select",
              options: [
                { label: "Default", value: "default" },
                { label: "Inter", value: "Inter" },
                { label: "Poppins", value: "Poppins" },
                { label: "Roboto", value: "Roboto" },
                { label: "Playfair Display", value: "Playfair Display" },
              ],
              defaultValue: ""
            },
            {
              property: "fontSize",
              label: "Font Size (px)",
              control: "input",
              type: "number",
              defaultValue: 16
            },
            { property: "showArrow", label: "Show Arrow", control: "switch", defaultValue: true }
          ],
          defaultValue: [
            { label: "Shop Now", link: "/products", style: "primary", showArrow: true }
          ]
        },
      ]
    },
    {
      label: "Styles",
      controls: [
        {
          property: "backgroundColor",
          label: "Section Background Color",
          control: "color",
          defaultValue: "#1e293b",
          condition: { property: "backgroundType", value: "color", operator: "==" }
        },
        {
          property: "textColor",
          label: "Global Text Color",
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
        {
          property: "imageFit",
          label: "Image Fit",
          control: "select",
          options: [
            { label: "Cover", value: "cover" },
            { label: "Contain", value: "contain" },
          ],
          defaultValue: "cover",
        },
        {
          property: "imageBorderRadius",
          label: "Image Border Radius (px)",
          control: "input",
          type: "number",
          defaultValue: 0,
          condition: { property: "template", value: "fullWidth", operator: "!=" }
        },
        {
          property: "imagePadding",
          label: "Image Padding (px)",
          control: "input",
          type: "number",
          defaultValue: 0,
          condition: { property: "template", value: "fullWidth", operator: "!=" }
        },
        {
          property: "overlay.show",
          label: "Show Overlay",
          control: "switch",
          defaultValue: false,
        },
        {
          property: "overlay.color",
          label: "Overlay Color",
          control: "color",
          defaultValue: "#000000",
          condition: { property: "overlay.show", value: true, operator: "==" }
        },
        {
          property: "overlay.opacity",
          label: "Overlay Opacity",
          control: "slider",
          min: 0,
          max: 1,
          step: 0.1,
          defaultValue: 0.3,
          condition: { property: "overlay.show", value: true, operator: "==" }
        },
        {
          property: "styles.titleFontFamily",
          label: "Title Font Family",
          control: "select",
          options: [
            { label: "Serif (Playfair)", value: "Playfair Display" },
            { label: "Sans (Inter)", value: "Inter" },
            { label: "Cursive (Playpen)", value: "Playpen Sans" },
            { label: "Script (Dancing Script)", value: "Dancing Script" },
          ],
          defaultValue: "Playfair Display"
        },
        {
          property: "styles.titleLetterSpacing",
          label: "Title Letter Spacing (px)",
          control: "input",
          type: "number",
          defaultValue: 0
        },
        {
          property: "styles.titleOpacity",
          label: "Title Opacity",
          control: "slider",
          min: 0,
          max: 1,
          step: 0.1,
          defaultValue: 1
        },
        {
          property: "styles.subTitleFontFamily",
          label: "Subtitle Font Family",
          control: "select",
          options: [
            { label: "Sans (Inter)", value: "Inter" },
            { label: "Serif (Playfair)", value: "Playfair Display" },
            { label: "Cursive (Playpen)", value: "Playpen Sans" },
            { label: "Script (Dancing Script)", value: "Dancing Script" },
          ],
          defaultValue: "Inter"
        },
        {
          property: "styles.subTitleLetterSpacing",
          label: "Subtitle Letter Spacing (px)",
          control: "input",
          type: "number",
          defaultValue: 0
        }
      ]
    }
  ]
}
