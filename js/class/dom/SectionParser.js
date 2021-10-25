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

    static getURLWithFallback(urlInput) {
        let url;
        try {
            url = new URL(urlInput);
            if (!url.hostname) {
                throw new Throwable();
            }
        } catch (e) {
            url = new URL('http://example.com');
        }
        return url;
    }

    static createItem(itemData) {
        let host = $SectionParser.getURLWithFallback(itemData.url);

        let icon = new $DOMElement('img')
            .attribute('loading', 'lazy')
            .attribute('src', 'https://www.google.com/s2/favicons?domain=' + host.hostname);
        let urltxt = new $DOMElement('span')
            .content(itemData.label);
        let url = new $DOMElement('a')
            .attribute('href', itemData.url)
            .child(urltxt);
        let item = new $DOMElement('div')
            .class('item')
            .child(icon)
            .child(url);

        return item;
    }

    static updateSectionDOM(sectionData) {
        let label = document.querySelector('#' + sectionData.bind + ' .label');
        label.querySelector('span').innerHTML = sectionData.label;
        label.style.backgroundColor = '#' + sectionData.color;
        label.style.color = $Utils.rgblum(label.style.backgroundColor);
    }

    static updateItemDOM(sectionData, itemIndex) {
        let itemData = sectionData.items[itemIndex];
        let itemDOMIndex = parseInt(itemIndex) + 1;
        let item = document
            .getElementById(sectionData.bind)
            .querySelector('.item:nth-child(' + itemDOMIndex + ')');
        item.querySelector('a span').innerHTML = itemData.label;
        let link = item.querySelector('a');
        link.href = itemData.url;
        let host = $SectionParser.getURLWithFallback(itemData.url);
        item.querySelector('img').src = 'https://www.google.com/s2/favicons?domain=' + host.hostname;
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