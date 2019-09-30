import $Application from './class/Application.js';
import $Event from './class/Event.js';
import $Popup from './class/form/Popup.js';
import $Utils from './class/Utils.js';

const app = new $Application();
const documentEvents = new $Event(document);
const popupContainer = typeof(overlay) === 'undefined' ? document.createElement('span') : overlay;
const popup = new $Popup(app, popupContainer);

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
        app.addSectionTile();

        const addSectionEvent = new $Event(document.querySelector('#add-section'));
        const popupCloseEvent = new $Event(document.querySelector('#popup-close'));
        const popupSubmitEvent = new $Event(document.querySelector('#popup-submit'));

        popupCloseEvent.register('click', () => popup.close());
        popupSubmitEvent.register('click', () => popup.submit());
        documentEvents.register('keydown', e => e.keyCode == 27 && popup.close());

        addSectionEvent.register('click', () => popup.showCreateSection());
        documentEvents.delegate('contextmenu', (label, e) => {
            e.preventDefault();
            console.log('Open section context menu from', label.closest('.section'));
            return false;
        }, '.label');
    }
});