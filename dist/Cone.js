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
            const classStr = this.classList.length < 1 ? "" : ` class="${this.classList.join(" ")}"`;
            const encodedAttrs = Object.keys(this.attributes).map((attr) => {
                return ` ${attr}="${this.attributes[attr]}"`;
            });
            const attributesStr = encodedAttrs.join(" ");
            const encoded = `<${tagName}${classStr}${attributesStr}>${this.innerText}</${tagName}>`;
            return encoded;
        }
    }
    Cone.ConeElement = ConeElement;
    class ConeBuilder {
        static build(options) {
            return new ConeBuilder().build(options);
        }
        build(options) {
            const template = JSON.parse(options.data);
            const element = new ConeElement();
            element.innerText = template.title;
            const result = element.outerHTML;
            return result;
        }
    }
    Cone.ConeBuilder = ConeBuilder;
})(Cone || (Cone = {}));
