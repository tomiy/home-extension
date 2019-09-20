import $Application from './class/Application.js';
import $Event from './class/Event.js';

const app = new $Application();
app.getData();

const documentEvents = new $Event(document);
documentEvents.register('DOMContentLoaded', app.loadDOM.bind(app));
documentEvents.delegate('mousedown', app.pickup.bind(app), '.label');
documentEvents.register('mousemove', app.move.bind(app));
documentEvents.register('mouseup', app.drop.bind(app));