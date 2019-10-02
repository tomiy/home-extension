import $DOMElement from './DOMElement.js';
import $Utils from '../Utils.js';

export default class $SectionParser {
    static loadSectionDOM(sectionData) {
        let items = new $DOMElement('div')
            .class('items');
        let section = $SectionParser.createSection(sectionData)
            .child(items);
        let sectionContainer = new $DOMElement('div')
            .class('drag-container', 'section-container')
            .attribute('id', sectionData.bind)
            .style('order', localStorage.getItem(sectionData.bind))
            .data('order', localStorage.getItem(sectionData.bind))
            .child(section);
        container.appendChild(sectionContainer.el);

        return {
            items: items,
            section: section,
            sectionContainer: sectionContainer
        };
    }

    static createSection(sectionData) {
        let labeltxt = new $DOMElement('span')
            .content(sectionData.label);
        let label = new $DOMElement('div')
            .class('label')
            .child(labeltxt);
        let section = new $DOMElement('div')
            .class('section', 'drag-item')
            .child(label);

        if (!localStorage.getItem(sectionData.bind)) {
            localStorage.setItem(sectionData.bind, parseInt(localStorage.length) + 1);
        }

        if (sectionData.color) label.style('backgroundColor', '#' + sectionData.color);
        label.style('color', $Utils.rgblum(label.el.style.backgroundColor));

        return section;
    }

    static createItem(itemData) {
        let host;
        try {
            host = new URL(itemData.url);
        } catch (e) {
            host = new URL('http://example.com');
        }

        let icon = new $DOMElement('img')
            .data('src', 'https://favicons.githubusercontent.com/' + host.hostname);
        let urltxt = new $DOMElement('span')
            .content(itemData.label);
        let url = new $DOMElement('a')
            .attribute('href', itemData.url)
            .attribute('target', '_blank')
            .child(urltxt);
        let item = new $DOMElement('div')
            .class('item')
            .child(icon)
            .child(url);

        setTimeout(() => item.el.querySelectorAll('img').forEach(image => image.src = image.dataset.src), 0);

        return item;
    }

    static updateSectionDOM(sectionData) {
        let section = document.getElementById(sectionData.bind);
        let label = section.querySelector('.label');
        label.querySelector('span').innerHTML = sectionData.label;
        label.style.backgroundColor = '#' + sectionData.color;
        label.style.color = $Utils.rgblum(label.style.backgroundColor);
    }

    static getSectionId(obj, sectionBind) {
        return Object
            .keys(obj.sections)
            .filter(i => obj.sections[i].bind == sectionBind)[0];
    }

    static getSection(obj, sectionBind) {
        return obj.sections[_sectionid(sectionBind)];
    }
}