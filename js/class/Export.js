import $Utils from './Utils.js';

export default class $Export {
    static export () {
        let JSONdata = localStorage.getItem('json') || JSON.stringify($Utils.defaultdata);
        this.download(JSONdata);
    }

    static download(json) {
        let downloadLink = document.createElement("a");
        downloadLink.download = "export.json";
        let data = new Blob([json], { type: "application/json" });
        let url = URL.createObjectURL(data);
        downloadLink.href = url;
        downloadLink.click();
        URL.revokeObjectURL(url);
    }
}