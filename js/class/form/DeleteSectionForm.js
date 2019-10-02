import $Form from "./Form.js";
import $Utils from "../Utils.js";
import $SectionParser from "../dom/SectionParser.js";

export default class $DeleteSectionForm extends $Form {
    generate(section) {
        let formObj = {
            header: 'Delete Section?',
            fields: [{
                type: 'hidden',
                name: 'section-id',
                label: null,
                value: section.id
            }]
        };

        this.objectToForm(formObj);

        this.reset();

        return this.form;
    }

    submit(app) {
        let formData = this.formToObject();

        app.data.updateObject((data) => {
            let sectionId = $SectionParser.getSectionId(data, formData['section-id']);

            document.querySelector(`#${formData['section-id']}`).remove();
            data.sections.splice(sectionId, 1);

            return data;
        });
    }
}