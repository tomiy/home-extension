import $Form from "./Form.js";
import $DOMElement from "../dom/DOMElement.js";

export default class $NewSectionForm extends $Form {
    makeForm() {
        //override the stuff
        this.form = new $DOMElement('form');
        return this.form;
    }
}