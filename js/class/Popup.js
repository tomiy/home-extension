import $DOMElement from "./DOMElement.js";

export default class $Popup {
    popup;
    overlay;
    opened = false;

    constructor(overlay) {
        let closebtn = new $DOMElement('span')
            .attribute('id', 'popup-close');
        this.popup = new $DOMElement('span')
            .attribute('id', 'popup-content');
        let popupContainer = new $DOMElement('div')
            .attribute('id', 'popup')
            .child(closebtn)
            .child(this.popup);
        this.overlay = overlay;
        this.overlay.appendChild(popupContainer.el);
    }

    isOpened() {
        return this.opened;
    }

    show() {
        this.opened = true;
        this.overlay.style.pointerEvents = 'all';
        this.overlay.style.opacity = 1;
    }

    close() {
        this.popup.content('');
        this.overlay.style.opacity = 0;
        this.overlay.style.pointerEvents = 'none';
        this.opened = false;
    }

    showCreateSection() {
        if (this.isOpened()) return;
        this.popup.content(
            'test'
        );
        this.show();
    }
}