import $Form from "./Form.js";
import $Utils from "../Utils.js";
import $SectionParser from "../dom/SectionParser.js";

export default class $EditItemForm extends $Form {
    generate(item) {
        let formObj = {
            header: 'Edit Section',
            fields: [{
                    type: 'text',
                    name: 'item-name',
                    label: 'Name',
                    value: item.innerText
                },
                {
                    type: 'text',
                    name: 'item-link',
                    label: 'Link',
                    value: item.querySelector('a').href
                },
                {
                    type: 'hidden',
                    name: 'item-index',
                    value: $Utils.getNodeIndex(item)
                },
                {
                    type: 'hidden',
                    name: 'section-id',
                    value: item.closest('.section-container').id
                }
            ]
        };

        this.objectToForm(formObj);

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

            data.sections[sectionId].items[formData['item-index']].label = formData['item-name'];
            data.sections[sectionId].items[formData['item-index']].url = formData['item-link'];

            $SectionParser.updateItemDOM(data.sections[sectionId], formData['item-index']);

            return data;
        });
    }
}