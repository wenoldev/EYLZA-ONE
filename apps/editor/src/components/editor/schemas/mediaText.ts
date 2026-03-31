import type { EditorSchema } from "@/types/editor"

export const mediaTextSchema: EditorSchema = {
    label: "Media & Text",
    icon: "layout",
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
                    defaultValue: "A Perfect Gift"
                },
                {
                    property: "subTitle",
                    label: "Subtitle",
                    control: "input",
                    placeholder: "Enter subtitle",
                    defaultValue: "FOR HER"
                },
                {
                    property: "description",
                    label: "Description",
                    control: "textarea",
                    placeholder: "Enter description",
                    defaultValue: "Express your love with our curated collection."
                },
                {
                    property: "mediaType",
                    label: "Media Type",
                    control: "select",
                    options: [
                        { label: "Image", value: "image" },
                        { label: "Video", value: "video" }
                    ],
                    defaultValue: "image"
                },
                {
                    property: "mediaUrl",
                    label: "Media URL",
                    control: "image",
                    defaultValue: "https://images.unsplash.com/photo-1573408301185-9146fe624df0"
                }
            ]
        },
        {
            label: "Styles",
            controls: [
                {
                    property: "mediaPosition",
                    label: "Media Position",
                    control: "select",
                    options: [
                        { label: "Left", value: "left" },
                        { label: "Right", value: "right" }
                    ],
                    defaultValue: "left"
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
                    defaultValue: "#333333"
                },
                {
                    property: "styles.buttonAlignment",
                    label: "Text Alignment",
                    control: "select",
                    options: [
                        { label: "Left", value: "left" },
                        { label: "Center", value: "center" },
                        { label: "Right", value: "right" }
                    ],
                    defaultValue: "left"
                }
            ]
        }
    ]
}
