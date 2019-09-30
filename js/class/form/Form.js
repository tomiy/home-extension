import $DOMElement from "../dom/DOMElement.js";

export default class $Form {
    form;
    errors;

    generate() {
        if (!this.form) {
            this.form = new $DOMElement('form');
        }
        return this.form;
    }

    submit() {
        return false;
    }

    objectToForm(formObj) {
        let header = new $DOMElement('header')
            .content(formObj.header);

        this.errors = new $DOMElement('span');
        this.form = new $DOMElement('form')
            .child(header);

        formObj.fields.forEach((field) => {
            let input = new $DOMElement('input')
                .attribute('type', field.type)
                .attribute('id', field.name)
                .attribute('name', field.name);
            let label = new $DOMElement('label')
                .attribute('for', field.name)
                .content(field.label);
            let DOMField = new $DOMElement('div')
                .child(label)
                .child(input);

            this.form.child(DOMField);
        });

        this.form.child(this.errors);
    }

    formToObject() {
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