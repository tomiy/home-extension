import $Utils from './Utils.js';

export default class $BookmarkParser {
    static parse(file) {
        if (file) {
            let reader = new FileReader();
            let bookmarks = {};
            reader.readAsText(file, 'UTF-8');
            reader.onerror = () => console.error('error reading file');
            reader.onload = e => {
                bookmarks = $BookmarkParser.toJson(e.target.result);
                console.log(bookmarks);
            }
        }
    }

    static toJson(fileData) {
        let bookmarks = {};
        let currentNode = bookmarks;
        let latestNode = bookmarks;
        let idQueue = [];
        let subId = 'a' + Date.now();

        let data = fileData.split('\n');

        data.forEach(line => {
            line = line
                .replace(/(<DT>.+)/g, '$1</DT>')
                .replace(/(<!DOCTYPE.+)/g, '')
                .replace(/(<META.+)/g, '')
                .replace(/<p>/g, '')
                .replace(/<HR>/g, '');

            let str;

            if (line.match(/^<TITLE>(.+)<\/TITLE>$/)) {
                str = line.match(/^<TITLE>(.+)<\/TITLE>$/);
                latestNode = currentNode[str[1]] = {};
                latestNode.id = subId;
            }

            if (/<DL>/.test(line)) {
                const prevNode = currentNode;
                currentNode = latestNode;
                currentNode.prevNode = prevNode;
                currentNode.children = [];
                idQueue.push(subId);
                subId = 0;
            }

            if (/<\/DL>/.test(line)) {
                currentNode = currentNode.prevNode;
                subId = parseInt(idQueue[idQueue.length - 1], 10);
                idQueue.pop();
            }

            if (line.match(/<DT>(<H3.+<\/H3>)<\/DT>/)) {
                str = line.match(/<DT>(<H3.+<\/H3>)<\/DT>/);
                let parser = new DOMParser();
                let xml = parser.parseFromString(str[1], 'text/xml');

                const tmp = $Utils.xml2json(xml);
                currentNode.children.push({
                    addDate: tmp['H3']['@attributes']['ADD_DATE'],
                    lastModified: tmp['H3']['@attributes']['LAST_MODIFIED'],
                    name: tmp['H3']['#text'],
                    type: 'folder',
                    id: `${idQueue.join('-')}-${++subId}`
                });
                latestNode = currentNode.children[currentNode.children.length - 1];
            }

            if (line.match(/<DT>(<A.+<\/A>)<\/DT>/)) {
                str = line.match(/<DT>(<A.+<\/A>)<\/DT>/);
                let parser = new DOMParser();
                let xml = parser.parseFromString(str[1].replace(/&/g, '%26'), 'text/xml');

                const tmp = $Utils.xml2json(xml);
                currentNode.children.push({
                    addDate: tmp['A']['@attributes']['ADD_DATE'],
                    lastModified: tmp['A']['@attributes']['LAST_MODIFIED'],
                    name: tmp['A']['#text'],
                    type: 'bookmark',
                    url: tmp['A']['@attributes']['HREF'],
                    id: `${idQueue.join('-')}-${++subId}`,
                    iconUri: tmp['A']['@attributes']['ICON_URI'],
                    icon: tmp['A']['@attributes']['ICON']
                });
                latestNode = currentNode.children[currentNode.children.length - 1];
            }

            if (line.match(/<DD>(.+)/)) {
                str = line.match(/<DD>(.+)/);
                latestNode.description = str[1];
            }
        });

        return bookmarks;
    }
}