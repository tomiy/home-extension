import $Form from "./Form.js";
import $Utils from "../Utils.js";
import $SectionParser from "../dom/SectionParser.js";

export default class $EditSectionForm extends $Form {
    generate(sectionlb) {
        let formObj = {
            header: 'Edit Section',
            fields: [{
                    type: 'text',
                    name: 'section-name',
                    label: 'Name',
                    value: sectionlb.innerText
                },
                {
                    type: 'hidden',
                    name: 'section-id',
                    value: sectionlb.closest('.section-container').id
                },
                {
                    type: 'color',
                    name: 'section-color',
                    label: 'Color',
                    value: $Utils.rgb2hex(sectionlb.style.backgroundColor)
                }
            ]
        };

        this.objectToForm(formObj);

        this.reset();

        return this.form;
    }

    submit(app) {
        let formData = this.formToObject();

        if (!formData['section-name'].trim().length) {
            this.errors.content('Cannot have empty name');
            return false;
        }

        app.data.updateObject((data) => {
            let sectionId = $SectionParser.getSectionId(data, formData['section-id']);

            data.sections[sectionId].label = formData['section-name'];
            data.sections[sectionId].color = formData['section-color'].substring(1);

            $SectionParser.updateSectionDOM(data.sections[sectionId]);

            return data;
        });
    }
}