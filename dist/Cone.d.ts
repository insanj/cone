export declare module Cone {
    type ConeTemplate = {
        tabs: ConeTemplateTab[];
        style?: ConeStyle;
    };
    type ConeTemplateTab = {
        title: string;
        content: ConeTemplateTabContent;
    };
    type ConeTemplateTabContentAlignment = string;
    enum ConeTemplateTabContentAlignmentVertical {
        top = "top",
        center = "center",
        bottom = "bottom"
    }
    enum ConeTemplateTabContentAlignmentHorizontal {
        left = "left",
        center = "center",
        right = "right"
    }
    const kConeTemplateTabContentAlignmentDefault = "bottom-left";
    type ConeTemplateTabContent = {
        style: ConeTemplateTabContentStyle;
        elements: ConeTemplateTabContentElement[];
        align?: ConeTemplateTabContentAlignment;
    };
    type ConeTemplateTabContentElement = {
        type: string;
        src?: string;
        text?: string;
    };
    enum ConeTemplateTabContentStyle {
        jumbotron = "jumbotron"
    }
    interface ConeElementInterface {
        nodeType: string;
        classList: string[];
        id: string;
        innerText: string;
        outerHTML: string;
        onclick: string;
        style: Record<string, string>;
        setAttribute(attribute: string, value: string): void;
        appendChild(element: ConeElementInterface): void;
        prepend(element: ConeElementInterface): void;
    }
    class ConeElement implements ConeElementInterface {
        nodeType: string;
        classList: string[];
        id: string;
        innerText: string;
        onclick: string;
        _style: Record<string, string>;
        get style(): Record<string, string>;
        set style(newValue: Record<string, string>);
        private attributes;
        private children;
        setAttribute(attribute: string, value: string): void;
        appendChild(element: ConeElementInterface): void;
        prepend(element: ConeElementInterface): void;
        get outerHTML(): string;
    }
    type ConeBuilderBuildOptions = {
        template: string | Record<string, string>;
    };
    type ConeStyle = Record<string, string>;
    const kConeStyleDefaultReference: ConeStyle;
    class ConeStyleBuilder {
        reference: ConeStyle;
        get cone(): ConeStyle;
        get coneTabBarContainer(): ConeStyle;
        get coneTabBar(): ConeStyle;
        get coneTab(): ConeStyle;
        get coneTabContentContainer(): ConeStyle;
        get coneTabContent(): ConeStyle;
        get coneJumbotron(): ConeStyle;
        get coneJumbotronImg(): ConeStyle;
        get coneJumbotronH1(): ConeStyle;
        get coneJumbotronP(): ConeStyle;
        get coneAlignableBox(): ConeStyle;
    }
    interface ConeBuilderInterface {
        build(options: ConeBuilderBuildOptions): string;
    }
    class ConeBuilder implements ConeBuilderInterface {
        static build(options: ConeBuilderBuildOptions): string;
        build(options: ConeBuilderBuildOptions): string;
        private buildTabBar;
        private buildTabItem;
        private buildTabContent;
    }
}
