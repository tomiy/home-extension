import $Application from './class/Application.js';
import $Event from './class/Event.js';

const app = new $Application();
app.getData();

const documentEvents = new $Event(document);
documentEvents.setBind(app);

documentEvents.register('DOMContentLoaded', app.loadDOM);
documentEvents.delegate('mousedown', app.pickup, '.label');
documentEvents.register('mousemove', app.move);
documentEvents.register('mouseup', app.drop);