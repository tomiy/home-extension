export default class $DOMElement {
    element;

    constructor(tag) {
        this.element = document.createElement(tag);
    }

    class(...classes) {
        this.element.classList.add(...classes);
        return this;
    }

    id(id) {
        this.element.id = id;
        return this;
    }

    style(key, value) {
        this.element.style[key] = value;
        return this;
    }

    data(key, value) {
        this.element.dataset[key] = value;
        return this;
    }
}