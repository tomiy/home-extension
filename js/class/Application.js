import $JSONObject from './JSONObject.js';
import $DOMElement from './dom/DOMElement.js';
import $SectionParser from './dom/SectionParser.js';
import $Utils from './Utils.js';

export default class $Application {
    //popup/options
    env;
    //movement data
    cur;
    initial = {
        x: 0,
        y: 0
    };
    //localStorage JSON
    data;
    defaultdata = {
        sections: [{
            color: '123',
            bind: 'a' + Date.now(),
            label: 'Example section',
            items: [{
                label: 'Example item',
                url: 'http://www.example.com'
            }]
        }]
    };

    constructor() {
        this.env = document.scripts[0].getAttribute('env');
    }

    isPopup() {
        return this.env == 'popup';
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

    updateStorage(json) {
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
                .data('order', localStorage.getItem(bind));
            let section = $SectionParser.createSection(sectionData);
            let items = new $DOMElement('div')
                .class('items');

            for (let i in sectionData.items) {
                let itemData = sectionData.items[i];
                let item = $SectionParser.createItem(itemData);
                items.child(item);
            }


            section.child(items);
            sectionContainer.child(section);
            container.appendChild(sectionContainer.el);
        }

        this.addSectionTile(container);
    }

    addSectionTile(container) {
        if (this.isPopup()) return;
        let sectionTile = new $DOMElement('div')
            .attribute('id', 'add-section')
            .class('section-container');
        container.appendChild(sectionTile.el);
    }

    pickup(label, e) {
        this.initial.x = e.clientX;
        this.initial.y = e.clientY;
        this.cur = label.parentNode;

        this.cur.style.boxShadow = "0px 10px 5px 0px rgba(0, 0, 0, 0.5)";
    }

    move(e) {
        if (this.cur) {
            let offsetX = e.clientX - this.initial.x;
            let offsetY = e.clientY - this.initial.y;
            this.cur.style.transform = 'translate3d(' + offsetX + 'px, ' + offsetY + 'px, 0)';
            this.cur.style.zIndex = '1000';
        }
    }

    drop() {
        if (this.cur) {

            let curRect = this.cur.getBoundingClientRect();
            let target = $Utils
                .elementsFromPoint(curRect.left + curRect.width / 2, curRect.top + curRect.height / 2)
                .filter(el => el.matches('.drag-container')).pop();
            if (target) {

                let targetId = target.id;

                target.id = this.cur.parentNode.id;
                this.cur.parentNode.id = targetId;

                localStorage.setItem(this.cur.parentNode.id, this.cur.parentNode.dataset.order);
                localStorage.setItem(target.id, target.dataset.order);

                [...target.children].forEach(el => {
                    this.cur.parentNode.appendChild(el);
                });
                target.appendChild(this.cur);
            }

            this.cur.style.transform = null;
            this.cur.style.zIndex = null;
            this.cur.style.boxShadow = null;
            this.cur = null;
        }
    }
}