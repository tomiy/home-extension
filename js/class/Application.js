import $JSONObject from './JSONObject.js';
import $DOMElement from './dom/DOMElement.js';
import $SectionParser from './dom/SectionParser.js';
import $Utils from './Utils.js';

export default class $Application {
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

            let sectionDOMData = $SectionParser.loadSectionDOM(sectionData);

            for (let i in sectionData.items) {
                let itemData = sectionData.items[i];
                let item = $SectionParser.createItem(itemData);
                sectionDOMData.items.child(item);
            }

        }
    }

    addSectionTile() {
        let sectionTile = new $DOMElement('div')
            .attribute('id', 'add-section')
            .class('section-container');
        container.appendChild(sectionTile.el);
    }

    pickup(label, e) {
        if ($Utils.isRightClick(e)) return;

        this.initial.x = e.clientX;
        this.initial.y = e.clientY;
        this.cur = label.parentNode;

        this.cur.classList.add('dragged');
    }

    move(e) {
        if (this.cur) {
            let offsetX = e.clientX - this.initial.x;
            let offsetY = e.clientY - this.initial.y;
            this.cur.style.transform = 'translate3d(' + offsetX + 'px, ' + offsetY + 'px, 0)';
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

            this.cur.classList.remove('dragged');
            this.cur.style.transform = null;
            this.cur = null;
        }
    }
}