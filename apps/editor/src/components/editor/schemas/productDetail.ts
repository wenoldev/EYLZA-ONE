import type { EditorSchema } from "@/types/editor"

export const productDetailSchema: EditorSchema = {
    label: "Product Detail",
    icon: "shopping-bag",
    group: "Product",
    tabs: [
        {
            label: "Layout",
            controls: [
                {
                    property: "layout",
                    label: "Page Layout",
                    control: "select",
                    options: [
                        { label: "Split (Image | Info)", value: "split" },
                        { label: "Stacked", value: "stacked" },
                        { label: "Grid", value: "grid" },
                    ],
                    defaultValue: "split",
                },
                {
                    property: "styles.containerWidth",
                    label: "Container Width (px)",
                    control: "input",
                    type: "number",
                    defaultValue: 1280,
                },
                {
                    property: "content.stickyInfo",
                    label: "Sticky Product Info",
                    control: "switch",
                    defaultValue: true,
                }
            ]
        },
        {
            label: "Gallery",
            controls: [
                {
                    property: "gallery.position",
                    label: "Gallery Position",
                    control: "select",
                    options: [
                        { label: "Left", value: "left" },
                        { label: "Right", value: "right" },
                        { label: "Top", value: "top" },
                    ],
                    defaultValue: "left",
                },
                {
                    property: "gallery.showThumbnails",
                    label: "Show Thumbnails",
                    control: "switch",
                    defaultValue: true,
                },
                {
                    property: "gallery.aspectRatio",
                    label: "Image Aspect Ratio",
                    control: "select",
                    options: [
                        { label: "Square (1:1)", value: "1/1" },
                        { label: "Portrait (4:5)", value: "4/5" },
                        { label: "Landscape (16:9)", value: "16/9" },
                    ],
                    defaultValue: "4/5",
                },
                {
                    property: "gallery.imageShape",
                    label: "Image Shape",
                    control: "select",
                    options: [
                        { label: "Square", value: "square" },
                        { label: "Rounded", value: "rounded" },
                    ],
                    defaultValue: "rounded",
                }
            ]
        },
        {
            label: "Content",
            controls: [
                {
                    property: "content.showRating",
                    label: "Display Rating",
                    control: "switch",
                    defaultValue: true,
                },
                {
                    property: "content.showSku",
                    label: "Display SKU",
                    control: "switch",
                    defaultValue: false,
                },
                {
                    property: "content.showStock",
                    label: "Display Stock Status",
                    control: "switch",
                    defaultValue: true,
                },
                {
                    property: "content.showShareButtons",
                    label: "Display Share Buttons",
                    control: "switch",
                    defaultValue: true,
                }
            ]
        },
        {
            label: "Styles",
            controls: [
                {
                    property: "styles.backgroundColor",
                    label: "Background Color",
                    control: "color",
                    defaultValue: "transparent",
                },
                {
                    property: "styles.titleColor",
                    label: "Title Color",
                    control: "color",
                    defaultValue: "#111827",
                },
                {
                    property: "styles.titleSize",
                    label: "Title Font Size (px)",
                    control: "input",
                    type: "number",
                    defaultValue: 32,
                },
                {
                    property: "styles.priceColor",
                    label: "Price Color",
                    control: "color",
                    defaultValue: "#111827",
                },
                {
                    property: "styles.salePriceColor",
                    label: "Sale Price Color",
                    control: "color",
                    defaultValue: "#ef4444",
                },
                {
                    property: "styles.buttonText",
                    label: "Add to Cart Text",
                    control: "input",
                    type: "text",
                    defaultValue: "Add to Cart",
                },
                {
                    property: "styles.buttonColor",
                    label: "Button Background",
                    control: "color",
                    defaultValue: "#000000",
                },
                {
                    property: "styles.buttonTextColor",
                    label: "Button Text Color",
                    control: "color",
                    defaultValue: "#ffffff",
                },
                {
                    property: "styles.buttonShape",
                    label: "Button Shape",
                    control: "select",
                    options: [
                        { label: "Square", value: "square" },
                        { label: "Rounded", value: "rounded" },
                        { label: "Pill", value: "pill" },
                    ],
                    defaultValue: "rounded",
                }
            ]
        }
    ]
}
