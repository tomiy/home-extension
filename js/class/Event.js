import $Utils from './Utils.js';

export default class $Event {
    el;
    bind;

    constructor(el) {
        this.el = el;
    }

    setBind(bind) {
        this.bind = bind;
    }

    register(name, callback) {
        if (this.bind) {
            callback = callback.bind(this.bind);
        }
        this.el.addEventListener(name, callback);
    }

    delegate(name, callback, ...matches) {
        this.el.addEventListener(name, (e) => {
            let istarget, target;
            if (e instanceof MouseEvent) {
                target = $Utils.elementsFromPoint(e.clientX, e.clientY).filter(el => {
                    return el.matches(matches);
                });
                istarget = !!target.length;
            } else {
                target = [e.target];
                istarget = target[0].matches(matches);
            }
            if (istarget) {
                if (this.bind) {
                    callback = callback.bind(this.bind);
                }
                callback(target.pop(), e);
            }
            return istarget;
        });
    }
}