import $Form from "./Form.js";
import $DOMElement from "../dom/DOMElement.js";
import $SectionParser from "../dom/SectionParser.js";

export default class $NewSectionForm extends $Form {
    makeForm() {
        let header = new $DOMElement('header')
            .content('New Section');

        let nameInput = new $DOMElement('input')
            .attribute('id', 'section-name')
            .attribute('name', 'section-name');
        let nameLabel = new $DOMElement('label')
            .attribute('for', 'section-name')
            .content('Name');
        let name = new $DOMElement('div')
            .child(nameLabel)
            .child(nameInput);

        let colorInput = new $DOMElement('input')
            .attribute('type', 'color')
            .attribute('id', 'section-color')
            .attribute('name', 'section-color');
        let colorLabel = new $DOMElement('label')
            .attribute('for', 'section-color')
            .content('Color');
        let color = new $DOMElement('div')
            .child(colorLabel)
            .child(colorInput);

        this.form = new $DOMElement('form')
            .child(header)
            .child(name)
            .child(color);
        //override the stuff
        return this.form;
    }

    submit() {
        let formData = this.newSectionForm.formToArray();
        this.app.data.updateObject((data) => {
            //stuff n things
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