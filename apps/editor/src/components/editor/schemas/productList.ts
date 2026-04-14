import type { EditorSchema } from "@/types/editor"

export const productListSchema: EditorSchema = {
    label: "Product List",
    icon: "layout-grid",
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
                    placeholder: "Latest Products",
                    defaultValue: "Featured Categories",
                },
                {
                    property: "subtitle",
                    label: "Subtitle",
                    control: "input",
                    type: "text",
                    placeholder: "Explore our categories",
                    defaultValue: "Discover our curated collection of categories",
                },
                {
                    property: "template",
                    label: "Template",
                    control: "select",
                    options: [
                        { label: "Category Circles", value: "category" },
                        { label: "Product Cards", value: "product" },
                        { label: "Minimal List", value: "minimal" },
                        { label: "Zarishka Grid", value: "zarishka" },
                    ],
                    defaultValue: "category",
                }
            ]
        },
        {
            label: "Styles",
            controls: [
                {
                    property: "styles.backgroundColor",
                    label: "Section Background",
                    control: "color",
                    defaultValue: "transparent",
                },
                {
                    property: "styles.containerWidth",
                    label: "Container Max Width (px)",
                    control: "input",
                    type: "number",
                    defaultValue: 1280,
                },
                {
                    property: "styles.paddingTop",
                    label: "Padding Top (px)",
                    control: "input",
                    type: "number",
                    defaultValue: 80,
                },
                {
                    property: "styles.paddingBottom",
                    label: "Padding Bottom (px)",
                    control: "input",
                    type: "number",
                    defaultValue: 80,
                },
                {
                    property: "styles.gap",
                    label: "Item Gap (px)",
                    control: "input",
                    type: "number",
                    defaultValue: 32,
                },
                {
                    property: "styles.titleAlignment",
                    label: "Title Alignment",
                    control: "select",
                    options: [
                        { label: "Left", value: "left" },
                        { label: "Center", value: "center" },
                        { label: "Right", value: "right" },
                    ],
                    defaultValue: "center",
                },
                {
                    property: "styles.titleSize",
                    label: "Title Font Size (px)",
                    control: "input",
                    type: "number",
                    defaultValue: 36,
                },
                {
                    property: "styles.subtitleSize",
                    label: "Subtitle Font Size (px)",
                    control: "input",
                    type: "number",
                    defaultValue: 18,
                },
                {
                    property: "styles.titleColor",
                    label: "Title Color",
                    control: "color",
                    defaultValue: "#111827",
                },
                {
                    property: "styles.subtitleColor",
                    label: "Subtitle Color",
                    control: "color",
                    defaultValue: "#4b5563",
                }
            ]
        },
        {
            label: "Layout",
            controls: [
                {
                    property: "layout.desktop",
                    label: "Desktop Columns",
                    control: "input",
                    type: "number",
                    defaultValue: 4,
                },
                {
                    property: "layout.tablet",
                    label: "Tablet Columns",
                    control: "input",
                    type: "number",
                    defaultValue: 2,
                },
                {
                    property: "layout.mobile",
                    label: "Mobile Columns",
                    control: "input",
                    type: "number",
                    defaultValue: 1,
                },
            ]
        },
        {
            label: "Card Styles",
            controls: [
                {
                    property: "styles.cardStyles.imageShape",
                    label: "Image Shape",
                    control: "select",
                    options: [
                        { label: "Circle", value: "circle" },
                        { label: "Square", value: "square" },
                        { label: "Rounded", value: "rounded" },
                    ],
                    defaultValue: "rounded",
                },
                {
                    property: "styles.cardStyles.textAlign",
                    label: "Card Text Alignment",
                    control: "select",
                    options: [
                        { label: "Left", value: "left" },
                        { label: "Center", value: "center" },
                        { label: "Right", value: "right" },
                    ],
                    defaultValue: "center",
                },
                {
                    property: "styles.cardStyles.aspectRatio",
                    label: "Image Aspect Ratio",
                    control: "select",
                    options: [
                        { label: "Square (1:1)", value: "1/1" },
                        { label: "Portrait (4:5)", value: "4/5" },
                        { label: "Landscape (16:9)", value: "16/9" },
                    ],
                    defaultValue: "1/1",
                },
                {
                    property: "styles.cardStyles.showShadow",
                    label: "Show Card Shadow",
                    control: "switch",
                    defaultValue: false,
                }
            ]
        }
    ]
}
