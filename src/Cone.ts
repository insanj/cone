/**
 * cone 
 * 🍦 vanilla js static pwa generator, built in ts for oogy: can you help 
 * github.com/insanj/cone
 * (c) 2022 Julian Weiss
 */
export module Cone {

  /**
   * Wrapped options for building a full website within the ConeBuilder.
   * @see ConeBuilderInterface
   */
  export type ConeBuilderBuildOptions = {

    /**
     * UTF-8 data, usually lifted from a file (in the example app, this is `example.cone` which is easy to read JSON).
     */
    data: string;

  }

  /**
   * Represents the singleton/class version of the ConeBuilder, a great way to get started on generating an entire website in one go.
   */
  export interface ConeBuilderInterface {

    build(options: ConeBuilderBuildOptions): string;

  }

  // export type ConeBuilderReturnable = string | HTMLElement;

  /**
   * Simulates all the necessary 'document' methods and properties so we can run in a Node.js or browser environment.
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
     * HTML attributes to assign when generating this element
     * @param attribute Attribute name, such as `"style"`
     * @param value Attribute value, such as `"font-size: 12px;""`
     */
    setAttribute(attribute: string, value: string): void;

  }

  export class ConeElement implements ConeElementInterface {

    nodeType: string = "div";

    classList: string[] = [];

    innerText: string = "";

    private attributes: Record<string, string> = {};

    setAttribute(attribute: string, value: string): void {
      this.attributes[attribute] = value;
    }

    get outerHTML(): string {

      const tagName = this.nodeType;
      const classStr = this.classList.length < 1 ? '' : ` class="${this.classList.join(" ")}"`;      
      
      const encodedAttrs = Object.keys(this.attributes).map(attr => {
        return ` ${attr}="${this.attributes[attr]}"`
      });
      const attributesStr = encodedAttrs.join(" ");

      const template = `<${tagName}${classStr}${attributesStr}>${this.innerText}</${tagName}>`;

      return template;

    }

  }

  export class ConeBuilder implements ConeBuilderInterface {

    static build(options: ConeBuilderBuildOptions): string {     
      return new ConeBuilder().build(options);
    }

    build(options: ConeBuilderBuildOptions): string {
     
      const element = new ConeElement();

      element.innerText = options.data;

      const result = element.outerHTML;

      return result;

    }  

  }

}