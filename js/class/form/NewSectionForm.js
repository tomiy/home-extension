import $Form from "./Form.js";
import $DOMElement from "../dom/DOMElement.js";
import $SectionParser from "../dom/SectionParser.js";

export default class $NewSectionForm extends $Form {
    generate() {
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

        return this.form;
    }

    submit(app) {
        let formData = this.formToObject();

        if (!formData['section-name'].length) {
            this.errors.content('Cannot have empty name');
            return false;
        }

        app.data.updateObject((data) => {
            //stuff n things
            let sectionData = {
                bind: 'a' + Date.now(),
                label: formData['section-name'],
                color: formData['section-color'].substring(1),
                items: []
            };

            let sectionDOMData = $SectionParser.loadSectionDOM(sectionData);
            //$SectionParser.addOptions(sectionDOMData.section)
            data.sections.push(sectionData);

            return data;
        });
    }
}