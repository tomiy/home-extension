import $SectionContextMenu from "./SectionContextMenu.js";
import $ItemContextMenu from "./ItemContextMenu.js";

export default class $Menu {
    popup;

    constructor(popup) {
        this.popup = popup;

        this.menus = {
            'section': new $SectionContextMenu(popup),
            'item': new $ItemContextMenu(popup)
        }
    }

    open(e, menuKey, ...args) {
        e.preventDefault();
        this.close();
        let menu = this.menus[menuKey];
        menu.generate(args);
        ctxmenu.style.left = e.clientX + 'px';
        ctxmenu.style.top = e.clientY + 'px';
        ctxmenu.classList.add('shown');
    }

    close() {
        ctxmenu.classList.remove('shown');
    }
}