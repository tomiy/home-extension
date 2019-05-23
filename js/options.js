(async () => {
  let defaultJson = JSON.stringify(await (await fetch('./js/default.json')).json(), null, 2);

  if (!localStorage.getItem('json')) {
    localStorage.setItem('json', defaultJson);
    jsoneditor.value = defaultJson;
  } else jsoneditor.value = localStorage.getItem('json');

  jsoneditor.addEventListener('change', function () {
    try {
      JSON.parse(jsoneditor.value);
      localStorage.setItem('json', jsoneditor.value);
      jsoneditor.style.backgroundColor = 'transparent';

      previewer.contentWindow.location.reload();
    } catch (e) {
      jsoneditor.style.backgroundColor = '#dbc';
    }
  });

  storagereset.addEventListener('click', function () {
    let backupJson = localStorage.getItem('json');
    localStorage.clear();
    localStorage.setItem('json', backupJson);
    previewer.contentWindow.location.reload();
  });

  newsection.addEventListener('click', function () {
    let json = JSON.parse(localStorage.getItem('json'));
    json.sections.push({
      bind: 'changeit',
      label: 'Change it',
      items: [{
        label: 'Example item',
        url: 'example.com'
      }]
    });
    jsoneditor.value = JSON.stringify(json, null, 2);
    localStorage.setItem('json', JSON.stringify(json));

    previewer.contentWindow.location.reload();
  });
})();