export default class $Utils {
    static defaultdata = {
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

    static elementsFromPoint(x, y, l) {
        let e = document.elementFromPoint(x, y);
        if (e !== l && e !== document.documentElement && !e.dataset.peventblocker) {
            e.dataset.pevents = e.style['pointerEvents'];
            e.style['pointerEvents'] = 'none';
            let result = [e].concat($Utils.elementsFromPoint(x, y, e));
            e.style['pointerEvents'] = e.dataset.pevents;
            return result;
        } else return [];
    };

    static jsrgb2array(jsrgb) {
        return jsrgb.substr(4, jsrgb.indexOf(')') - 4).split(',');
    }

    static rgb2hex(rgb) {
        return '#' + $Utils.jsrgb2array(rgb)
            .map((color) => ('0' + parseInt(color).toString(16)).substr(-2))
            .join('');
    }

    static xml2json(xml) {
        let obj = {};

        if (xml.nodeType == 1) {
            if (xml.attributes.length > 0) {
                obj['@attributes'] = {};
                for (let j = 0; j < xml.attributes.length; j++) {
                    let attribute = xml.attributes.item(j);
                    obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
                }
            }
        } else if (xml.nodeType == 3) {
            obj = xml.nodeValue;
        }

        if (xml.hasChildNodes()) {
            for (let i = 0; i < xml.childNodes.length; i++) {
                let item = xml.childNodes.item(i);
                let nodeName = item.nodeName;
                if (typeof(obj[nodeName]) == 'undefined') {
                    obj[nodeName] = $Utils.xml2json(item);
                } else {
                    if (typeof(obj[nodeName].push) == 'undefined') {
                        let old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push($Utils.xml2json(item));
                }
            }
        }
        return obj;
    }

    static rgblum(rgb) {
        if (!rgb) return '#000';
        rgb = $Utils.jsrgb2array(rgb);
        let lrgb = [];
        rgb.forEach(c => {
            let cx = c / 255;
            if (cx <= 0.03928) lrgb.push(cx / 12.92);
            else lrgb.push(Math.pow((cx + 0.055) / 1.055, 2.4));
        });
        let lum = 0.2126 * lrgb[0] + 0.7152 * lrgb[1] + 0.0722 * lrgb[2];
        return lum > 0.179 ? '#000' : '#fff';
    };

    static getNodeIndex(element) {
        return [...element.parentNode.childNodes].indexOf(element);
    }

    static isRightClick(e) {
        return e.which === 3 || e.button === 2;
    }

    static isURL(string) {
        let a = document.createElement('a');
        a.href = string;
        return ((a.host && a.host != window.location.host) || a.protocol == 'file:');
    }

    static isOptionsEnv() {
        return document.scripts[0].getAttribute('env') == 'options';
    }
}