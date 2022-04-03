export var Cone;
(function (Cone) {
    class ConeElement {
        constructor() {
            this.nodeType = "div";
            this.classList = [];
            this.innerText = "";
            this.attributes = {};
        }
        setAttribute(attribute, value) {
            this.attributes[attribute] = value;
        }
        get outerHTML() {
            const tagName = this.nodeType;
            const classStr = this.classList.length < 1 ? '' : ` class="${this.classList.join(" ")}"`;
            const encodedAttrs = Object.keys(this.attributes).map(attr => {
                return ` ${attr}="${this.attributes[attr]}"`;
            });
            const attributesStr = encodedAttrs.join(" ");
            const template = `<${tagName}${classStr}${attributesStr}>${this.innerText}</${tagName}>`;
            return template;
        }
    }
    Cone.ConeElement = ConeElement;
    class ConeBuilder {
        static build(options) {
            return new ConeBuilder().build(options);
        }
        build(options) {
            const element = new ConeElement();
            element.innerText = options.data;
            element.setAttribute("style", "font-size: 22px;");
            const result = element.outerHTML;
            return result;
        }
    }
    Cone.ConeBuilder = ConeBuilder;
})(Cone || (Cone = {}));
