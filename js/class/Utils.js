export default class $Utils {
    static elementsFromPoint(x, y, l) {
        let element = document.elementFromPoint(x, y);
        if (element !== l && element !== document.documentElement && !element.dataset.peventblocker) {
            element.dataset.pevents = element.style['pointerEvents'];
            element.style['pointerEvents'] = 'none';
            let result = [element].concat($Utils.elementsFromPoint(x, y, element));
            element.style['pointerEvents'] = element.dataset.pevents;
            return result;
        } else return [];
    };

    static rgblum(rgb) {
        if (!rgb) return '#000';
        rgb = rgb.substr(4, rgb.length - 5).split(',');
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

    static isOptionsEnv() {
        return document.scripts[0].getAttribute('env') == 'options';
    }
}