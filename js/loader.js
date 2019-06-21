const env = document.currentScript.getAttribute('env');

var data;
var defaultdata = `{
  "sections": [
    {
      "color": "123",
      "bind": "changeit",
      "label": "Change it",
      "items": [
        {
        "label": "Example item",
        "url": "example.com"
        }
      ]
    }
  ]
}`;

const elementsFromPoint = (x, y, l) => {
  let element = document.elementFromPoint(x, y);
  if (element !== l && element !== document.documentElement) {
    element.style['pointerEvents'] = 'none';
    let result = [element].concat(elementsFromPoint(x, y, element));
    element.style['pointerEvents'] = 'auto';
    return result;
  } else return [];
};

const rgblum = rgb => {
  if (!rgb) return '#000';
  rgb = rgb.substr(4, rgb.length - 5).split(',');
  let lrgb = [];
  rgb.forEach(c => {
    let cx = c / 255;
    if (cx <= 0.03928) lrgb.push(cx / 12.92);
    else lrgb.push(Math.pow((cx + 0.055) / 1.055, 2.4));
  });
  let lum = 0.2126 * lrgb[0] + 0.7152 * lrgb[1] + 0.0722 * lrgb[2];
  return lum > 0.179 ? '#000' : '#fff';
};

const getNodeIndex = element => [...element.parentNode.childNodes].indexOf(element);
const delegate = (ev, _class, callback) => {
  let target = elementsFromPoint(ev.clientX, ev.clientY).filter(el => el.matches(`.${_class}`));
  if (target.length) {
    return callback(target.pop());
  }
};

const _sectionid = sectionname => Object.keys(data.sections).filter(i => data.sections[i].bind == sectionname)[0];
const _section = sectionname => data.sections[_sectionid(sectionname)];

const saveoldtxt = text => text.dataset.old = text.innerHTML;
const savetxt = text => {
  if (text.dataset.old != text.innerHTML) {
    let sectionid = text.closest('.section-container').id, itemindex;
    if (!!text.closest('.item')) {
      itemindex = getNodeIndex(text.closest('.item'));
      _section(sectionid).items[itemindex].label = text.innerHTML;
    } else {
      _section(sectionid).label = text.innerHTML;
    }

    localStorage.setItem('json', JSON.stringify(data));
  }
};

const eldelete = element => {
  if (confirm("Are you sure you want to delete?")) {
    let sectionname = element.closest('.section-container').id, itemindex;
    let sectionid = _sectionid(sectionname);
    if (!!element.closest('.item')) {
      itemindex = getNodeIndex(e.target.closest('.item'));
      document.querySelector(`#${sectionname} .item:nth-child(${itemindex+1})`).remove();
      data.sections[sectionid].items.splice(itemindex, 1);
    } else {
      document.querySelector(`#${sectionname}`).remove();
      data.sections.splice(sectionid, 1);
    }
    
    localStorage.setItem('json', JSON.stringify(data));
  }
};

const load = () => {
  data = localStorage.getItem('json');
  if (!data) data = defaultdata;

  data = JSON.parse(data);

  for (let k in data.sections) {
    let sectionData = data.sections[k];

    let sectionContainer = document.createElement('div');
    let section = document.createElement('div');

    let label = document.createElement('div');
    let labeltxt = document.createElement('span');
    let labeldel = document.createElement('span');

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

    label.classList.add('label');

    if (sectionData.color) label.style.backgroundColor = `#${sectionData.color}`;
    label.style.color = rgblum(label.style.backgroundColor);

    items.classList.add('items');

    if (env == "options") {
      labeltxt.contentEditable = true;
      labeltxt.classList.add('editabletxt');
      labeltxt.addEventListener('focus', e => saveoldtxt(e.target));
      labeltxt.addEventListener('blur', e => savetxt(e.target));

      labeldel.classList.add('delete');
      labeldel.addEventListener('click', e => eldelete(e.target));
      label.appendChild(labeldel);
    }

    labeltxt.innerHTML = sectionData.label;
    label.appendChild(labeltxt);

    section.appendChild(label);

    for (let i in sectionData.items) {
      let itemData = sectionData.items[i];
      let item = document.createElement('div');
      let icon = document.createElement('img');
      let url = document.createElement('a');
      let urltxt = document.createElement('span');
      let urldel = document.createElement('span');
      let host;

      try {
        host = new URL(itemData.url);
      } catch (e) {
        host = new URL('http://example.com');
      }

      item.classList.add('item');

      icon.src = 'https://favicons.githubusercontent.com/' + host.hostname;

      url.href = itemData.url;
      url.target = '_blank';

      if (env == "options") {
        urltxt.contentEditable = true;
        urltxt.classList.add('editabletxt');
        urltxt.addEventListener('focus', e => saveoldtxt(e.target));
        urltxt.addEventListener('blur', e => savetxt(e.target));
        urltxt.addEventListener('click', e => e.preventDefault());
        
        urldel.classList.add('delete');
        urldel.addEventListener('click', e => eldelete(e.target));
        urldel.addEventListener('click', e => e.preventDefault());

        url.appendChild(urldel);
      }

      urltxt.innerHTML = itemData.label;
      url.appendChild(urltxt);

      item.appendChild(icon);
      item.appendChild(url);
      items.appendChild(item);
    }

    section.appendChild(items);
    sectionContainer.appendChild(section);
    container.appendChild(sectionContainer);
  }

  let cur = null;
  let initial = {
    x: 0,
    y: 0
  }

  document.addEventListener('mouseup', e => {
    if (cur) {

      let curRect = cur.getBoundingClientRect();
      let target =
        elementsFromPoint(curRect.left + curRect.width / 2, curRect.top + curRect.height / 2)
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

  document.addEventListener('mousedown', e => {
    delegate(e, 'label', label => {
      initial.x = e.clientX;
      initial.y = e.clientY;
      cur = label.parentNode;
    });
  });
};

document.addEventListener('DOMContentLoaded', load);