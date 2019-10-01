import $ContextMenu from "./ContextMenu.js";

export default class $SectionContextMenu extends $ContextMenu {
    constructor(popup) {
        super();
        this.items = [{
            label: 'Test',
            callback: () => popup.showCreateSection() //placeholder
        }];
    }
}