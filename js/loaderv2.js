import $Application from './class/Application.js';
import $Event from './class/Event.js';
import $Popup from './class/form/Popup.js';
import $Utils from './class/Utils.js';
import $Menu from "./class/menu/Menu.js";

const app = new $Application();
const documentEvents = new $Event(document);

//get objects from localStorage
app.getData();

documentEvents.register('DOMContentLoaded', () => {
    //load DOM and move events
    app.loadDOM();

    //delegated because indefinite amount of elements
    documentEvents.delegate('mousedown', (label, e) => app.pickup(label, e), '.label');
    documentEvents.register('mousemove', e => app.move(e));
    documentEvents.register('mouseup', () => app.drop());

    documentEvents.register('dragstart', e => e.preventDefault());

    //load Popup and option events
    if ($Utils.isOptionsEnv()) {
        const popup = new $Popup(app);
        const menu = new $Menu(popup);

        app.addSectionTile();

        const addSectionEvent = new $Event(document.querySelector('#add-section'));
        const popupCloseEvent = new $Event(document.querySelector('#popup-close'));
        const popupSubmitEvent = new $Event(document.querySelector('#popup-submit'));

        //popup default events
        popupCloseEvent.register('click', () => popup.close());
        popupSubmitEvent.register('click', () => popup.submit());
        documentEvents.register('keydown', e => e.keyCode == 27 && popup.close());

        //menu default events
        documentEvents.register('click', () => menu.close());

        //popup events
        addSectionEvent.register('click', () => popup.show('newSection'));

        //menu events
        documentEvents.delegate('contextmenu', (label, e) => menu.open(e, 'section', label), '.label');
        documentEvents.delegate('contextmenu', (item, e) => menu.open(e, 'item', item), '.item');
    }
});