import type { AccordionConfig } from '../types/Accordion';

export const accordionDesign1: AccordionConfig = {
    template: 'design1',
    items: [
        { title: "What is Eylza?", content: "Eylza is a modern UI library for rapid application development." },
        { title: "How use templates?", content: "You can use templates by specifying the template name in the component config." }
    ],
    allowMultiple: false,
    styles: {
        backgroundColor: "#ffffff",
        headerBackgroundColor: "#f9fafb",
        textColor: "#1f2937",
        activeColor: "#3b82f6",
        borderRadius: "md",
        spacing: "0.5rem"
    }
};

export const accordionDesign2: AccordionConfig = {
    ...accordionDesign1,
    template: 'design2',
    styles: {
        ...accordionDesign1.styles,
        headerBackgroundColor: "#ffffff",
        borderRadius: "none",
        spacing: "0"
    }
};

export const accordionTemplates: Record<string, AccordionConfig> = {
    design1: accordionDesign1,
    design2: accordionDesign2
};
