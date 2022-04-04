export var Cone;
(function (Cone) {
    let ConeTemplateTabContentStyle;
    (function (ConeTemplateTabContentStyle) {
        ConeTemplateTabContentStyle["jumbotron"] = "jumbotron";
    })(ConeTemplateTabContentStyle = Cone.ConeTemplateTabContentStyle || (Cone.ConeTemplateTabContentStyle = {}));
    class ConeElement {
        constructor() {
            this.nodeType = "div";
            this.classList = [];
            this.id = "";
            this.innerText = "";
            this.onclick = "";
            this._style = {};
            this.attributes = {};
            this.children = [];
        }
        get style() {
            return this._style;
        }
        set style(newValue) {
            this._style = Object.assign({}, newValue);
        }
        setAttribute(attribute, value) {
            this.attributes[attribute] = value;
        }
        appendChild(element) {
            this.children.push(element);
        }
        get outerHTML() {
            const tagName = this.nodeType;
            const idStr = this.id.length < 1 ? "" : ` id="${this.id}" `;
            const classStr = this.classList.length < 1 ? "" : ` class="${this.classList.join(" ")}"`;
            const encodedAttrs = Object.keys(this.attributes).map((attr) => {
                return ` ${attr}="${this.attributes[attr]}" `;
            });
            const attributesStr = encodedAttrs.join(" ");
            const childrenStr = this.children.length < 1
                ? ""
                : this.children.map((child) => child.outerHTML).join("");
            const styleKeys = Object.keys(this.style);
            const styleStr = styleKeys.length < 1
                ? ""
                : ` style="${styleKeys
                    .map((key) => `${key}:${this.style[key]};`)
                    .join("")}" `;
            const onclickStr = this.onclick.length < 1 ? "" : ` onclick="${this.onclick}" `;
            const encoded = `<${tagName}${idStr}${classStr}${attributesStr}${styleStr}${onclickStr}>${this.innerText}${childrenStr}</${tagName}>`;
            return encoded;
        }
    }
    Cone.ConeElement = ConeElement;
    class ConeStyleDefault {
    }
    ConeStyleDefault.cone = {
        "font-family": "system-ui",
        position: "absolute",
        top: "0px",
        left: "0px",
        width: "100%",
        height: "100%",
        display: "flex",
        overflow: "hidden",
    };
    ConeStyleDefault.coneTabContentContainer = {
        position: "relative",
        width: "100%",
        height: "100%",
        "overflow-y": "scroll",
    };
    ConeStyleDefault.coneTabContent = {
        color: "#2b154d",
        position: "relative",
        width: "100%",
        "min-height": "calc(100% - 70px)",
        "padding-bottom": "70px",
        display: "flex",
        "align-items": "center",
        "justify-content": "center",
    };
    ConeStyleDefault.coneTabBarContainer = {
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
    ConeStyleDefault.coneTabBar = {
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
    ConeStyleDefault.coneTab = {
        padding: "5px 20px",
        border: "2px solid #2b154d",
        "border-radius": "10px",
        cursor: "pointer",
        color: "#2b154d",
        "white-space": "pre",
    };
    ConeStyleDefault.coneJumbotron = {
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
    ConeStyleDefault.coneJumbotronImg = {
        position: "relative",
        width: "calc(100% - 40px)",
        "max-width": "1080px",
        "min-width": "720px",
        height: "auto",
        "border-radius": "12px",
        "box-shadow": "0px 2px 10px 4px rgb(0 0 0 / 20%)",
    };
    ConeStyleDefault.coneJumbotronH1 = {
        "z-index": "1",
        position: "absolute",
        bottom: "54px",
    };
    ConeStyleDefault.coneJumbotronP = {
        "z-index": "1",
        position: "absolute",
        bottom: "38px",
    };
    Cone.ConeStyleDefault = ConeStyleDefault;
    class ConeBuilder {
        static build(options) {
            return new ConeBuilder().build(options);
        }
        build(options) {
            if (!options ||
                options == null ||
                options == undefined ||
                !options.template ||
                options.template == null ||
                options.template == undefined) {
                return "🍦 cone says: template not provided! I can't do anything";
            }
            const template = JSON.parse(options.template);
            const container = new ConeElement();
            container.classList = [
                "oogy-cone",
            ];
            container.style = ConeStyleDefault.cone;
            const tabContentContainerElement = new ConeElement();
            tabContentContainerElement.classList = [
                "oogy-cone-tab-content-container",
            ];
            tabContentContainerElement.style =
                ConeStyleDefault.coneTabContentContainer;
            container.appendChild(tabContentContainerElement);
            const tabBarContainerElement = new ConeElement();
            tabBarContainerElement.classList = ["oogy-cone-tab-bar-container"];
            tabBarContainerElement.style = ConeStyleDefault.coneTabBarContainer;
            container.appendChild(tabBarContainerElement);
            const tabBarElement = this.buildTabBar(template.tabs.length);
            tabBarElement.classList = ["oogy-cone-tab-bar"];
            tabBarElement.style = ConeStyleDefault.coneTabBar;
            tabBarContainerElement.appendChild(tabBarElement);
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
                if (i > 0) {
                    tabContentElement.style.display = "none";
                }
                else {
                    tabItemElement.style["background-color"] = "#2b154d";
                    tabItemElement.style.color = "#fff";
                }
                tabBarElement.appendChild(tabItemElement);
                i++;
            }
            const result = container.outerHTML;
            return result;
        }
        buildTabBar(size) {
            const element = new ConeElement();
            element.classList = ["oogy-cone-tab-bar"];
            return element;
        }
        buildTabItem(title) {
            const element = new ConeElement();
            element.classList = ["oogy-cone-tab"];
            element.innerText = title;
            return element;
        }
        buildTabContent(content) {
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
                            break;
                        }
                        contentItemElement.setAttribute("src", contentItem.src);
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
    Cone.ConeBuilder = ConeBuilder;
})(Cone || (Cone = {}));
