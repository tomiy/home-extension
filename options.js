(async () => {
  var defaultJson = JSON.stringify(await (await fetch('./default.json')).json(), null, 2);

  if (!localStorage.getItem('json')) {
    localStorage.setItem('json', defaultJson);
    jsoneditor.value = defaultJson;
  } else jsoneditor.value = localStorage.getItem('json');

  jsoneditor.addEventListener('change', function () {
    try {
      JSON.parse(jsoneditor.value);
      localStorage.setItem('json', jsoneditor.value);
      jsoneditor.style.backgroundColor = 'transparent';
    } catch (e) {
      jsoneditor.style.backgroundColor = 'red';
    }
  });

  storagereset.addEventListener('click', function () {
    var backupJson = localStorage.getItem('json');
    localStorage.clear();
    localStorage.setItem('json', backupJson);
  });
})();