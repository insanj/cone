export declare module Cone {
    type ConeTemplate = {
        tabs: ConeTemplateTab[];
        style?: ConeStyle;
        start?: number;
    };
    type ConeTemplateTab = {
        title: string;
        expanded: string;
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
    const kConeTemplateTabContentAlignmentDefault: ConeTemplateTabContentAlignment;
    const kConeTemplateTabContentDurationDefault: number;
    type ConeTemplateTabContent = {
        kind: ConeTemplateTabContentKind;
        duration?: number;
        elements: ConeTemplateTabContentElement[];
        align?: ConeTemplateTabContentAlignment;
    };
    type ConeTemplateTabContentElement = {
        type: string;
        src?: string;
        text?: string;
        href?: string;
    };
    enum ConeTemplateTabContentKind {
        jumbotron = "jumbotron",
        list = "list"
    }
    interface ConeElementInterface {
        nodeType: string;
        classList: string[];
        id: string;
        innerText: string;
        outerHTML: string;
        onclick: string;
        onload: string;
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
        onload: string;
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
        get coneJumbotronIFrame(): ConeStyle;
        get coneJumbotronH1(): ConeStyle;
        get coneJumbotronP(): ConeStyle;
        get coneAlignableBox(): ConeStyle;
        get coneList(): ConeStyle;
        get coneListItem(): ConeStyle;
        get coneListA(): ConeStyle;
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
