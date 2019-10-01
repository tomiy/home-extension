import $ContextMenu from "./ContextMenu.js";

export default class $SectionContextMenu extends $ContextMenu {
    constructor(popup) {
        super();
        this.items = [{
            label: 'Edit section',
            callback: (sectionlb) => popup.show('editSection', sectionlb[0].closest('.section-container'))
        }];
    }
}