import $DOMElement from "./DOMElement.js";

export default class $Popup {
    popup;

    constructor() {
        this.popup = new $DOMElement('div');
        container.appendChild(this.popup.el);
    }

    show(el) {
        overlay.style.opacity = 1;
        this.popup.el.innerHTML = this.loadPopup(el);
    }

    close() {
        this.popup.el.innerHTML = null;
        overlay.style.opacity = 0;
    }

    loadPopup(el) {
        let contents = null;
        //stuff depending on el
        return contents;
    }
}