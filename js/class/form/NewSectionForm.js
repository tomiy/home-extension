import $Form from "./Form.js";
import $SectionParser from "../dom/SectionParser.js";

export default class $NewSectionForm extends $Form {
    generate() {
        if (!this.form) {
            let formObj = {
                header: 'New Section',
                fields: [{
                        type: 'text',
                        name: 'section-name',
                        label: 'Name'
                    },
                    {
                        type: 'color',
                        name: 'section-color',
                        label: 'Color'
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

        if (!formData['section-name'].trim().length) {
            this.errors.content('Cannot have empty name');
            return false;
        }

        app.data.updateObject((data) => {
            let sectionData = {
                bind: 'a' + Date.now(),
                label: formData['section-name'],
                color: formData['section-color'].substring(1),
                items: []
            };

            $SectionParser.loadSectionDOM(sectionData);
            data.sections.push(sectionData);

            return data;
        });
    }
}