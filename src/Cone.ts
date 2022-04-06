/**
 * cone
 * 🍦 vanilla js static pwa generator, built in ts for oogy: can you help
 * github.com/insanj/cone
 * (c) 2022 Julian Weiss
 */
export module Cone {
  /**
   * Describes the complete 🍦 cone template, usually saved and expected in UTF-8 encoded JSON. Only three root keys are supported right now:
   * 1. `tabs`, which matches `ConeTemplateTab`
   * 2. `style`, optional, supports `background` and `color` keys (HTML color vals)
   * 3. `start`, optional, index to begin with
   */
  export type ConeTemplate = {
    tabs: ConeTemplateTab[];

    style?: ConeStyle;

    start?: number;
  };

  /**
   * Data format which represents a tab (what we use to go to different areas of the site, fixed to the bottom at the moment) and its content (the "body" of the site); each .cone will have an array of these that describe the entire website at the `tabs` key.
   */
  export type ConeTemplateTab = {
    /**
     * Smallest possible title/icon, required as this is also what we tap to swap to a new tab
     */
    title: string;

    /**
     * Expanded text/title, visible on larger displays
     */
    expanded?: string;

    /**
     * @see ConeTemplateTabContent
     */
    content: ConeTemplateTabContent;
  };

  /**
   * Expected type for the content alignment. Should be the vertical alignment followed by the horizontal alignment.
   * @see kConeTemplateTabContentAlignmentDefault
   * @example `bottom-left`, `top-right`, `center-center`
   */
  export type ConeTemplateTabContentAlignment = string;

  /**
   * Vertical alignment of elements within the content body, usually for jumbotron. Only aligns alignable items, not the main media.
   */
  export enum ConeTemplateTabContentAlignmentVertical {
    top = "top",
    center = "center",
    bottom = "bottom",
  }

  /**
   * Horizontal alignment of elements within the content body, usually for jumbotron. Only aligns alignable items, not the main media.
   */
  export enum ConeTemplateTabContentAlignmentHorizontal {
    left = "left",
    center = "center",
    right = "right",
  }

  /**
   * Default alignment of content within a tab, usually for jumbotron style
   */
  export const kConeTemplateTabContentAlignmentDefault: ConeTemplateTabContentAlignment =
    "bottom-left";

  export const kConeTemplateTabContentDurationDefault: number = 3200;

  /**
   * Data format which describes the primary content body that is shown when this area is active/selected
   */
  export type ConeTemplateTabContent = {
    /**
     * Tabs can have different layouts, this defines what we will expect to see in this tab's content.
     */
    kind: ConeTemplateTabContentKind;

    /**
     * Milliseconds. Animation duration. If more than 1 media element is given and an animation is scheduled, this will be used for its duration instead of the default.
     */
    duration?: number;

    /**
     * Elements which will be encoded using the middleman of ConeElement
     * @see ConeElementInterface
     */
    elements?: ConeTemplateTabContentElement[];

    /**
     * Alignment for alignable elements (usually, images/video/big content are not alignable, but everything else is)
     */
    align?: ConeTemplateTabContentAlignment;

    /**
     * Root style to alternate to when activating this element
     */
    stylerStyle?: ConeStyle;
  };

  /**
   * Data format which describes an element within a tab's content body, usually these are turned into stripped-down HTML elements, sometimes with the same nodeType/tag, using ConeElement.
   */
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

    /**
     * Corresponds to the `href` attribute of an `a` element (hyperlink)
     */
    href?: string;
  };

  /**
   * Supported content kinds. Found within the .cone format, used for each tab's `content` to determine the layout of the content body.
   */
  export enum ConeTemplateTabContentKind {
    /**
     * A minimal style which emphasizes `img` or `iframe` elements and overlays `h1` and `p` to the `img` which preceeds it. Enforces a 1920/1080 aspect ratio.
     */
    jumbotron = "jumbotron",

    /**
     * A list style which wraps every element in a list item element and presents the content in individual "banners" (simiular to `ul` containing `li`, even though we use flex for most layouts)
     */
    list = "list",

    /**
     * A non-content tab that mutates the root-level `style` property of this template
     */
    styler = "styler",
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
     * JS onclick handler, only accepted as string. Used primarily to swap content when clicking a tab.
     * @example
     *
     */
    onclick: string;

    /**
     * JS onload handler, only accepted as string. Used primarily when loading images to set up a carousel if more than 1 image is supplied.
     */
    onload: string;

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

    /**
     * Equivalent to `appendChild`, but adds this element to the top of the existing child list
     * @see appendChild
     * @param element
     */
    prepend(element: ConeElementInterface): void;
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

    onload: string = "";

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

    prepend(element: ConeElementInterface): void {
      this.children.unshift(element);
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

      const onloadStr =
        this.onload.length < 1 ? "" : ` onload="${this.onload}" `;

      const encoded = `<${tagName}${idStr}${classStr}${attributesStr}${styleStr}${onclickStr}${onloadStr}>${this.innerText}${childrenStr}</${tagName}>`;

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
    template: string | Record<string, string>;
  };

  /**
   * Used to express that this type of data is standard key-value CSS
   */
  export type ConeStyle = Record<string, string>;

  export const kConeStyleDefaultReference: ConeStyle = {
    background: "#fff",
    color: "#2b154d",
  };

  /**
   * Represents the specific styles for supported elements
   */
  export class ConeStyleBuilder {
    /**
     * Will be used for color and background information.
     */
    reference: ConeStyle = kConeStyleDefaultReference;

    /**
     * .oogy-cone
     */
    get cone(): ConeStyle {
      return {
        "font-family": "system-ui",
        position: "absolute",
        top: "0px",
        left: "0px",
        width: "100%",
        height: "100%",
        display: "flex",
        overflow: "hidden",
        "transform-origin": "center center", // used when scaling in small windows
        "background-color": this.reference.background,
      };
    }

    /**
     * .oogy-cone-tab-bar-container
     */
    get coneTabBarContainer(): ConeStyle {
      return {
        position: "absolute",
        bottom: "0px",
        width: "100%",
        padding: "8px 0px 12px 0px",
        display: "flex",
        "align-items": "center",
        "justify-content": "center",
        "border-radius": "12px",
        "z-index": "3",
        background: this.reference.background,
      };
    }

    /**
     * .oogy-cone-tab-bar
     */
    get coneTabBar(): ConeStyle {
      return {
        background: this.reference.background,
        "backdrop-filter": "blur(10px)",
        "font-weight": "500",
        padding: "10px",
        "border-radius": "12px",
        "box-shadow": "0px 1px 2px 1px rgba(0, 0, 0, 0.3)",
        "z-index": "3",
        display: "flex",
        gap: "10px",
        "user-select": "none",
      };
    }

    /**
     * .oogy-cone-tab
     */
    get coneTab(): ConeStyle {
      return {
        padding: "5px 20px",
        border: `2px solid ${this.reference.color}`,
        "border-radius": "10px",
        cursor: "pointer",
        color: this.reference.color,
        "text-shadow": `0px 4px 40px ${this.reference.color}`,
        overflow: "hidden",
        "white-space": "pre",
        "box-shadow": "0px 1px 2px 2px rgb(0 0 0 / 15%)",
        "font-size": "18px",
        "line-height": "25px"
      };
    }

    /**
     * .oogy-cone-tab-content-container
     */
    get coneTabContentContainer(): ConeStyle {
      return {
        position: "relative",
        width: "100%",
        height: "100%",
        "overflow-y": "scroll",
        "transform-origin": "center center", // used for scaling
        "background-color": this.reference.background,
      };
    }

    /**
     * .oogy-cone-tab-content
     */
    get coneTabContent(): ConeStyle {
      return {
        // background: this.reference.background,
        color: this.reference.color,
        position: "relative",
        width: "100%",
        "min-height": "calc(100% - 70px)",
        "padding-bottom": "70px",
        display: "flex",
        "align-items": "center",
        "justify-content": "center",
      };
    }

    /**
     * .oogy-cone-jumbotron
     */
    get coneJumbotron(): ConeStyle {
      return {
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
        animation: "fadeIn 0.6s ease-out"
      };
    }

    /**
     * .oogy-cone-jumbotron img
     */
    get coneJumbotronImg(): ConeStyle {
      return {
        position: "relative",
        width: "calc(100% - 40px)",
        "max-width": "1080px",
        "min-width": "720px",
        height: "auto",
        "border-radius": "12px",
        "box-shadow": "0px 2px 10px 4px rgb(0 0 0 / 20%)",
        // animation: "carousel 1.5s ease-out",
      };
    }

    /**
     * .oogy-cone-jumbotron iframe
     */
    get coneJumbotronIFrame(): ConeStyle {
      return {
        position: "relative",
        width: "calc(100% - 40px)",
        "max-width": "1080px",
        "min-width": "720px",
        height: "auto",
        "aspect-ratio": "1920/1080",
        "border-radius": "12px",
        "box-shadow": "0px 2px 10px 4px rgb(0 0 0 / 20%)",
        border: "none",
        "z-index": "3"
      };
    }

    /**
     * .oogy-cone-jumbotron h1
     */
    get coneJumbotronH1(): ConeStyle {
      return {
        // "z-index": "1",
        // position: "absolute",
        // bottom: "54px",
        margin: "0px",
        "z-index": "3"
      };
    }

    /**
     * .oogy-cone-jumbotron p
     */
    get coneJumbotronP(): ConeStyle {
      return {
        // "z-index": "1",
        // position: "absolute",
        // bottom: "38px",
        margin: "0px",
        "white-space": "pre-line",
        "z-index": "3"
      };
    }

    /**
     * .oogy-cone-alignable-box
     */
    get coneAlignableBox(): ConeStyle {
      return {
        "z-index": "1",
        position: "relative", // is overriden by .style logic below
        width: "calc(100% - 140px)",
        height: "calc(100% - 100px)",
        display: "flex",
        "flex-direction": "column",
        "min-width": "620px",
        "text-shadow": "-1px 2px 3px rgba(0,0,0,0.2)",
      };
    }

    /**
     * .oogy-cone-list
     */
    get coneList(): ConeStyle {
      return {
        position: "relative",
        padding: "20px 20px",
        "max-width": "100%",
        "min-width": "660px",
        // "aspect-ratio": "1920/1080",
        display: "flex",
        "flex-direction": "column",
        "align-items": "center",
        "justify-content": "center",
        "border-radius": "12px",
        background: "rgba(0,0,0,0.05)",
        "box-shadow": "inset 0px 0px 10px 0px rgb(0 0 0 / 20%)",
        animation: "fadeIn 0.6s ease-out",
      };
    }

    /**
     * .oogy-cone-list-item
     */
    get coneListItem(): ConeStyle {
      return {
        // "z-index": "1",
        // position: "absolute",
        // bottom: "38px",
        // width: "100%",
        "min-height": "45px",
        "min-width": "120px",
        padding: "20px",
        "box-shadow": "0px 2px 3px 2px rgb(0 0 0 / 20%)",
        margin: "10px 0px",
        "border-top-left-radius": "12px",
        "border-bottom-left-radius": "12px",
        "border-bottom-right-radius": "12px",
        cursor: "pointer",
        "background-color": this.reference.color,
        display: "flex",
        "align-items": "center",
        "justify-content": "center",
        "font-size": "20px",
        "z-index": "3"
      };
    }
    /**
     * .oogy-cone-list a
     */
    get coneListA(): ConeStyle {
      return {
        // "z-index": "1",
        // position: "absolute",
        // bottom: "38px",
        margin: "0px",
        "white-space": "pre",
        padding: "20px",
        color: this.reference.color,
        "background-color": this.reference.background,
        "text-decoration": "none",
        "text-shadow": `-1px -1px 24px ${this.reference.color}`,
        border: `2px solid ${this.reference.background}`,
        "border-top-left-radius": "12px",
        "border-bottom-left-radius": "12px",
        "border-bottom-right-radius": "12px",
        "z-index": "3"
      };
    }
  }

  /**
   * Wrapper for any class names that are used in more than one place to prevent misuse.
   */
  export enum ConeStyleClassName {

    tabBarContainer = "oogy-cone-tab-bar-container",

    /// themeables
    themeableColor = "oogy-cone-themeable-color",
    themeableColorInverse = "oogy-cone-themeable-color-inverse",

    themeableBackground = "oogy-cone-themeable-background",
    themeableBackgroundInverse = "oogy-cone-themeable-background-inverse",

    themeableBorder = "oogy-cone-themeable-border",
    themeableTextShadow = "oogy-cone-themeable-text-shadow",
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

      const template: ConeTemplate =
        typeof options.template === "string"
          ? JSON.parse(options.template)
          : options.template;

      const styleBuilder = new ConeStyleBuilder();

      if (template.style) {
        styleBuilder.reference = template.style;
      }

      const container = new ConeElement();
      container.id = "oogy-cone";
      container.classList = [
        "oogy-cone", // potential area for future schema exposure
        ConeStyleClassName.themeableBackground,
      ];

      container.style = styleBuilder.cone;

      // build tab content container (where the main "body" shows)
      const tabContentContainerElement = new ConeElement();
      tabContentContainerElement.id = "oogy-cone-tab-content-container";
      tabContentContainerElement.classList = [
        "oogy-cone-tab-content-container",
        ConeStyleClassName.themeableBackground,
      ];
      tabContentContainerElement.style = styleBuilder.coneTabContentContainer;
      container.appendChild(tabContentContainerElement);

      // build the tab bar, that shows at the bottom at toggles content elements
      const tabBarContainerElement = new ConeElement();
      tabBarContainerElement.id = ConeStyleClassName.tabBarContainer;
      tabBarContainerElement.classList = [
        ConeStyleClassName.tabBarContainer,
        ConeStyleClassName.themeableBackground,
        // indicates can be changed by a styler-style of tab
      ];
      tabBarContainerElement.style = styleBuilder.coneTabBarContainer;
      container.appendChild(tabBarContainerElement);

      const tabBarElement = this.buildTabBar(template.tabs.length);
      tabBarElement.classList = [
        "oogy-cone-tab-bar",
        // ConeStyleClassName.themeableBackground,
      ];
      tabBarElement.style = styleBuilder.coneTabBar;
      tabBarContainerElement.appendChild(tabBarElement);

      // - build tab bar items for each thing
      const selectedIdx = template.start !== undefined ? template.start : 0;
      let i = 0;

      const baseStyle = template.style
        ? template.style
        : kConeStyleDefaultReference;
      const baseColor = baseStyle.color
        ? baseStyle.color
        : kConeStyleDefaultReference.color;
      const baseBackground = baseStyle.background
        ? baseStyle.background
        : kConeStyleDefaultReference.background;

      for (let tab of template.tabs) {
        if (tab.content.kind === ConeTemplateTabContentKind.styler) {
          const tabItemElement = this.buildTabItem(
            tab.title,
            tab.expanded ? tab.expanded : ""
          );

          tabItemElement.style = styleBuilder.coneTab;

          const stylerColor = tab.content.stylerStyle?.color
            ? tab.content.stylerStyle.color
            : baseColor;
          const stylerBackground = tab.content.stylerStyle?.background
            ? tab.content.stylerStyle.background
            : baseBackground;

          tabItemElement.onclick = `
            const themeableColorEls = document.getElementsByClassName('${ConeStyleClassName.themeableColor}');
            const themeableColorInverseEls = document.getElementsByClassName('${ConeStyleClassName.themeableColorInverse}');

            const themeableBackgroundEls = document.getElementsByClassName('${ConeStyleClassName.themeableBackground}');
            const themeableBackgroundInverseEls = document.getElementsByClassName('${ConeStyleClassName.themeableBackgroundInverse}');

            const themeableBorderEls = document.getElementsByClassName('${ConeStyleClassName.themeableBorder}');
            const themeableTextShadowEls = document.getElementsByClassName('${ConeStyleClassName.themeableTextShadow}');

            if (this.hasAttribute('oogy-cone-selected')) {
              this.removeAttribute('oogy-cone-selected');

              for (let tc of themeableColorEls) { tc.style.color = '${baseColor}'; }
              for (let tc of themeableColorInverseEls) { tc.style.color = '${baseBackground}'; }

              for (let tc of themeableBackgroundEls) { tc.style['background-color'] = '${baseBackground}'; }
              for (let tc of themeableBackgroundInverseEls) { tc.style['background-color'] = '${baseColor}'; }

              for (let tc of themeableBorderEls) { tc.style['border-color'] = '${baseColor}'; }
              for (let tc of themeableTextShadowEls) { tc.style['text-shadow-color'] = '${baseColor}'; }
            } else {
              this.setAttribute('oogy-cone-selected', 'true');

              for (let tc of themeableColorEls) { tc.style.color = '${stylerColor}'; }
              for (let tc of themeableColorInverseEls) { tc.style.color = '${stylerBackground}'; }
                            
              for (let tc of themeableBackgroundEls) { tc.style['background-color'] = '${stylerBackground}'; }
              for (let tc of themeableBackgroundInverseEls) { tc.style['background-color'] = '${stylerColor}'; }

              for (let tc of themeableBorderEls) { tc.style['border-color'] = '${stylerColor}'; }
              for (let tc of themeableTextShadowEls) { tc.style['text-shadow-color'] = '${stylerColor}'; }
            }
          `
            .trim()
            .replace(/\n\s+/g, "");

          tabBarElement.appendChild(tabItemElement);

          i++;
          continue;
        }

        const tabContentElement = this.buildTabContent(
          styleBuilder,
          tab.content
        );

        tabContentElement.classList = [
          "oogy-cone-tab-content",
          ConeStyleClassName.themeableColor,
        ];
        tabContentElement.id = `oogy-cone-tab-content-${i}`;
        tabContentElement.style = styleBuilder.coneTabContent;
        tabContentContainerElement.appendChild(tabContentElement);

        const tabItemElement = this.buildTabItem(
          tab.title,
          tab.expanded ? tab.expanded : ""
        );

        tabItemElement.onclick = `
        for (let el of document.getElementsByClassName('${tabItemElement.classList[0]}')) {
          el.style['background-color'] = '${styleBuilder.reference.background}';
          el.style.color = '${styleBuilder.reference.color}';
        }
        
        this.style['background-color'] = '${styleBuilder.reference.color}';
        this.style.color = '${styleBuilder.reference.background}';

        for (let el of document.getElementsByClassName('${tabContentElement.classList[0]}')) {
          el.style.display = 'none';
        }

        document.getElementById('${tabContentElement.id}').style.display = 'flex';
        `
          .trim()
          .replace(/\n\s+/g, "");

        tabItemElement.style = styleBuilder.coneTab;

        // handle state-based visibility traits
        if (i !== selectedIdx) {
          tabContentElement.style.display = "none";
          // autohide non-selected tabs
        } else {
          tabItemElement.style["background-color"] =
            styleBuilder.reference.color;
          tabItemElement.style.color = styleBuilder.reference.background;
          // visually autoselect 1st tab
        }

        tabBarElement.appendChild(tabItemElement);

        i++;
      }

      // generate final string from the resulting element, which until now
      // was very close if not identical to the in-DOM result (document.createElement)
      const result = container.outerHTML;
      const animationKeyframesHTML = `<style class='oogy-cone-animations'>@keyframes fadeOut { 100% { opacity: 0.2; transform: scale(0.8, 0.8) translate(0, calc(100% + 80px));} } @keyframes fadeIn { 0% { opacity: 0.2; transform: scale(0.8, 0.8) translate(0, calc(100% + 80px)); background: transparent; border-radius: 0px; box-shadow: none; } } @keyframes carousel { 0% { filter: blur(2px) saturate(0%); opacity: 0; } }@keyframes carouselOut { 100% { opacity: 0; filter: saturate(0%); } }</style>`;

      const scaleJS = `
      <img 
        src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=' 
        style='display: none;' 
        onload="
        var cone_onResize = () => {
          const el = document.getElementById('oogy-cone-tab-content-container');
          const tabs = document.getElementsByClassName('oogy-cone-tab-expanded-text');
          const tabBarContainer = document.getElementById('${ConeStyleClassName.tabBarContainer}');

          if (window.innerWidth > 1080) {
            if (el.style.position === 'relative') { return; }
            
            el.style.position = 'relative';
            el.style.width = '100%';
            el.style.height = '100%';
            el.style.left = 'auto';
            el.style.top = 'auto';
            el.style.transform = 'none';

            tabBarContainer.style.width = '100%';
            tabBarContainer.style.height = '';
            tabBarContainer.style.transform = '';
            tabBarContainer.style.left = '';

            for (let tab of tabs) { 
              tab.style.display = '';
            }
          }
          else {
            const scale = Math.min(window.innerWidth/800, window.innerHeight/800);
            el.style.position = 'absolute';
            el.style.width = '800px';
            el.style.height = '800px';
            el.style.left = '50%';
            el.style.top = '50%';
            el.style.transform = 'translate(-50%, -50%) ' + 'scale(' + scale + ')';

            tabBarContainer.style.left = '50%';
            tabBarContainer.style.width = '370px';
            tabBarContainer.style.height = '60px';
            tabBarContainer.style.transform = 'translate(-50%, 0%) ' + 'scale(' + scale + ')';

            for (let tab of tabs) { 
              tab.style.display = 'none';
            }
          }
        };

        cone_onResize();
        setInterval(cone_onResize, 250);
        window.addEventListener('resize', (e) => { 
          cone_onResize();
        });
      " />`
        .trim()
        .replace(/\n\s+/g, "");

      let preloadLinkHTML = "";
      let imgSrcsToPreload = []; // insert <link> preload for all images if exists
      for (let tab of template.tabs) {
        if (
          tab.content.kind === ConeTemplateTabContentKind.styler ||
          !tab.content.elements
        ) {
          continue;
        }

        for (let el of tab.content.elements) {
          if (el.type === "img" && el.src) {
            imgSrcsToPreload.push(el.src);
          }
        }
      }

      if (imgSrcsToPreload.length > 0) {
        preloadLinkHTML = imgSrcsToPreload
          .map((src) => `<link rel='preload' as='image' href='${src}' />`)
          .join("");
      }

      let metaTagString = `<meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'>`;
      // probably will only work if used in complete innerHTML context

      const styleAndResult = `${metaTagString}${preloadLinkHTML}${animationKeyframesHTML}${result}${scaleJS}`;
      return styleAndResult;
    }

    private buildTabBar(size: number): ConeElementInterface {
      const element = new ConeElement();
      element.classList = ["oogy-cone-tab-bar"];
      return element;
    }

    private buildTabItem(
      title: string,
      expanded: string
    ): ConeElementInterface {
      const element = new ConeElement();
      element.classList = [
        "oogy-cone-tab",
        // ConeStyleClassName.themeableBorder,
        // ConeStyleClassName.themeableColor,
        // ConeStyleClassName.themeableTextShadow,
      ];
      element.innerText = title;

      const expandedElement = new ConeElement();
      expandedElement.nodeType = "span";
      expandedElement.classList = ["oogy-cone-tab-expanded-text"];

      if (expanded && expanded.length > 0) {
        expandedElement.innerText = `&nbsp;&nbsp;&nbsp;${expanded}`; // auto add 3 spaces (lol)
      } else {
        expandedElement.innerText = `&nbsp;`;
      }

      element.appendChild(expandedElement);

      return element;
    }

    private buildTabContent(
      styleBuilder: ConeStyleBuilder,
      content: ConeTemplateTabContent
    ): ConeElementInterface {
      const container = new ConeElement();
      container.classList = ["oogy-cone-tab-content"];

      const contentElement = new ConeElement();
      container.appendChild(contentElement);

      const alignableTypes = ["h1", "p", "a"];
      const contentItemElementAlignableBox = new ConeElement(); // holds alignable items
      contentItemElementAlignableBox.classList = ["oogy-cone-alignable-box"];
      contentItemElementAlignableBox.style = styleBuilder.coneAlignableBox;

      switch (content.kind) {
        default:
        case ConeTemplateTabContentKind.jumbotron:
          contentElement.classList = ["oogy-cone-jumbotron"];
          contentElement.style = styleBuilder.coneJumbotron;
          contentItemElementAlignableBox.style["position"] = "absolute";
          break;
        case ConeTemplateTabContentKind.list:
          contentElement.classList = ["oogy-cone-list"];
          contentElement.style = styleBuilder.coneList;
          break;
      }

      // perform alignment if provided
      const contentAlign = !content.align
        ? kConeTemplateTabContentAlignmentDefault
        : content.align;

      let contentAlignParts = contentAlign.split("-");
      if (!contentAlignParts || contentAlignParts.length < 2) {
        contentAlignParts = kConeTemplateTabContentAlignmentDefault.split("-"); // safeguard
      }

      const verticalAlignStr =
        contentAlignParts[0] as ConeTemplateTabContentAlignmentVertical;

      const horizontalAlignStr =
        contentAlignParts[1] as ConeTemplateTabContentAlignmentHorizontal;

      // start with vertical
      switch (verticalAlignStr) {
        case ConeTemplateTabContentAlignmentVertical.top:
          contentItemElementAlignableBox.style["justify-content"] =
            "flex-start";
          break;
        case ConeTemplateTabContentAlignmentVertical.center:
          contentItemElementAlignableBox.style["justify-content"] = "center";
          break;
        default:
        case ConeTemplateTabContentAlignmentVertical.bottom:
          contentItemElementAlignableBox.style["justify-content"] = "flex-end";
          break;
      }

      // then horizontal
      switch (horizontalAlignStr) {
        default:
        case ConeTemplateTabContentAlignmentHorizontal.left:
          contentItemElementAlignableBox.style["text-align"] = "left";
          contentItemElementAlignableBox.style["align-items"] = "flex-start";
          break;
        case ConeTemplateTabContentAlignmentHorizontal.center:
          contentItemElementAlignableBox.style["text-align"] = "center";
          contentItemElementAlignableBox.style["align-items"] = "center";
          break;
        case ConeTemplateTabContentAlignmentHorizontal.right:
          contentItemElementAlignableBox.style["text-align"] = "right";
          contentItemElementAlignableBox.style["align-items"] = "flex-end";
          break;
      }

      contentElement.appendChild(contentItemElementAlignableBox);

      let imgIdx = 0;
      for (let contentItem of content.elements ? content.elements : []) {
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
            contentItemElement.style = styleBuilder.coneJumbotronImg;
            contentItemElement.id = `oogy-cone-img-${imgIdx}`;

            if (imgIdx > 0) {
              // hide and use subsequent img (think jumbotron) elements as carousel/fading 1 at a time
              contentItemElement.style["display"] = "none";
            } else {
              const carouselDuration =
                content.duration !== undefined
                  ? content.duration
                  : kConeTemplateTabContentDurationDefault;

              // set onload script to carousel using parentNode and id
              contentItemElement.onload = `
                const parentNode = this.parentNode;
                if (!parentNode && !parentNode.childNodes) { return; }

                const children = Array.from(parentNode.childNodes).filter(n => n.nodeName === 'IMG');
                if (children.length < 2) { return; }

                var cone_oncarousel = () => {
                  const showingIdx = children.findIndex(c => c.style.display !== 'none');
                  const nextIdx = showingIdx + 1 > children.length - 1 ? 0 : showingIdx + 1;
                  const currEl = children[showingIdx], nextEl = children[nextIdx];

                  currEl.style.animation = 'carouselOut 0.5s ease-out forwards';

                  setTimeout(() => {
                    window.requestAnimationFrame(() => {
                      currEl.style.display = 'none';
                      nextEl.style.animation = 'carousel 1.5s ease-out forwards';
                      nextEl.style.display = '';
                    });
                  }, 500);
                };

                setInterval(() => { window.requestAnimationFrame(cone_oncarousel) }, ${
                  carouselDuration + 500
                });
              `
                .trim()
                .replace(/\n\s+/g, "");
            }

            imgIdx++;
            break;
          case "iframe":
            if (contentItem.src === undefined) {
              break; // unexpected err case here, error understanding template
            }
            contentItemElement.setAttribute("src", contentItem.src!);
            contentItemElement.style = styleBuilder.coneJumbotronIFrame;
            break;
          case "h1":
            contentItemElement.style = styleBuilder.coneJumbotronH1;
            break;
          case "p":
            contentItemElement.style = styleBuilder.coneJumbotronP;
            break;
          case "a":
            if (contentItem.href === undefined) {
              break; // unexpected err case here, error understanding template
            }
            contentItemElement.setAttribute("href", contentItem.href!);
            contentItemElement.style = styleBuilder.coneListA;
            contentItemElement.classList.push(
              ConeStyleClassName.themeableColor,
              ConeStyleClassName.themeableBackground,
              ConeStyleClassName.themeableTextShadow,
              ConeStyleClassName.themeableBorder
            );
            break;
        }

        if (contentItem.text !== undefined) {
          contentItemElement.innerText = contentItem.text;
        }

        let elementToUse = contentItemElement;

        // - if list style, we want to wrap whatever this is in the item class/element
        if (content.kind === ConeTemplateTabContentKind.list) {
          elementToUse = new ConeElement();
          elementToUse.classList = [
            "oogy-cone-list-item",
            ConeStyleClassName.themeableBackgroundInverse,
          ];
          elementToUse.style = styleBuilder.coneListItem;
          elementToUse.appendChild(contentItemElement); // wrap in list item el
        }

        // if alignable, add to box, otherwise, add directly
        if (alignableTypes.includes(contentItem.type)) {
          contentItemElementAlignableBox.appendChild(elementToUse);
        } else {
          contentElement.prepend(elementToUse); // insert before alignable box
        }
      }

      return container;
    }
  }
}
