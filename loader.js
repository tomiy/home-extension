(async () => {
  var data = localStorage.getItem('json');
  if(!data) var data = await (await fetch('./default.json')).json();

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
      let url = document.createElement('a');

      item.classList.add('item');

      url.href = itemData.url;
      url.innerHTML = itemData.label;
      url.target = '_blank';

      item.appendChild(url);
      items.appendChild(item);
    }

    section.appendChild(items);
    sectionContainer.appendChild(section);
    container.appendChild(sectionContainer);
  }

  let cur = null;
  let mouse = {
    x: 0,
    y: 0
  };
  let items = [...document.querySelectorAll('.drag-item')];

  document.addEventListener('mouseup', e => {
    if (cur) {
      let differentialx = 0;
      let differentialy = 0;

      let curRect = cur.getBoundingClientRect();
      let target =
        fElementsFromPoint(curRect.left + curRect.width / 2, curRect.top + curRect.height / 2)
        .filter(el => el.matches('.drag-container')).pop();
      if (target) {
        differentialx = target.getBoundingClientRect().left - cur.parentNode.getBoundingClientRect().left;
        differentialy = target.getBoundingClientRect().top - cur.parentNode.getBoundingClientRect().top;

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

      let curData = fCurData(cur);
      cur.style.left = Math.max(
        0,
        Math.min(
          curData.pos.left - curData.parent.left - curData.borderCheck.w - differentialx,
          curData.parent.width - curData.pos.width - curData.borderCheck.w * 2
        )
      ) + 'px';
      cur.style.top = Math.max(
        0,
        Math.min(
          curData.pos.top - curData.parent.top - curData.borderCheck.h - differentialy,
          curData.parent.height - curData.pos.height - curData.borderCheck.h * 2
        )
      ) + 'px';

      cur = null;
    }
  });

  document.addEventListener('mousemove', e => {
    if (cur) {
      let curData = fCurData(cur);
      cur.style.left = curData.pos.left - curData.parent.left - curData.borderCheck.w + e.pageX - mouse.x + 'px';
      cur.style.top = curData.pos.top - curData.parent.top - curData.borderCheck.h + e.pageY - mouse.y + 'px';
    }
    mouse.x = e.pageX;
    mouse.y = e.pageY;
  });

  items.forEach(item => {
    item.querySelector('.label').addEventListener('mousedown', e => {
      cur = item;
      target = item.parentNode;
    })
  });
})();

const fCurData = cur => {
  let parent = cur.parentNode.getBoundingClientRect();
  let pos = cur.getBoundingClientRect();
  let clientwh = {
    w: cur.parentNode.clientWidth,
    h: cur.parentNode.clientHeight
  }
  let borderCheck = {
    w: (parent.width - clientwh.w) / 2,
    h: (parent.height - clientwh.h) / 2
  };
  return {
    parent,
    pos,
    borderCheck
  }
};

const fElementsFromPoint = (x, y, l) => {
  let element = document.elementFromPoint(x, y);
  if (element !== l && element !== document.documentElement) {
    element.style['pointerEvents'] = 'none';
    let result = [element].concat(fElementsFromPoint(x, y, element));
    element.style['pointerEvents'] = 'auto';
    return result;
  } else return [];
};