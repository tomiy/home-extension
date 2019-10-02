import $ContextMenu from "./ContextMenu.js";

export default class $ItemContextMenu extends $ContextMenu {
    constructor(popup) {
        super();
        this.items = [{
                label: 'Edit item',
                callback: (item) => popup.show('editItem', item[0])
            },
            {
                label: 'Delete item',
                callback: (item) => popup.show('deleteItem', item[0])
            }
        ];
    }
}