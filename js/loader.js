(async () => {
  let data = localStorage.getItem('json');
  if (!data) data = await (await fetch('./js/default.json')).text();

  data = JSON.parse(data);

  for (let k in data.sections) {
    let sectionData = data.sections[k];
    let sectionContainer = document.createElement('div');
    let section = document.createElement('div');
    let label = document.createElement('div');
    let items = document.createElement('div');


    if (!localStorage.getItem(sectionData.bind)) {
      localStorage.setItem(sectionData.bind, parseInt(localStorage.length) + 1);
    }

    sectionContainer.classList.add('drag-container');
    sectionContainer.classList.add('section-container');
    sectionContainer.id = sectionData.bind;
    sectionContainer.style.order = localStorage.getItem(sectionData.bind);
    sectionContainer.dataset.order = localStorage.getItem(sectionData.bind);

    section.classList.add('section');
    section.classList.add('drag-item');

    label.innerHTML = sectionData.label;
    label.classList.add('label');

    if (sectionData.color) label.style.backgroundColor = `#${sectionData.color}`;

    items.classList.add('items');

    section.appendChild(label);

    for (let i in sectionData.items) {
      let itemData = sectionData.items[i];
      let item = document.createElement('div');
      let icon = document.createElement('img');
      let url = document.createElement('a');
      let host;

      try {
        host = new URL(itemData.url);
      } catch (e) {
        host = new URL('http://example.com');
      }

      item.classList.add('item');

      icon.src = 'https://favicons.githubusercontent.com/' + host.hostname;

      url.href = itemData.url;
      url.innerHTML = itemData.label;
      url.target = '_blank';

      item.appendChild(icon);
      item.appendChild(url);
      items.appendChild(item);
    }

    section.appendChild(items);
    sectionContainer.appendChild(section);
    container.appendChild(sectionContainer);
  }

  let items = [...document.querySelectorAll('.drag-item')];
  let cur = null;
  let initial = {
    x: 0,
    y: 0
  }

  document.addEventListener('mouseup', () => {
    if (cur) {

      let curRect = cur.getBoundingClientRect();
      let target =
        fElementsFromPoint(curRect.left + curRect.width / 2, curRect.top + curRect.height / 2)
          .filter(el => el.matches('.drag-container')).pop();
      if (target) {

        targetId = target.id;

        target.id = cur.parentNode.id;
        cur.parentNode.id = targetId;

        localStorage.setItem(cur.parentNode.id, cur.parentNode.dataset.order);
        localStorage.setItem(target.id, target.dataset.order);

        [...target.children].forEach(el => {
          cur.parentNode.appendChild(el);
        });
        target.appendChild(cur);
      }

      cur.style.transform = null;
      cur.style.zIndex = null;
      cur = null;
    }
  });

  document.addEventListener('mousemove', e => {
    if (cur) {
      offsetX = e.clientX - initial.x;
      offsetY = e.clientY - initial.y;
      cur.style.transform = 'translate3d(' + offsetX + 'px, ' + offsetY + 'px, 0)';
      cur.style.zIndex = '1000';
    }
  });

  items.forEach(item => {
    item.querySelector('.label').addEventListener('mousedown', e => {
      initial.x = e.clientX;
      initial.y = e.clientY;
      cur = item;
    });
  });
})();

const fElementsFromPoint = (x, y, l) => {
  let element = document.elementFromPoint(x, y);
  if (element !== l && element !== document.documentElement) {
    element.style['pointerEvents'] = 'none';
    let result = [element].concat(fElementsFromPoint(x, y, element));
    element.style['pointerEvents'] = 'auto';
    return result;
  } else return [];
};