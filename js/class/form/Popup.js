import $DOMElement from "../dom/DOMElement.js";
import $NewSectionForm from "./NewSectionForm.js";

export default class $Popup {
    app;
    popup;
    overlay;
    opened = false;
    submitCallback;

    //forms
    newSectionForm;

    constructor(app, overlay) {
        this.app = app; //to update the JSONObject

        let closebtn = new $DOMElement('span')
            .attribute('id', 'popup-close');
        let submitbtn = new $DOMElement('span')
            .attribute('id', 'popup-submit');
        this.popup = new $DOMElement('span')
            .attribute('id', 'popup-content');
        let popupContainer = new $DOMElement('div')
            .attribute('id', 'popup')
            .child(closebtn)
            .child(this.popup)
            .child(submitbtn);
        this.overlay = overlay;
        this.overlay.appendChild(popupContainer.el);

        //init forms
        this.newSectionForm = new $NewSectionForm();
    }

    isOpened() {
        return this.opened;
    }

    show() {
        if (this.isOpened()) return;
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

    submit() {
        if (!this.submitCallback) return;
        if ((this.submitCallback)(this.app) !== false) {
            this.close();
        }
    }

    //popup functions
    //------------------------
    showCreateSection() {
        this.popup.child(this.newSectionForm.generate());
        this.submitCallback = this.newSectionForm.submit.bind(this.newSectionForm);
        this.show();
    }
}