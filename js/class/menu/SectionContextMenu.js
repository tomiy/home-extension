import $ContextMenu from "./ContextMenu.js";

export default class $SectionContextMenu extends $ContextMenu {
    constructor(popup) {
        super();
        this.items = [{
                label: 'Edit section',
                callback: (sectionlb) => popup.show('editSection', sectionlb[0])
            },
            {
                label: 'Delete section',
                callback: (sectionlb) => popup.show('deleteSection', sectionlb[0].closest('.section-container').id)
            },
            {
                label: 'New item',
                callback: (sectionlb) => popup.show('newItem', sectionlb[0].closest('.section-container').id)
            }
        ];
    }
}