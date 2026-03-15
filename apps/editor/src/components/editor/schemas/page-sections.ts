import type { EditorSchema } from "@/types/editor"

export const contactSchema: EditorSchema = {
    label: "Contact Section",
    icon: "mail",
    group: "Pages",
    tabs: [
        {
            label: "Content",
            controls: [
                { property: "title", label: "Title", control: "input", defaultValue: "Get in Touch" },
                { property: "subtitle", label: "Subtitle", control: "textarea", defaultValue: "We'd love to hear from you." },
                { property: "email", label: "Email", control: "input", defaultValue: "hello@eylza.com" },
                { property: "phone", label: "Phone", control: "input", defaultValue: "+1 (555) 000-000" },
                { property: "address", label: "Address", control: "textarea", defaultValue: "123 Fashion Ave, NY" }
            ]
        },
        {
            label: "Styling",
            controls: [
                { property: "styles.backgroundColor", label: "Background", control: "color", defaultValue: "#ffffff" },
                { property: "styles.textColor", label: "Text Color", control: "color", defaultValue: "#111827" }
            ]
        }
    ]
}

export const loginSchema: EditorSchema = {
    label: "Login Form",
    icon: "log-in",
    group: "Pages",
    tabs: [
        {
            label: "Content",
            controls: [
                { property: "title", label: "Title", control: "input", defaultValue: "Welcome Back" },
                { property: "subtitle", label: "Subtitle", control: "input", defaultValue: "Please enter your details." }
            ]
        }
    ]
}

export const cartSchema: EditorSchema = {
    label: "Shopping Cart",
    icon: "shopping-bag",
    group: "Pages",
    tabs: [
        {
            label: "Settings",
            controls: [
                { property: "showTax", label: "Show Tax", control: "switch", defaultValue: true }
            ]
        }
    ]
}

export const checkoutSchema: EditorSchema = {
    label: "Checkout Process",
    icon: "credit-card",
    group: "Pages",
    tabs: [
        {
            label: "Settings",
            controls: [
                { property: "requirePhone", label: "Require Phone", control: "switch", defaultValue: true }
            ]
        }
    ]
}

export const ordersSchema: EditorSchema = {
    label: "Order History",
    icon: "package",
    group: "Pages",
    tabs: [
        {
            label: "Content",
            controls: [
                { property: "title", label: "Title", control: "input", defaultValue: "Your Orders" }
            ]
        }
    ]
}
