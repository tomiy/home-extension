import $DOMElement from "../dom/DOMElement.js";
import $NewSectionForm from "./NewSectionForm.js";
import $EditSectionForm from "./EditSectionForm.js";

export default class $Popup {
    app;
    popup;
    opened = false;
    submitCallback;
    forms;

    constructor(app) {
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
        overlay.appendChild(popupContainer.el);

        //init forms
        this.forms = {
            'newSection': new $NewSectionForm(),
            'editSection': new $EditSectionForm()
        };
    }

    isOpened() {
        return this.opened;
    }

    show(formKey, args) {
        if (this.isOpened()) return;
        let form = this.forms[formKey];
        this.popup.child(form.generate(args));
        this.submitCallback = form.submit.bind(form);
        this.opened = true;
        overlay.style.pointerEvents = 'all';
        overlay.style.opacity = 1;
    }

    close() {
        this.popup.content(null);
        overlay.style.opacity = 0;
        overlay.style.pointerEvents = 'none';
        this.opened = false;
    }

    submit() {
        if (!this.submitCallback) return;
        if ((this.submitCallback)(this.app) !== false) {
            this.close();
        }
    }
}