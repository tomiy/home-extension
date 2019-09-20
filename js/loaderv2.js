import $Application from './class/Application.js';
import $Event from './class/Event.js';

const env = document.scripts[0].getAttribute('env');

const app = new $Application(env);
app.getData();

const documentEvents = new $Event(document);
documentEvents.register('DOMContentLoaded', app.loadDOM.bind(app));
documentEvents.delegate('click', (e) => alert('test'), '.drag-container', '.section-container');