import $DOMElement from "../dom/DOMElement.js";
import $NewSectionForm from "./NewSectionForm.js";

export default class $Popup {
    app;
    popup;
    overlay;
    opened = false;

    //forms
    newSectionForm;

    constructor(app, overlay) {
        this.app = app; //to update the JSONObject

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

        //init forms
        this.newSectionForm = new $NewSectionForm();
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
        this.popup.child(this.newSectionForm.makeForm());
        this.show();
    }

    submitCreateSection() {
        let formData = this.newSectionForm.formToArray();
        this.app.data.updateJson((json) => {
            //stuff n things
            return json;
        });
    }
}