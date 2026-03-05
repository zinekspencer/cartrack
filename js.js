const W = 20, H = 20;
let tiles = Array(W * H).fill('grass');
let activeTile = 'grass';
let painting = false;

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function newMap() {
  tiles = Array(W * H).fill('grass');
  buildGrid();
  showScreen('editor');
}

function loadMap() {
  const saved = localStorage.getItem('trackMap');
  if (!saved) return alert('Zadna ulozena mapa.');
  tiles = JSON.parse(saved);
  buildGrid();
  showScreen('editor');
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

  grid.onmousedown = e => { if (e.target.dataset.i) { painting = true; paint(e.target); } };
  grid.onmouseover = e => { if (painting && e.target.dataset.i) paint(e.target); };
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
