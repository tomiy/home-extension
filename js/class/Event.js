import $Utils from './Utils.js';

export default class $Event {
    el;

    constructor(el) {
        this.el = el;
    }

    register(name, callback) {
        this.el.addEventListener(name, callback);
    }

    delegate(name, callback, ...matches) {
        this.el.addEventListener(name, (e) => {
            let istarget, target;
            if (e instanceof MouseEvent) {
                target = $Utils.elementsFromPoint(e.clientX, e.clientY).filter(el => el.matches(matches));
                istarget = !!target.length;
            } else {
                target = [e.target];
                istarget = target[0].matches(matches);
            }
            if (istarget) {
                (callback)(target.pop(), e);
            }
            return istarget;
        });
    }
}