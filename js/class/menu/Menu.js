import $SectionContextMenu from "./SectionContextMenu.js";

export default class $Menu {
    popup;

    constructor(popup) {
        this.popup = popup;

        this.sectionContextMenu = new $SectionContextMenu(popup);
    }

    open(e) {
        e.preventDefault();
        ctxmenu.style.left = e.clientX + 'px';
        ctxmenu.style.top = e.clientY + 'px';
        ctxmenu.style.boxShadow = '2px 2px 2px 0px rgba(0, 0, 0, 0.5)';
        ctxmenu.style.opacity = 1;
    }

    close() {
        ctxmenu.style.boxShadow = null;
        ctxmenu.style.opacity = 0;
    }

    openSectionContextMenu(label, e) {
        this.close();
        this.sectionContextMenu.generate();
        this.open(e);
    }
}