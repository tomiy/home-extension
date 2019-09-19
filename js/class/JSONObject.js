export default class $JSONObject {
    json;
    object;
    postCallback;

    constructor(json, object) {
        this.json = json;
        this.object = object;
    }

    static fromJSON(json) {
        let object = JSON.parse(json);
        return new $JSONObject(json, object);
    }

    static fromObject(object) {
        let json = JSON.stringify(object);
        return new $JSONObject(json, object);
    }

    updateJson(callback) {
        let json = callback(this.json);
        this.json = json;
        this.object = JSON.parse(json);

        this.doPostCallback();
    }

    updateObject(callback) {
        let object = callback(this.object);
        this.object = object;
        this.json = JSON.stringify(object);

        this.doPostCallback();
    }

    doPostCallback() {
        if (this.postCallback) {
            this.postCallback(this.json, this.object);
        }
    }

    setPostCallback(callback) {
        this.postCallback = callback;
    }
}