import $Application from './class/Application.js';
import $Event from './class/Event.js';
import $Popup from './class/Popup.js';

const app = new $Application();
const documentEvents = new $Event(document);
const popup = new $Popup();

//get objects from localStorage
app.getData();

//bind main events to app
documentEvents.setBind(app);

//load DOM and move events
documentEvents.register('DOMContentLoaded', app.loadDOM);
documentEvents.delegate('mousedown', app.pickup, '.label');
documentEvents.register('mousemove', app.move);
documentEvents.register('mouseup', app.drop);

documentEvents.register('dragstart', e => e.preventDefault());

//load Popup and option events