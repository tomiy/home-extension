import $DOMElement from './class/DOMElement.js';
import $Utils from './class/Utils.js';
import $JSONObject from './class/JSONObject.js';
import $SectionParser from './class/SectionParser.js';
import $Application from './class/Application.js';

let app = new $Application();
app.getData();

app.data.updateObject((data) => {
    let sectionobj = {
        bind: 'a' + Date.now(),
        label: 'New section',
        color: '#abc',
        items: []
    };

    data.sections.push(sectionobj);

    return data;
});

console.log(app);