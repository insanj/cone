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
            this.style = {};
            this.attributes = {};
            this.children = [];
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
            const tabContentContainerElement = new ConeElement();
            tabContentContainerElement.classList = [
                "oogy-cone-tab-content-container",
            ];
            container.appendChild(tabContentContainerElement);
            const tabBarContainerElement = new ConeElement();
            tabBarContainerElement.classList = ["oogy-cone-tab-bar-container"];
            container.appendChild(tabBarContainerElement);
            const tabBarElement = this.buildTabBar(template.tabs.length);
            tabBarElement.classList = ["oogy-cone-tab-bar"];
            tabBarContainerElement.appendChild(tabBarElement);
            let i = 0;
            for (let tab of template.tabs) {
                const tabContentElement = this.buildTabContent(tab.content);
                tabContentElement.id = `oogy-cone-tab-bar-content-${i}`;
                if (i > 0) {
                    tabContentElement.style.display = "none";
                }
                tabContentContainerElement.appendChild(tabContentElement);
                const tabItemElement = this.buildTabItem(tab.title, `for (let el of document.getElementsByClassName(${tabContentElement.classList[0]})) { el.style.display = 'none'; } document.getElementById(${tabContentElement.id}).style.display = 'block';`);
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
        buildTabItem(title, onclick) {
            const element = new ConeElement();
            element.classList = ["oogy-cone-tab"];
            element.onclick = onclick;
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
