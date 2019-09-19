import $JSONObject from './JSONObject.js';

export default class $Application {
    data;
    defaultdata = {
        sections: [{
            color: '123',
            bind: 'a' + Date.now(),
            label: 'Example section',
            items: [{
                label: 'Example item',
                url: 'example.com'
            }]
        }]
    };

    getData() {
        let JSONdata = localStorage.getItem('json');
        if (!JSONdata) {
            this.data = $JSONObject.fromObject(this.defaultdata);
        } else {
            this.data = $JSONObject.fromJSON(JSONdata);
        }

        this.data.setPostCallback(this.updateStorage);
    }

    updateStorage(json, object) {
        localStorage.setItem('json', json);
    }
}