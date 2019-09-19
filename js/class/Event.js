export default class $Event {
    el;

    constructor(el) {
        this.el = el;
    }

    register(name, callback, bind) {
        this.el.addEventListener(name, callback);
    }
}