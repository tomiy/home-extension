export default class $BookmarkParser {
    static import(file){
        if (file) {
            let reader = new FileReader();
            reader.readAsText(file, 'UTF-8');
            reader.onerror = () => console.error('error reading file');

            reader.onload = e => {
                let json = e.target.result;
                localStorage.setItem('json', json);
                location.reload();
            }
        }
    }
}