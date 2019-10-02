import $DOMElement from "../dom/DOMElement.js";
import $Event from "../Event.js";

export default class $ContextMenu {
    items;

    constructor() {
        this.items = [{
            label: 'Test',
            callback: () => console.log('test')
        }];
    }

    generate(args) {
        ctxmenu.innerHTML = null;
        this.items.forEach((item) => {
            let itemDOM = new $DOMElement('div')
                .class('ctxmenu-item')
                .data('peventblocker', 1)
                .content(item.label);
            new $Event(itemDOM.el)
                .register('click', () => (item.callback)(args));
            ctxmenu.appendChild(itemDOM.el);
        });
    }
}