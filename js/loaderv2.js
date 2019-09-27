import $Application from './class/Application.js';
import $Event from './class/Event.js';
import $Popup from './class/Popup.js';

const app = new $Application();
const documentEvents = new $Event(document);
const popupContainer = typeof(overlay) === 'undefined' ? document.createElement('span') : overlay;
const popup = new $Popup(popupContainer);
//get objects from localStorage
app.getData();

//bind main events to app
documentEvents.setBind(app);

documentEvents.register('DOMContentLoaded', () => {
    //load DOM and move events
    app.loadDOM();

    //delegated because indefinite amount of elements
    documentEvents.delegate('mousedown', app.pickup, '.label');
    documentEvents.register('mousemove', app.move);
    documentEvents.register('mouseup', app.drop);

    documentEvents.register('dragstart', e => e.preventDefault());

    //load Popup and option events
    const popupCloseEvent = new $Event(document.querySelector('#popup-close'));
    const addSectionEvent = new $Event(document.querySelector('#add-section'));

    popupCloseEvent.setBind(popup);
    addSectionEvent.setBind(popup);

    documentEvents.register('keydown', e => e.keyCode == 27 && popup.close());
    popupCloseEvent.register('click', popup.close);

    addSectionEvent.register('click', popup.showCreateSection);
});