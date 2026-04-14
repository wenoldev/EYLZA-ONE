import type { EditorSchema } from "@/types/editor"

export const headerSchema: EditorSchema = {
  label: "Header",
  tabs: [
    {
      label: "General",
      controls: [
        {
          property: "general.backgroundStyle",
          label: "Background Style",
          control: "select",
          options: [
            { label: "Filled", value: "fill" },
            { label: "Border only", value: "border" },
            { label: "No background", value: "none" },
          ],
          defaultValue: "fill",
        },
        {
          property: "general.behaviour",
          label: "Behaviour",
          control: "select",
          options: [
            { label: "Static", value: "static" },
            { label: "Sticky", value: "sticky" },
          ],
          defaultValue: "static",
        },
        {
          property: "general.borderRadiusStyle",
          label: "Corner Style",
          control: "select",
          options: [
            { label: "Sharp (0px)", value: "sharpe" },
            { label: "Smooth", value: "smooth" },
            { label: "Fully rounded", value: "full" },
          ],
          defaultValue: "smooth",
        },
        {
          property: "general.backgroundColor",
          label: "Background Color",
          control: "color",
          defaultValue: "#ffffff",
          // You can add conditional visibility later if needed (e.g. hidden when backgroundStyle = "none")
        },
        {
          property: "general.textColor",
          label: "Text / Icon Color",
          control: "color",
          defaultValue: "#000000",
        },
        {
          property: "general.logoText",
          label: "Logo Text",
          control: "input",
          type: "text",
          defaultValue: "ZARISHKA",
        },
        {
          property: "general.showStoreLogo",
          label: "Show Image Logo",
          control: "switch",
          defaultValue: false,
        },
        {
          property: "general.storeLogo",
          label: "Store Logo Image",
          control: "image",
          defaultValue: "",
        },
        {
          property: "general.fontFamily",
          label: "Font Family",
          control: "select",
          options: [
            { label: "System default", value: "system-ui" },
            { label: "Serif", value: "serif" },
            { label: "Sans-serif", value: "sans-serif" },
            { label: "Arial", value: "Arial" },
            { label: "Helvetica", value: "Helvetica" },
            { label: "Roboto", value: "Roboto" },
            { label: "Inter", value: "Inter" },
            { label: "Poppins", value: "Poppins" },
          ],
          defaultValue: "system-ui",
        },
      ]
    },
    {
      label: "Top Bar",
      controls: [
        {
          property: "topBar.show",
          label: "Show Top Bar",
          control: "switch",
          defaultValue: false,
        },
        {
          property: "topBar.content",
          label: "Announcement / Text",
          control: "textarea",
          placeholder: "Free shipping on orders over $50",
          defaultValue: "",
        },
        {
          property: "topBar.backgroundColor",
          label: "Top Bar Background",
          control: "color",
          defaultValue: "#4a5d4e",
        },
        {
          property: "topBar.textColor",
          label: "Top Bar Text",
          control: "color",
          defaultValue: "#ffffff",
        },
        {
          property: "topBar.showIcons",
          label: "Show Social / Payment Icons",
          control: "switch",
          defaultValue: true,
        },
      ]
    },
    {
      label: "Main Bar",
      controls: [
        {
          property: "mainBar.order",
          label: "Element Order",
          control: "repeater",
          options: [
            { label: "Logo", value: "logo" },
            { label: "Search", value: "search" },
            { label: "Icons (cart, account…)", value: "icons" },
            { label: "Navigation menu", value: "navigation" },
            { label: "Spacer / Gap", value: "__gap__" },
          ],
          defaultValue: [
            { id: "navigation", visible: true },
            { id: "__gap__", visible: true },
            { id: "logo", visible: true },
            { id: "__gap__", visible: true },
            { id: "search", visible: true },
            { id: "icons", visible: true }
          ],
        },
        {
          property: "mainBar.searchDesign",
          label: "Search Style",
          control: "select",
          options: [
            { label: "Magnifier icon only (opens on click)", value: "icon" },
            { label: "Visible input field", value: "input" },
          ],
          defaultValue: "icon",
        },
      ]
    },
    {
      label: "Bottom Bar",
      controls: [
        {
          property: "bottomBar.show",
          label: "Show Bottom Bar",
          control: "switch",
          defaultValue: false,
        },
        {
          property: "bottomBar.alignment",
          label: "Menu Alignment",
          control: "select",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
          ],
          defaultValue: "center",
        },
      ]
    }
  ]
}
