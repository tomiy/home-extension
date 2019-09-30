import $Form from "./Form.js";
import $DOMElement from "../dom/DOMElement.js";

export default class $NewSectionForm extends $Form {
    makeForm() {
        let header = new $DOMElement('header')
            .content('New Section');
        let nameInput = new $DOMElement('input')
            .attribute('id', 'form-name')
            .attribute('name', 'form-name');
        let nameLabel = new $DOMElement('label')
            .attribute('for', 'form-name')
            .content('Name');
        this.form = new $DOMElement('form')
            .child(header)
            .child(nameLabel)
            .child(nameInput);
        //override the stuff
        return this.form;
    }
}