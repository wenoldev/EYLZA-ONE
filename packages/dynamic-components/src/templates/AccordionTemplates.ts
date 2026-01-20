import type { AccordionConfig } from '../types/Accordion';

export const accordionDesign1: AccordionConfig = {
    items: [
        { title: "What is Eylza?", content: "Eylza is a modern UI library for rapid application development." },
        { title: "How use templates?", content: "You can use templates by specifying the template name in the component config." }
    ],
    allowMultiple: false,
    icon: 'chevron',
    title: "Frequently Asked Questions",
    subTitle: "Everything you need to know about our platform",
    styles: {
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
        borderColor: "#e5e7eb",
        titleFont: "Inter",
        contentFont: "Inter"
    }
};

export const accordionTemplates: Record<string, AccordionConfig> = {
    design1: accordionDesign1
};
