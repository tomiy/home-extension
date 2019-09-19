export default class $DOMElement {
    el;

    constructor(tag) {
        this.el = document.createElement(tag);
    }

    class(...classes) {
        this.el.classList.add(...classes);
        return this;
    }

    id(id) {
        this.el.id = id;
        return this;
    }

    style(key, value) {
        this.el.style[key] = value;
        return this;
    }

    data(key, value) {
        this.el.dataset[key] = value;
        return this;
    }

    child(DOMElement) {
        this.el.appendChild(DOMElement.element);
    }
}