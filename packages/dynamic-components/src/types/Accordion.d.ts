export interface AccordionItem {
    title: string;
    content: React.ReactNode;
}

export interface AccordionConfig {
    items: AccordionItem[];
    allowMultiple: boolean;
    icon: 'chevron' | 'plus';
    title: string; //innerhtml
    subTitle: string; //innerhtml
    styles: {
        backgroundColor: string;
        textColor: string;
        borderColor: string;
        titleFont: string;
        contentFont: string;
    };
}
