const W = 20, H = 20;
let tiles = Array(W * H).fill('grass');
let activeTile = 'grass';
let painting = false;
let currentName = '';

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'menu') renderMapList();
}

function newMap() {
  const name = prompt('Nazev mapy:');
  if (!name) return;
  currentName = name;
  tiles = Array(W * H).fill('grass');
  buildGrid();
  document.getElementById('mapName').textContent = name;
  showScreen('editor');
}

function saveMap() {
  localStorage.setItem('map_' + currentName, JSON.stringify(tiles));
  alert('Ulozeno: ' + currentName);
}

function renderMapList() {
  const list = document.getElementById('mapList');
  const keys = Object.keys(localStorage).filter(k => k.startsWith('map_'));
  list.innerHTML = '';

  if (keys.length === 0) {
    list.innerHTML = '<p style="color:#555;font-size:12px">Zadne ulozene mapy</p>';
    return;
  }

  keys.forEach(key => {
    const name = key.replace('map_', '');
    const item = document.createElement('div');
    item.className = 'map-item';
    item.innerHTML = `<span>${name}</span><button class="del" onclick="deleteMap('${name}', event)">x</button>`;
    item.onclick = () => loadMap(name);
    list.appendChild(item);
  });
}

function loadMap(name) {
  const saved = localStorage.getItem('map_' + name);
  if (!saved) return;
  currentName = name;
  tiles = JSON.parse(saved);
  buildGrid();
  document.getElementById('mapName').textContent = name;
  showScreen('editor');
}

function deleteMap(name, e) {
  e.stopPropagation();
  localStorage.removeItem('map_' + name);
  renderMapList();
}

function exportMap() {
  const data = JSON.stringify({ name: currentName, tiles });
  const blob = new Blob([data], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = currentName + '.json';
  a.click();
}

function importMap(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const data = JSON.parse(ev.target.result);
    currentName = data.name;
    tiles = data.tiles;
    buildGrid();
    document.getElementById('mapName').textContent = currentName;
    showScreen('editor');
  };
  reader.readAsText(file);
}

function buildGrid() {
  const grid = document.getElementById('grid');
  grid.style.gridTemplateColumns = `repeat(${W}, 24px)`;
  grid.innerHTML = '';

  tiles.forEach((type, i) => {
    const div = document.createElement('div');
    div.className = 'tile' + (type !== 'grass' ? ' ' + type : '');
    div.dataset.i = i;
    grid.appendChild(div);
  });

  grid.onmousedown = e => { if (e.target.dataset.i !== undefined) { painting = true; paint(e.target); } };
  grid.onmouseover = e => { if (painting && e.target.dataset.i !== undefined) paint(e.target); };
  window.onmouseup = () => painting = false;
}

function paint(tile) {
  tiles[tile.dataset.i] = activeTile;
  tile.className = 'tile' + (activeTile !== 'grass' ? ' ' + activeTile : '');
}

document.getElementById('palette').addEventListener('click', e => {
  if (!e.target.dataset.type) return;
  document.querySelectorAll('.pal-btn').forEach(b => b.classList.remove('active'));
  e.target.classList.add('active');
  activeTile = e.target.dataset.type;
});