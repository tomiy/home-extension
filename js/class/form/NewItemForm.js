import $Form from "./Form.js";
import $SectionParser from "../dom/SectionParser.js";
import $Utils from "../Utils.js";

export default class $NewItemForm extends $Form {
    generate(sectionId) {
        if (!this.form) {
            let formObj = {
                header: 'New Item',
                fields: [{
                        type: 'text',
                        name: 'item-name',
                        label: 'Name'
                    },
                    {
                        type: 'text',
                        name: 'item-link',
                        label: 'Link'
                    },
                    {
                        type: 'hidden',
                        name: 'section-id',
                        value: sectionId
                    }
                ]
            };

            this.objectToForm(formObj);
        }

        this.reset();

        return this.form;
    }

    submit(app) {
        let formData = this.formToObject();

        if (!formData['item-name'].trim().length) {
            this.errors.content('Cannot have empty name');
            return false;
        }

        if (!formData['item-link'].trim().length) {
            this.errors.content('Cannot have empty link');
            return false;
        }

        if (!$Utils.isURL(formData['item-link'])) {
            this.errors.content('Link is not a valid URL');
            return false;
        }

        app.data.updateObject((data) => {
            let sectionId = $SectionParser.getSectionId(data, formData['section-id']);
            let itemData = {
                label: formData['item-name'],
                url: formData['item-link']
            };

            document
                .getElementById(formData['section-id'])
                .querySelector('.items')
                .appendChild($SectionParser.createItem(itemData).el);
            data.sections[sectionId].items.push(itemData);

            return data;
        });
    }
}