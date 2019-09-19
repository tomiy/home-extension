import $JSONObject from './JSONObject.js';
import $DOMElement from './DOMElement.js';
import $SectionParser from './SectionParser.js';

export default class $Application {
    env;
    data;
    defaultdata = {
        sections: [{
            color: '123',
            bind: 'a' + Date.now(),
            label: 'Example section',
            items: [{
                label: 'Example item',
                url: 'example.com'
            }]
        }]
    };

    constructor(env) {
        this.env = env;
    }

    getData() {
        let JSONdata = localStorage.getItem('json');
        if (!JSONdata) {
            this.data = $JSONObject.fromObject(this.defaultdata);
        } else {
            this.data = $JSONObject.fromJSON(JSONdata);
        }

        this.data.setPostCallback(this.updateStorage);
    }

    updateStorage(json, object) {
        localStorage.setItem('json', json);
    }

    loadDOM() {
        let data = this.data.object;
        for (let k in data.sections) {
            let sectionData = data.sections[k];
            let bind = sectionData.bind;
            let sectionContainer = new $DOMElement('div')
                .class('drag-container', 'section-container')
                .attribute('id', bind)
                .style('order', localStorage.getItem(bind))
                .data('order', bind);
            let section = $SectionParser.createSection(sectionData); //TODO: create section
            let items = new $DOMElement('div')
                .class('items');

            for (let i in sectionData.items) {
                let itemData = sectionData.items[i];
                let item = $SectionParser.createItem(itemData); //TODO: create item
                items.child(item);
            }

            section.child(items);
            sectionContainer.child(section);
            container.appendChild(sectionContainer.el);
        }
    }
}