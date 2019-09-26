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

    applyBind(callback) {
        if (this.bind) {
            callback = callback.bind(this.bind);
        }
        return callback;
    }

    register(name, callback) {
        this.el.addEventListener(name, this.applyBind(callback));
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
                this.applyBind(callback)(target.pop(), e);
            }
            return istarget;
        });
    }
}