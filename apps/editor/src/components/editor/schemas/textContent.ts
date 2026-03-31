import type { EditorSchema } from "@/types/editor"

export const textContentSchema: EditorSchema = {
    label: "Text Content",
    icon: "type",
    group: "Content",
    tabs: [
        {
            label: "Content",
            controls: [
                {
                    property: "title",
                    label: "Title",
                    control: "input",
                    placeholder: "Enter title",
                    defaultValue: "About Us"
                },
                {
                    property: "content",
                    label: "Content",
                    control: "textarea",
                    placeholder: "Enter content (HTML supported)",
                    defaultValue: "We are a handcrafted brand..."
                }
            ]
        },
        {
            label: "Styles",
            controls: [
                {
                    property: "alignment",
                    label: "Alignment",
                    control: "select",
                    options: [
                        { label: "Left", value: "left" },
                        { label: "Center", value: "center" },
                        { label: "Right", value: "right" }
                    ],
                    defaultValue: "center"
                },
                {
                    property: "styles.fontFamily",
                    label: "Font Family",
                    control: "select",
                    options: [
                        { label: "Sans Serif", value: "sans" },
                        { label: "Premium Serif", value: "serif" }
                    ],
                    defaultValue: "sans"
                },
                {
                    property: "styles.backgroundColor",
                    label: "Background Color",
                    control: "color",
                    defaultValue: "#ffffff"
                },
                {
                    property: "styles.textColor",
                    label: "Text Color",
                    control: "color",
                    defaultValue: "#4b5563"
                },
                {
                    property: "styles.titleColor",
                    label: "Title Color",
                    control: "color",
                    defaultValue: "#111827"
                }
            ]
        }
    ]
}
