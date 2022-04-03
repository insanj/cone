/**
 * cone
 * 🍦 vanilla js static pwa generator, built in ts for oogy: can you help
 * github.com/insanj/cone
 * (c) 2022 Julian Weiss
 */
export module Cone {
  /**
   * Describes the complete 🍦 cone template, usually saved and expected in UTF-8 encoded JSON.
   */
  export type ConeTemplate = {
    tabs: ConeTemplateTab[];
  };

  /**
   * A single tab in the UI of the website
   */
  export type ConeTemplateTab = {
    /**
     * Title, required as this is also what we tap to swap to a new tab
     */
    title: string;

    /**
     * @see ConeTemplateTabContent
     */
    content: ConeTemplateTabContent;
  };

  export type ConeTemplateTabContent = {
    /**
     * Tabs can have different layouts, this defines what we will expect to see in this tab's content.
     */
    style: ConeTemplateTabContentStyle;

    /**
     * Elements which will be encoded using the middleman of ConeElement
     * @see ConeElementInterface
     */
    elements: ConeTemplateTabContentElement[];
  };

  export type ConeTemplateTabContentElement = {
    /**
     * Represents the supports HTML node/tag type.
     * @example `h1`
     */
    type: string;

    /**
     * Will attempt to set the `src` attribute of the built element. Only works on things like `img`.
     */
    src?: string;

    /**
     * Corresponds to `innerText` of the built element.
     */
    text?: string;
  };

  export enum ConeTemplateTabContentStyle {
    /**
     * A minimal style which emphasizes `img` elements and overlays `h1` and `p` to the `img` which preceeds it
     */
    jumbotron = "jumbotron",
  }

  /**
   * Simulates all the necessary `Element` methods and properties so we can run in a Node.js or browser environment.
   */
  export interface ConeElementInterface {
    /**
     * HTML Tag name of this element.
     * @example div
     */
    nodeType: string;

    /**
     * HTML class list which will be parsed and used as the `className` on the final element.
     * @example 'oogy-studio'
     */
    classList: string[];

    /**
     * HTML id
     * @example `oogy-item-1`
     */
    id: string;

    /**
     * HTML inner text
     * @example "Hello, world!"
     */
    innerText: string;

    /**
     * Generate string from this element. This is the recommended function to use. Read-only.
     * @readonly
     */
    outerHTML: string;

    /**
     * JS onclick handler, only accepted as string
     * @example
     *
     */
    onclick: string;

    /**
     * HTML short-hand for inline `style` attribute. If provided, this will be used AFTER the attribute.
     */
    style: Record<string, string>;

    /**
     * HTML attributes to assign when generating this element
     * @param attribute Attribute name, such as `"style"`
     * @param value Attribute value, such as `"font-size: 12px;""`
     */
    setAttribute(attribute: string, value: string): void;

    /**
     * Will generate the HTML for these children within the resulting `outerHTML`
     * @param element
     */
    appendChild(element: ConeElementInterface): void;
  }

  /**
   * @see ConeElementInterface
   */
  export class ConeElement implements ConeElementInterface {
    nodeType: string = "div";

    classList: string[] = [];

    id: string = "";

    innerText: string = "";

    onclick: string = "";

    style: Record<string, string> = {};

    private attributes: Record<string, string> = {};

    private children: ConeElementInterface[] = [];

    setAttribute(attribute: string, value: string): void {
      this.attributes[attribute] = value;
    }

    appendChild(element: ConeElementInterface): void {
      this.children.push(element);
    }

    get outerHTML(): string {
      const tagName = this.nodeType;

      const idStr = this.id.length < 1 ? "" : ` id="${this.id}" `;

      const classStr =
        this.classList.length < 1 ? "" : ` class="${this.classList.join(" ")}"`;

      const encodedAttrs = Object.keys(this.attributes).map((attr) => {
        return ` ${attr}="${this.attributes[attr]}" `;
      });
      const attributesStr = encodedAttrs.join(" ");

      const childrenStr =
        this.children.length < 1
          ? ""
          : this.children.map((child) => child.outerHTML).join("");

      const styleKeys = Object.keys(this.style);
      const styleStr =
        styleKeys.length < 1
          ? ""
          : ` style="${styleKeys
              .map((key) => `${key}:${this.style[key]};`)
              .join("")}" `;

      const onclickStr =
        this.onclick.length < 1 ? "" : ` onclick="${this.onclick}" `;

      const encoded = `<${tagName}${idStr}${classStr}${attributesStr}${styleStr}${onclickStr}>${this.innerText}${childrenStr}</${tagName}>`;

      return encoded;
    }
  }

  /**
   * Wrapped options for building a full website within the ConeBuilder.
   * @see ConeBuilderInterface
   */
  export type ConeBuilderBuildOptions = {
    /**
     * UTF-8 data, usually lifted from a file (in the example app, this is `example.cone` which is easy to read JSON).
     */
    template: string;
  };

  /**
   * Represents the singleton/class version of the ConeBuilder, a great way to get started on generating an entire website in one go.
   */
  export interface ConeBuilderInterface {
    build(options: ConeBuilderBuildOptions): string;
  }

  /**
   * Central builder for 🍦 cone
   * @see ConeBuilderInterface
   */
  export class ConeBuilder implements ConeBuilderInterface {
    static build(options: ConeBuilderBuildOptions): string {
      return new ConeBuilder().build(options);
    }

    build(options: ConeBuilderBuildOptions): string {
      if (
        !options ||
        options == null ||
        options == undefined ||
        !options.template ||
        options.template == null ||
        options.template == undefined
      ) {
        // the ONE time I use ==
        return "🍦 cone says: template not provided! I can't do anything";
      }

      const template: ConeTemplate = JSON.parse(options.template);

      const container = new ConeElement();
      container.classList = [
        "oogy-cone", // potential area for future schema exposure
      ];

      // build tab content container (where the main "body" shows)
      const tabContentContainerElement = new ConeElement();
      tabContentContainerElement.classList = [
        "oogy-cone-tab-content-container",
      ];
      container.appendChild(tabContentContainerElement);

      // build the tab bar, that shows at the bottom at toggles content elements
      const tabBarContainerElement = new ConeElement();
      tabBarContainerElement.classList = ["oogy-cone-tab-bar-container"];
      container.appendChild(tabBarContainerElement);

      const tabBarElement = this.buildTabBar(template.tabs.length);
      tabBarElement.classList = ["oogy-cone-tab-bar"];
      tabBarContainerElement.appendChild(tabBarElement);

      // - build tab bar items for each thing
      let i = 0;
      for (let tab of template.tabs) {
        const tabContentElement = this.buildTabContent(tab.content);
        tabContentElement.id = `oogy-cone-tab-bar-content-${i}`;

        if (i > 0) {
          tabContentElement.style.display = "none"; // autohide tab after the 1st one
        }

        tabContentContainerElement.appendChild(tabContentElement);

        const tabItemElement = this.buildTabItem(
          tab.title,
          `for (let el of document.getElementsByClassName(${tabContentElement.classList[0]})) { el.style.display = 'none'; } document.getElementById(${tabContentElement.id}).style.display = 'block';`
        );

        tabBarElement.appendChild(tabItemElement);

        i++;
      }

      // generate final string from the resulting element, which until now
      // was very close if not identical to the in-DOM result (document.createElement)
      const result = container.outerHTML;
      return result;
    }

    private buildTabBar(size: number): ConeElementInterface {
      const element = new ConeElement();
      element.classList = ["oogy-cone-tab-bar"];
      return element;
    }

    private buildTabItem(title: string, onclick: string): ConeElementInterface {
      const element = new ConeElement();
      element.classList = ["oogy-cone-tab"];
      element.onclick = onclick;
      element.innerText = title;
      return element;
    }

    private buildTabContent(
      content: ConeTemplateTabContent
    ): ConeElementInterface {
      const container = new ConeElement();
      container.classList = ["oogy-cone-tab-content"];

      const contentElement = new ConeElement();
      container.appendChild(contentElement);

      switch (content.style) {
        default:
        case ConeTemplateTabContentStyle.jumbotron:
          contentElement.classList = ["oogy-cone-jumbotron"];
          break;
      }

      for (let contentItem of content.elements) {
        const contentItemElement = new ConeElement();
        contentItemElement.nodeType = contentItem.type;

        switch (contentItem.type) {
          default:
            break;
          case "img":
            if (contentItem.src === undefined) {
              break; // unexpected err case here, error understanding template
            }
            contentItemElement.setAttribute("src", contentItem.src!);
            break;
        }

        if (contentItem.text !== undefined) {
          contentItemElement.innerText = contentItem.text;
        }

        contentElement.appendChild(contentItemElement);
      }

      return container;
    }
  }
}
