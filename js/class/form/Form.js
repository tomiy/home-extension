import $DOMElement from "../dom/DOMElement.js";

export default class $Form {
    form;

    makeForm() {
        this.form = new $DOMElement('form');
        return this.form;
    }

    formToArray() {
        let formData = {};
        let formEl = this.form.el;
        for (let i = 0; i < formEl.length; i++) {
            if (formEl[i].name != '' && (formEl[i].type == 'radio' ? formEl[i].checked : true)) {
                formData[formEl[i].name] = formEl[i].value;
            }
        }
        return formData;
    }
}