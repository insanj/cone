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

    _style: Record<string, string> = {};

    get style(): Record<string, string> {
      return this._style;
    }

    set style(newValue: Record<string, string>) {
      this._style = Object.assign({}, newValue); // prevent editing consts
    }

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
   * Used to express that this type of data is standard key-value CSS
   */
  export type ConeStyle = Record<string, string>;

  /**
   * Represents the specific styles for supported elements, wrapped in an abstract class for ease of use
   */
  export abstract class ConeStyleDefault {
    /**
     * .oogy-cone
     */
    static cone: ConeStyle = {
      "font-family": "system-ui",
      position: "absolute",
      top: "0px",
      left: "0px",
      width: "100%",
      height: "100%",
      display: "flex",
      overflow: "hidden",
    };

    /**
     * .oogy-cone-tab-content-container
     */
    static coneTabContentContainer: ConeStyle = {
      position: "relative",
      width: "100%",
      height: "100%",
      "overflow-y": "scroll",
    };

    /**
     * .oogy-cone-tab-content
     */
    static coneTabContent: ConeStyle = {
      // background: "#19132e",
      color: "#2b154d",
      position: "relative",
      width: "100%",
      "min-height": "calc(100% - 70px)",
      "padding-bottom": "70px",
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
    };

    /**
     * .oogy-cone-tab-bar-container
     */
    static coneTabBarContainer: ConeStyle = {
      position: "absolute",
      bottom: "0px",
      width: "100%",
      padding: "8px 0px 12px 0px",
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
      "border-radius": "12px",
      background: "rgba(255,255,255,0.8)",
    };

    /**
     * .oogy-cone-tab-bar
     */
    static coneTabBar: ConeStyle = {
      background: "rgba(255, 255, 255, 0.9)",
      "backdrop-filter": "blur(10px)",
      color: "#2b154d",
      "font-weight": "500",
      padding: "10px",
      "border-radius": "12px",
      "box-shadow": "0px 1px 2px 1px rgba(0, 0, 0, 0.3)",
      "z-index": "3",
      display: "flex",
      gap: "10px",
      "user-select": "none",
    };

    /**
     * .oogy-cone-tab
     */
    static coneTab: ConeStyle = {
      padding: "5px 20px",
      border: "2px solid #2b154d",
      "border-radius": "10px",
      cursor: "pointer",
      color: "#2b154d",
      "white-space": "pre",
    };

    /**
     * .oogy-cone-jumbotron
     */
    static coneJumbotron: ConeStyle = {
      position: "relative",
      padding: "20px 20px",
      "max-width": "100%",
      display: "flex",
      "flex-direction": "column",
      "align-items": "center",
      "justify-content": "center",
      "border-radius": "12px",
      background: "rgba(0,0,0,0.05)",
      "box-shadow": "inset 0px 0px 10px 0px rgb(0 0 0 / 20%)",
    };

    /**
     * .oogy-cone-jumbotron img
     */
    static coneJumbotronImg: ConeStyle = {
      position: "relative",
      width: "calc(100% - 40px)",
      "max-width": "1080px",
      "min-width": "720px",
      height: "auto",
      "border-radius": "12px",
      "box-shadow": "0px 2px 10px 4px rgb(0 0 0 / 20%)",
    };

    /**
     * .oogy-cone-jumbotron h1
     */
    static coneJumbotronH1: ConeStyle = {
      "z-index": "1",
      position: "absolute",
      bottom: "54px",
    };

    /**
     * .oogy-cone-jumbotron p
     */
    static coneJumbotronP: ConeStyle = {
      "z-index": "1",
      position: "absolute",
      bottom: "38px",
    };
  }

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

      container.style = ConeStyleDefault.cone;

      // build tab content container (where the main "body" shows)
      const tabContentContainerElement = new ConeElement();
      tabContentContainerElement.classList = [
        "oogy-cone-tab-content-container",
      ];
      tabContentContainerElement.style =
        ConeStyleDefault.coneTabContentContainer;
      container.appendChild(tabContentContainerElement);

      // build the tab bar, that shows at the bottom at toggles content elements
      const tabBarContainerElement = new ConeElement();
      tabBarContainerElement.classList = ["oogy-cone-tab-bar-container"];
      tabBarContainerElement.style = ConeStyleDefault.coneTabBarContainer;
      container.appendChild(tabBarContainerElement);

      const tabBarElement = this.buildTabBar(template.tabs.length);
      tabBarElement.classList = ["oogy-cone-tab-bar"];
      tabBarElement.style = ConeStyleDefault.coneTabBar;
      tabBarContainerElement.appendChild(tabBarElement);

      // - build tab bar items for each thing
      let i = 0;
      for (let tab of template.tabs) {
        const tabContentElement = this.buildTabContent(tab.content);
        tabContentElement.classList = ["oogy-cone-tab-content"];
        tabContentElement.id = `oogy-cone-tab-content-${i}`;
        tabContentElement.style = ConeStyleDefault.coneTabContent;
        tabContentContainerElement.appendChild(tabContentElement);

        const tabItemElement = this.buildTabItem(tab.title);

        tabItemElement.onclick = `
        for (let el of document.getElementsByClassName('${tabItemElement.classList[0]}')) {
          el.style['background-color'] = '#fff'; el.style.color = '#2b154d'; 
        }
        
        this.style['background-color'] = '#2b154d';
        this.style.color = '#fff';

        for (let el of document.getElementsByClassName('${tabContentElement.classList[0]}')) {
          el.style.display = 'none'; 
        }

        document.getElementById('${tabContentElement.id}').style.display = 'flex';
        `
          .trim()
          .replace(/\n/g, "");

        tabItemElement.style = ConeStyleDefault.coneTab;

        // handle state-based visibility traits
        if (i > 0) {
          tabContentElement.style.display = "none";
          // autohide tab after the 1st one
        } else {
          tabItemElement.style["background-color"] = "#2b154d";
          tabItemElement.style.color = "#fff";
          // visually autoselect 1st tab
        }

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

    private buildTabItem(title: string): ConeElementInterface {
      const element = new ConeElement();
      element.classList = ["oogy-cone-tab"];
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
          contentElement.style = ConeStyleDefault.coneJumbotron;
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
            contentItemElement.style = ConeStyleDefault.coneJumbotronImg;
            break;
          case "h1":
            contentItemElement.style = ConeStyleDefault.coneJumbotronH1;
            break;
          case "p":
            contentItemElement.style = ConeStyleDefault.coneJumbotronP;
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
