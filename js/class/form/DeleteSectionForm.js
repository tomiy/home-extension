import $Form from "./Form.js";
import $SectionParser from "../dom/SectionParser.js";

export default class $DeleteSectionForm extends $Form {
    generate(sectionId) {
        let formObj = {
            header: 'Delete Section?',
            fields: [{
                type: 'hidden',
                name: 'section-id',
                value: sectionId
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