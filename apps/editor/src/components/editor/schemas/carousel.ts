import type { EditorSchema } from "@/types/editor"

export const carouselSchema: EditorSchema = {
  label: "Premium Carousel",
  tabs: [
    {
      label: "Slides",
      controls: [
        {
          property: "items",
          label: "Carousel Items",
          control: "repeater",
          itemLabel: "Slide",
          fields: [
            {
              property: "image",
              label: "Slide Image",
              control: "image",
              defaultValue: "/placeholder.svg"
            },
            {
              property: "subtitle",
              label: "Sub Title",
              control: "input",
              type: "text",
              placeholder: "NEW COLLECTION",
              defaultValue: "PREMIUM SELECTION"
            },
            {
              property: "title",
              label: "Main Title",
              control: "input",
              type: "text",
              placeholder: "Summer Essentials",
              defaultValue: "TIMLESS STYLE"
            },
            {
              property: "buttonText",
              label: "Button Label",
              control: "input",
              type: "text",
              defaultValue: "Shop Now"
            },
            {
              property: "buttonLink",
              label: "Button Link",
              control: "input",
              type: "text",
              defaultValue: "/products"
            },
            {
              property: "textAlignment",
              label: "Text Alignment",
              control: "select",
              options: [
                { label: "Left", value: "left" },
                { label: "Center", value: "center" },
                { label: "Right", value: "right" }
              ],
              defaultValue: "left"
            },
            {
              property: "overlayOpacity",
              label: "Overlay Darken (%)",
              control: "slider",
              min: 0,
              max: 100,
              step: 5,
              defaultValue: 30
            }
          ],
          defaultValue: [
            {
              image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80",
              title: "NEW ARRIVALS",
              subtitle: "SEASONAL PICKS",
              buttonText: "EXPLORE NOW",
              textAlignment: "center",
              overlayOpacity: 40
            }
          ]
        }
      ]
    },
    {
      label: "Settings",
      controls: [
        {
          property: "height",
          label: "Carousel Height",
          control: "select",
          options: [
            { label: "Small (500px)", value: "500px" },
            { label: "Medium (650px)", value: "650px" },
            { label: "Large (800px)", value: "800px" },
            { label: "Full Screen", value: "screen" }
          ],
          defaultValue: "650px"
        },
        {
          property: "autoplay",
          label: "Auto Play",
          control: "switch",
          defaultValue: true
        },
        {
          property: "interval",
          label: "Play Speed (ms)",
          control: "input",
          type: "number",
          defaultValue: 5000
        },
        {
          property: "indicatorPosition",
          label: "Indicator Position",
          control: "select",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" }
          ],
          defaultValue: "right"
        },
        {
          property: "showArrows",
          label: "Show Navigation Arrows",
          control: "switch",
          defaultValue: true
        }
      ]
    }
  ]
}
