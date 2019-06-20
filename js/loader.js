var data;

const fElementsFromPoint = (x, y, l) => {
  let element = document.elementFromPoint(x, y);
  if (element !== l && element !== document.documentElement) {
    element.style['pointerEvents'] = 'none';
    let result = [element].concat(fElementsFromPoint(x, y, element));
    element.style['pointerEvents'] = 'auto';
    return result;
  } else return [];
};

const rgblum = (rgb) => {
  if(!rgb) return '#000';
  rgb = rgb.substr(4, rgb.length - 5).split(',');
  let lrgb = [];
  rgb.forEach(c => {
    let cx = c / 255;
    if(cx <= 0.03928) lrgb.push(cx / 12.92);
    else lrgb.push(Math.pow((cx + 0.055) / 1.055, 2.4));
  });
  let lum = 0.2126 * lrgb[0] + 0.7152 * lrgb[1] + 0.0722 * lrgb[2];
  return lum > 0.179 ? '#000': '#fff';
};

const delegate = (element, _class, callback) => {
  if(element.classList.contains(_class)) {
    return callback(element);
  }
};

const getNodeIndex = (element) => [...element.parentNode.childNodes].indexOf(element);

const saveoldtxt = (text) => text.dataset.old = text.innerHTML;
const savetxt = (text) => {
  if(text.dataset.old != text.innerHTML) {
    let sectionid, itemindex;
    section = (sectionid) => data.sections[
      Object.keys(data.sections).filter(i => data.sections[i].bind == sectionid)[0]
    ];
    if(!!text.closest('.item')) {
      sectionid = text.closest('.section-container').id;
      itemindex = getNodeIndex(text.closest('.item'));
      section(sectionid).items[itemindex].label = text.innerHTML;
    } else {
      sectionid = text.closest('.section-container').id;
      section(sectionid).label = text.innerHTML;
    }

    localStorage.setItem('json', JSON.stringify(data));
  }
};

const env = document.currentScript.getAttribute('env');

const load = async () => {
  data = localStorage.getItem('json');
  if (!data) data = await (await fetch('./js/default.json')).text();

  data = JSON.parse(data);

  for (let k in data.sections) {
    let sectionData = data.sections[k];
    let sectionContainer = document.createElement('div');
    let section = document.createElement('div');
    let label = document.createElement('div');
    let labeltxt = document.createElement('span');
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
    
    if(env == "options") {
      labeltxt.contentEditable = true;
      labeltxt.classList.add('editabletxt');
      labeltxt.addEventListener('focus', (e) => saveoldtxt(e.target));
      labeltxt.addEventListener('blur', (e) => savetxt(e.target));
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
      
      if(env == "options") {
        urltxt.contentEditable = true;
        urltxt.classList.add('editabletxt');
        urltxt.addEventListener('focus', (e) => saveoldtxt(e.target));
        urltxt.addEventListener('blur', (e) => savetxt(e.target));
        urltxt.addEventListener('click', (e) => e.preventDefault());
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

  document.addEventListener('mousedown', e => {
    delegate(e.target, 'label', (label) => {
      initial.x = e.clientX;
      initial.y = e.clientY;
      cur = label.parentNode;
    });
  });
};

document.addEventListener('DOMContentLoaded', load);