import $Form from "./Form.js";
import $SectionParser from "../dom/SectionParser.js";
import $Utils from "../Utils.js";

export default class $DeleteItemForm extends $Form {
    generate(item) {
        let formObj = {
            header: 'Delete Item?',
            fields: [{
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

        app.data.updateObject((data) => {
            let sectionId = $SectionParser.getSectionId(data, formData['section-id']);

            document
                .getElementById(formData['section-id'])
                .querySelector(`.item:nth-child(${parseInt(formData['item-index']) + 1})`)
                .remove();
            data.sections[sectionId].items.splice(formData['item-index'], 1);

            return data;
        });
    }
}