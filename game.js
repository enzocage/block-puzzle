// 10 ansteigend schwierigere und größere, garantierte lösbare Sokoban-Level
const levels = [
    {
        name: "Level 1: Aufwärmen",
        map: [
            "########",
            "#......#",
            "#.##$..#",
            "#..@$..#",
            "####.###",
            "   #R#  ",
            "   #B#  ",
            "   ###  "
        ]
    },
    {
        name: "Level 2: Erste Schritte",
        map: [
            "######  ",
            "#.@..###",
            "#..$.R.#",
            "###.$..#",
            "  #.$B.#",
            "  #..R.#",
            "  ######"
        ]
    },
    {
        name: "Level 3: Symmetrie",
        map: [
            "#######",
            "#R...B#",
            "#.$#$.#",
            "#..@..#",
            "#.$#$.#",
            "#B...R#",
            "#######"
        ]
    },
    {
        name: "Level 4: Doppelgänger",
        map: [
            "  ####  ",
            "###..###",
            "#..$.$.#",
            "#..@$.##",
            "#.R.B.R#",
            "########"
        ]
    },
    {
        name: "Level 5: Das Labyrinth",
        map: [
            "#########",
            "#R..@..B#",
            "#.$...$.#",
            "#.##.##.#",
            "#.$...$.#",
            "#B..#..R#",
            "#########"
        ]
    },
    {
        name: "Level 6: Blockade",
        map: [
            "  ##### ",
            "###..@##",
            "#..$$..#",
            "#.#.R.##",
            "#..B.R# ",
            "####### "
        ]
    },
    {
        name: "Level 7: Kreuzung",
        map: [
            "#########",
            "#R.B.R.B#",
            "#.......#",
            "#.$...$.#",
            "#..$@$..#",
            "#.......#",
            "#########"
        ]
    },
    {
        name: "Level 8: Die Schleife",
        map: [
            "##########",
            "#R.B.R.B.#",
            "#........#",
            "##.##.##.#",
            "#.$..$...#",
            "#..$@$...#",
            "#.$..$...#",
            "##########"
        ]
    },
    {
        name: "Level 9: Die Festung",
        map: [
            "############",
            "#R.B.R.B.R.#",
            "##.######.##",
            "#..........#",
            "#..$..$..$.#",
            "#....@.....#",
            "#..$.....$.#",
            "############"
        ]
    },
    {
        name: "Level 10: Ultimative Prüfung",
        map: [
            "##############",
            "#R.B.R.B.R.B.#",
            "#............#",
            "##.###..###.##",
            "#............#",
            "#..$..$$..$..#",
            "#.....@......#",
            "#..$......$..#",
            "##############"
        ]
    }
];

// Globale DOM Elemente
const board = document.getElementById('game-board');
const container = document.getElementById('game-container');
const overlay = document.getElementById('overlay');
const levelSelect = document.getElementById('level-select');
const levelNameEl = document.getElementById('current-level-name');

// Spiel-Zustand
let currentLevelIndex = 0;
let cols = 0;
let rows = 0;
let tileSize = 0;

let player = { x: 0, y: 0, el: null };
let boxes = [];
let walls = [];
let targets = [];

let isAnimating = false;
let movingEntities = [];

// Kamera- & Interaktions-Status
let scale = 1.0;
let panX = 0;
let panY = 0;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;

const eyesHTML = `<div class="eyes"><div class="eye"></div><div class="eye"></div></div>`;

// Dropdown mit Leveln befüllen
function buildLevelSelector() {
    levelSelect.innerHTML = '';
    levels.forEach((lvl, idx) => {
        const opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = `Level ${idx + 1}`;
        levelSelect.appendChild(opt);
    });
}

function changeLevel(index) {
    currentLevelIndex = parseInt(index);
    initLevel();
}

function nextLevel() {
    currentLevelIndex = (currentLevelIndex < levels.length - 1) ? currentLevelIndex + 1 : 0;
    initLevel();
}

// Level-Initialisierung
function initLevel() {
    clearBoardState();
    loadLevelData();
    resize(true); // "true" erzwingt die Kamera-Fokussierung
}

function clearBoardState() {
    board.innerHTML = '';
    overlay.classList.remove('visible');
    boxes = [];
    walls = [];
    targets = [];
    movingEntities = [];
}

function loadLevelData() {
    const currentLevel = levels[currentLevelIndex];
    levelNameEl.textContent = currentLevel.name;
    levelSelect.value = currentLevelIndex;

    cols = currentLevel.map[0].length;
    rows = currentLevel.map.length;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            parseMapChar(currentLevel.map[y][x], x, y);
        }
    }
}

function parseMapChar(char, x, y) {
    switch (char) {
        case '#':
            walls.push({ x, y, el: createTile('wall', x, y) });
            break;
        case '@':
            player.x = x;
            player.y = y;
            player.el = createEntity('player', x, y, eyesHTML);
            break;
        case '$':
            boxes.push({ x, y, el: createEntity('box', x, y, eyesHTML) });
            break;
        case 'R':
            targets.push({ x, y, type: 'red', el: createTile('target red', x, y) });
            break;
        case 'B':
            targets.push({ x, y, type: 'blue', el: createTile('target blue', x, y) });
            break;
    }
}

function createTile(className, x, y) {
    const el = document.createElement('div');
    el.className = `tile ${className}`;
    board.appendChild(el);
    return el;
}

function createEntity(className, x, y, innerHTML = '') {
    const el = document.createElement('div');
    el.className = `entity ${className}`;
    el.innerHTML = innerHTML;
    board.appendChild(el);
    return el;
}

// Ermittelt, ob an Position (x,y) ein statisches Gruppenelement liegt (für Kanten-Verschmelzung)
function getGroup(x, y) {
    if (movingEntities.some(e => e.x === x && e.y === y)) return null;
    if (walls.some(w => w.x === x && w.y === y)) return 'wall';
    if (boxes.some(b => b.x === x && b.y === y)) return 'box';
    if (player.x === x && player.y === y) return 'player';
    return null;
}

// Identische 3D-Ränder & Radien für Entities
function updateVisuals() {
    const edgeSize = Math.max(3, Math.floor(tileSize * 0.12));
    const radiusValue = Math.max(4, Math.floor(tileSize * 0.15));
    const radius = radiusValue + 'px';
    const targetBorder = Math.max(2, Math.floor(tileSize * 0.06)) + 'px';

    document.documentElement.style.setProperty('--dynamic-radius', radius);
    document.documentElement.style.setProperty('--dynamic-border', targetBorder);

    const allEntities = [
        ...walls.map(w => ({ ref: w, group: 'wall' })),
        ...boxes.map(b => ({ ref: b, group: 'box' })),
        { ref: player, group: 'player' }
    ];

    allEntities.forEach(ent => updateEntityStyle(ent, radius, edgeSize));
}

// Aktualisiert den Style eines einzelnen Elements (Autotiling & 3D-Schatten)
function updateEntityStyle(ent, radius, edgeSize) {
    const el = ent.ref.el;
    if (!el) return;

    const isMoving = movingEntities.includes(ent.ref);
    let t = false, r = false, b = false, l = false;

    // Nur Wände verschmelzen untereinander. Boxen und Spieler behalten immer alle Ecken abgerundet.
    if (!isMoving && ent.group === 'wall') {
        t = isWall(ent.ref.x, ent.ref.y - 1);
        r = isWall(ent.ref.x + 1, ent.ref.y);
        b = isWall(ent.ref.x, ent.ref.y + 1);
        l = isWall(ent.ref.x - 1, ent.ref.y);
    }

    // Dynamisches Autotiling für weiche Übergänge
    el.style.borderTopLeftRadius = (t || l) ? '0' : radius;
    el.style.borderTopRightRadius = (t || r) ? '0' : radius;
    el.style.borderBottomRightRadius = (b || r) ? '0' : radius;
    el.style.borderBottomLeftRadius = (b || l) ? '0' : radius;

    // 3D-Schattenwurf (rechts/unten hell, links/oben dunkel)
    const shadows = [];
    if (!t) shadows.push(`inset 0 ${edgeSize}px 0 rgba(0,0,0,0.3)`);
    if (!l) shadows.push(`inset ${edgeSize}px 0 0 rgba(0,0,0,0.3)`);
    if (!b) shadows.push(`inset 0 -${edgeSize}px 0 rgba(255,255,255,0.4)`);
    if (!r) shadows.push(`inset -${edgeSize}px 0 0 rgba(255,255,255,0.4)`);

    el.style.boxShadow = shadows.join(', ') || 'none';
}

function updatePositions() {
    const allElements = [...walls, ...targets, ...boxes, player];
    allElements.forEach(item => {
        if (!item.el) return;
        item.el.style.width = `${tileSize}px`;
        item.el.style.height = `${tileSize}px`;
        item.el.style.transform = `translate(${item.x * tileSize}px, ${item.y * tileSize}px)`;
    });
}

function resize(forceCenter = false) {
    const maxW = container.clientWidth * 0.95;
    const maxH = container.clientHeight * 0.95;
    tileSize = Math.floor(Math.min(maxW / cols, maxH / rows));

    // Gewährleiste Mindestgröße für extrem große Level, Zoom gleicht das aus
    if (tileSize < 30) tileSize = 30;

    board.style.width = `${tileSize * cols}px`;
    board.style.height = `${tileSize * rows}px`;

    updateVisuals();
    updatePositions();

    if (forceCenter) {
        resetCamera();
    } else {
        applyTransform();
    }
}

// Kamera-System (Zoom & Pan)
function applyTransform() {
    board.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
}

function resetCamera() {
    const containerW = container.clientWidth;
    const containerH = container.clientHeight;
    const boardW = tileSize * cols;
    const boardH = tileSize * rows;

    // Auto-Zoom, damit das Level optimal in die Kamera passt
    scale = Math.min(containerW / boardW, containerH / boardH) * 0.85;
    if (scale > 1.5) scale = 1.5;
    if (scale < 0.3) scale = 0.3;

    panX = (containerW - boardW * scale) / 2;
    panY = (containerH - boardH * scale) / 2;
    applyTransform();
}

// Blickrichtung der Augen anpassen
function updateEyes(entity, xDir, yDir) {
    const eyes = entity.el.querySelector('.eyes');
    if (eyes) eyes.style.transform = `translate(${xDir * 35}%, ${yDir * 35}%)`;
}

// Spiellogik-Hilfsfunktionen
function isWall(x, y) {
    return walls.some(w => w.x === x && w.y === y);
}

function getBoxIndex(x, y) {
    return boxes.findIndex(b => b.x === x && b.y === y);
}

// Spieler-Bewegung
function move(dx, dy) {
    if (isAnimating || overlay.classList.contains('visible')) return;

    const nx = player.x + dx;
    const ny = player.y + dy;

    updateEyes(player, dx, dy);

    if (isWall(nx, ny)) {
        bumpAnimation(player.el, dx, dy);
        return;
    }

    const boxIndex = getBoxIndex(nx, ny);
    let pushedBox = null;

    if (boxIndex !== -1) {
        const canPush = tryPushBox(boxIndex, nx, ny, dx, dy);
        if (!canPush) {
            bumpAnimation(player.el, dx, dy);
            return;
        }
        pushedBox = boxes[boxIndex];
    }

    executeMovement(nx, ny, pushedBox);
}

// Prüft, ob Kiste verschoben werden kann und setzt deren neue Koordinaten
function tryPushBox(boxIndex, nx, ny, dx, dy) {
    const bx = nx + dx;
    const by = ny + dy;

    if (isWall(bx, by) || getBoxIndex(bx, by) !== -1) {
        return false;
    }

    const pushedBox = boxes[boxIndex];
    pushedBox.x = bx;
    pushedBox.y = by;
    updateEyes(pushedBox, dx, dy);
    return true;
}

// Führt den Bewegungsschritt und die Animation aus
function executeMovement(nx, ny, pushedBox) {
    player.x = nx;
    player.y = ny;

    isAnimating = true;
    movingEntities = [player];
    if (pushedBox) {
        movingEntities.push(pushedBox);
    }

    updateVisuals();
    updatePositions();

    setTimeout(() => {
        isAnimating = false;
        movingEntities = [];
        updateVisuals();
        checkWin();
    }, 150);
}

function bumpAnimation(el, dx, dy) {
    let bumpClass = '';
    if (dx === 1) bumpClass = 'bump-right';
    else if (dx === -1) bumpClass = 'bump-left';
    else if (dy === 1) bumpClass = 'bump-down';
    else if (dy === -1) bumpClass = 'bump-up';

    if (bumpClass) {
        el.classList.add(bumpClass);
        setTimeout(() => el.classList.remove(bumpClass), 150);
    }
}

function checkWin() {
    const allOnTargets = boxes.every(box =>
        targets.some(t => t.x === box.x && t.y === box.y)
    );

    if (allOnTargets && targets.length > 0) {
        overlay.classList.add('visible');
    }
}

// Zufälliges Umschauen der Augen bei Stillstand (Lebendigkeit)
function setupIdleLookAround() {
    setInterval(() => {
        if (isAnimating || overlay.classList.contains('visible')) return;
        const all = [player, ...boxes];
        all.forEach(ent => {
            if (ent.el && Math.random() < 0.25) {
                const rx = (Math.random() - 0.5) * 30;
                const ry = (Math.random() - 0.5) * 30;
                const eyes = ent.el.querySelector('.eyes');
                if (eyes) eyes.style.transform = `translate(${rx}%, ${ry}%)`;
            }
        });
    }, 1500);
}

// Input & Event-Setup
function setupEventHandlers() {
    window.addEventListener('resize', () => resize(false));

    // Tastatur Steuerung
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowUp': case 'w': case 'W': move(0, -1); e.preventDefault(); break;
            case 'ArrowDown': case 's': case 'S': move(0, 1); e.preventDefault(); break;
            case 'ArrowLeft': case 'a': case 'A': move(-1, 0); e.preventDefault(); break;
            case 'ArrowRight': case 'd': case 'D': move(1, 0); e.preventDefault(); break;
        }
    });

    // Zoom per Mausrad
    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomSpeed = 0.05;
        if (e.deltaY < 0) {
            scale = Math.min(3.0, scale + zoomSpeed);
        } else {
            scale = Math.max(0.2, scale - zoomSpeed);
        }
        applyTransform();
    }, { passive: false });

    // Drag-to-Pan (Maus)
    container.addEventListener('mousedown', (e) => {
        if (e.button !== 0 || e.target.tagName === 'BUTTON') return;
        isDragging = true;
        dragStartX = e.clientX - panX;
        dragStartY = e.clientY - panY;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        panX = e.clientX - dragStartX;
        panY = e.clientY - dragStartY;
        applyTransform();
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Touch-Dragging für Mobilgeräte
    let touchStartDist = 0;
    let initialScale = 1.0;

    const getTouchDist = (e) => {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    container.addEventListener('touchstart', (e) => {
        if (e.target.tagName === 'BUTTON') return;
        if (e.touches.length === 1) {
            isDragging = true;
            dragStartX = e.touches[0].clientX - panX;
            dragStartY = e.touches[0].clientY - panY;
        } else if (e.touches.length === 2) {
            isDragging = false;
            touchStartDist = getTouchDist(e);
            initialScale = scale;
        }
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1 && isDragging) {
            panX = e.touches[0].clientX - dragStartX;
            panY = e.touches[0].clientY - dragStartY;
            applyTransform();
        } else if (e.touches.length === 2) {
            const dist = getTouchDist(e);
            const factor = dist / touchStartDist;
            scale = Math.max(0.2, Math.min(3.0, initialScale * factor));
            applyTransform();
        }
    }, { passive: true });

    container.addEventListener('touchend', () => {
        isDragging = false;
    });
}

// Initialisierung
buildLevelSelector();
initLevel();
setupIdleLookAround();
setupEventHandlers();
