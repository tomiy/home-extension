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
    element.dataset.pevents = element.style['pointerEvents'];
    element.style['pointerEvents'] = 'none';
    let result = [element].concat(elementsFromPoint(x, y, element));
    element.style['pointerEvents'] = element.dataset.pevents;
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

const classpresent = (el, classes) => {
  let classpresent = false;
  classes.forEach(c => {
    if(el.matches(`.${c}`)) {
      classpresent = true;
    }
  });
  return classpresent;
}

const delegate = (ev, classes, callback) => {
  let istarget, target;
  if(ev instanceof MouseEvent) {
    target = elementsFromPoint(ev.clientX, ev.clientY).filter(el => {
      return classpresent(el, classes);
    });
    istarget = !!target.length;
  } else {
    target = [ev.target];
    istarget = classpresent(target[0], classes);
  }
  if(istarget) {
    callback(target.pop(), ev);
  }
  return istarget;
};

const _sectionid = sectionname => Object.keys(data.sections).filter(i => data.sections[i].bind == sectionname)[0];
const _section = sectionname => data.sections[_sectionid(sectionname)];

const createitem = itemdata => {
  let item = document.createElement('div');
  let icon = document.createElement('img');
  let url = document.createElement('a');
  let urltxt = document.createElement('span');
  let urldel = document.createElement('span');
  let host;

  try {
    host = new URL(itemdata.url);
  } catch (e) {
    host = new URL('http://example.com');
  }

  item.classList.add('item');

  icon.src = 'https://favicons.githubusercontent.com/' + host.hostname;

  url.href = itemdata.url;
  url.target = '_blank';

  if (env == "options") {
    urltxt.contentEditable = true;
    urltxt.classList.add('editabletxt');
    urltxt.classList.add('editabletxt-item');
    
    urldel.classList.add('delete');
    urldel.classList.add('delete-item');
    
    url.appendChild(urldel);
  }
  
  urltxt.innerHTML = itemdata.label;
  url.appendChild(urltxt);
  
  item.appendChild(icon);
  item.appendChild(url);
  
  return item;
};

const createsection = sectiondata => {
  let section = document.createElement('div');
  
  let label = document.createElement('div');
  let labeltxt = document.createElement('span');
  let labeldel = document.createElement('span');
  let labeladd = document.createElement('span');
  
  if (!localStorage.getItem(sectiondata.bind)) {
    localStorage.setItem(sectiondata.bind, parseInt(localStorage.length) + 1);
  }
  
  section.classList.add('section');
  section.classList.add('drag-item');
  
  label.classList.add('label');
  
  if (sectiondata.color) label.style.backgroundColor = `#${sectiondata.color}`;
  label.style.color = rgblum(label.style.backgroundColor);
  
  if (env == "options") {
    labeltxt.contentEditable = true;
    labeltxt.classList.add('editabletxt');
    labeltxt.classList.add('editabletxt-section');
    
    labeldel.classList.add('delete');
    labeldel.classList.add('delete-section');
    label.appendChild(labeldel);
    
    labeladd.classList.add('add');
    labeladd.classList.add('add-section');
    labeladd.addEventListener('click', e => {
      //add
    });
    label.appendChild(labeladd);
  }
  
  labeltxt.innerHTML = sectiondata.label;
  label.appendChild(labeltxt);

  section.appendChild(label);
  
  return section;
};

const load = () => {
  data = localStorage.getItem('json');
  if (!data) data = defaultdata;

  data = JSON.parse(data);

  for (let k in data.sections) {
    let sectiondata = data.sections[k];

    let sectionContainer = document.createElement('div');
    let section = createsection(sectiondata);
    let items = document.createElement('div');

    sectionContainer.classList.add('drag-container');
    sectionContainer.classList.add('section-container');
    sectionContainer.id = sectiondata.bind;
    sectionContainer.style.order = localStorage.getItem(sectiondata.bind);
    sectionContainer.dataset.order = localStorage.getItem(sectiondata.bind);

    items.classList.add('items');

    for (let i in sectiondata.items) {
      let itemdata = sectiondata.items[i];
      item = createitem(itemdata);
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
  };

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
    if(delegate(e, ['editabletxt-section', 'delete-section', 'add-section'], (el, e) => e.stopPropagation())) return;
    delegate(e, ['label'], (label, e) => {
      initial.x = e.clientX;
      initial.y = e.clientY;
      cur = label.parentNode;
    });
  });

  document.addEventListener('click', e => {
    delegate(e, ['editabletxt-item', 'delete-item', 'add-item'], (el, e) => e.preventDefault());
    delegate(e, ['delete'], (el, e) => {
      if (confirm("Are you sure you want to delete?")) {
        let sectionname = el.closest('.section-container').id, itemindex;
        let sectionid = _sectionid(sectionname);
        if (!!el.closest('.item')) {
          itemindex = getNodeIndex(e.target.closest('.item'));
          document.querySelector(`#${sectionname} .item:nth-child(${itemindex+1})`).remove();
          data.sections[sectionid].items.splice(itemindex, 1);
        } else {
          document.querySelector(`#${sectionname}`).remove();
          data.sections.splice(sectionid, 1);
        }
        
        localStorage.setItem('json', JSON.stringify(data));
      }
    });
  });

  document.addEventListener('focusin', e => {
    delegate(e, ['editabletxt'], (el, e) => el.dataset.old = el.innerHTML);
  });

  document.addEventListener('focusout', e => {
    delegate(e, ['editabletxt'], (el, e) => {
      if (el.dataset.old != el.innerHTML) {
        let sectionid = el.closest('.section-container').id, itemindex;
        if (!!el.closest('.item')) {
          itemindex = getNodeIndex(el.closest('.item'));
          _section(sectionid).items[itemindex].label = el.innerHTML;
        } else {
          _section(sectionid).label = el.innerHTML;
        }
    
        localStorage.setItem('json', JSON.stringify(data));
      }
    });
  });
};

document.addEventListener('DOMContentLoaded', load);