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

    reset() {
        if (this.form) {
            this.form.el.reset();
            this.errors.content(null);
        }
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

            if (field.value != null) {
                input.attribute('value', field.value);
            }
            // fix because default value isn't always set and color inputs can't be empty
            if (field.type == 'color' && !field.value) {
                input.el.defaultValue = '#aabbcc';
            }

            let DOMField = new $DOMElement('div');
            if (field.label) {
                let label = new $DOMElement('label')
                    .attribute('for', field.name)
                    .content(field.label);
                DOMField.child(label)
            }
            DOMField.child(input);

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