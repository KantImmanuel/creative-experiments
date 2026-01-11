// ========================================
// LOOT GRIND - Idle ARPG
// ========================================

// Item Bases
const ITEM_BASES = {
    weapons: [
        { name: 'Short Sword', slot: 'weapon', icon: '⚔️', minDmg: 5, maxDmg: 10, speed: 1.0, reqLvl: 1 },
        { name: 'Hand Axe', slot: 'weapon', icon: '🪓', minDmg: 8, maxDmg: 14, speed: 0.9, reqLvl: 3 },
        { name: 'Mace', slot: 'weapon', icon: '🔨', minDmg: 10, maxDmg: 18, speed: 0.8, reqLvl: 5 },
        { name: 'Long Sword', slot: 'weapon', icon: '⚔️', minDmg: 12, maxDmg: 22, speed: 0.95, reqLvl: 8 },
        { name: 'Battle Axe', slot: 'weapon', icon: '🪓', minDmg: 18, maxDmg: 32, speed: 0.75, reqLvl: 12 },
        { name: 'War Hammer', slot: 'weapon', icon: '🔨', minDmg: 25, maxDmg: 45, speed: 0.6, reqLvl: 18 },
        { name: 'Phase Blade', slot: 'weapon', icon: '⚔️', minDmg: 30, maxDmg: 50, speed: 1.2, reqLvl: 25 },
        { name: 'Colossus Blade', slot: 'weapon', icon: '⚔️', minDmg: 45, maxDmg: 80, speed: 0.7, reqLvl: 35 },
    ],
    armor: [
        { name: 'Quilted Armor', slot: 'armor', icon: '👕', defense: 10, reqLvl: 1 },
        { name: 'Leather Armor', slot: 'armor', icon: '👕', defense: 25, reqLvl: 4 },
        { name: 'Hard Leather', slot: 'armor', icon: '👕', defense: 45, reqLvl: 8 },
        { name: 'Chain Mail', slot: 'armor', icon: '🦺', defense: 75, reqLvl: 15 },
        { name: 'Plate Mail', slot: 'armor', icon: '🦺', defense: 120, reqLvl: 22 },
        { name: 'Gothic Plate', slot: 'armor', icon: '🦺', defense: 180, reqLvl: 30 },
        { name: 'Sacred Armor', slot: 'armor', icon: '🦺', defense: 250, reqLvl: 40 },
    ],
    helms: [
        { name: 'Cap', slot: 'helm', icon: '🧢', defense: 5, reqLvl: 1 },
        { name: 'Skull Cap', slot: 'helm', icon: '⛑️', defense: 15, reqLvl: 5 },
        { name: 'Helm', slot: 'helm', icon: '⛑️', defense: 30, reqLvl: 10 },
        { name: 'Great Helm', slot: 'helm', icon: '⛑️', defense: 50, reqLvl: 18 },
        { name: 'Crown', slot: 'helm', icon: '👑', defense: 75, reqLvl: 28 },
        { name: 'Diadem', slot: 'helm', icon: '👑', defense: 100, reqLvl: 40 },
    ],
    rings: [
        { name: 'Ring', slot: 'ring', icon: '💍', reqLvl: 1 },
    ],
    amulets: [
        { name: 'Amulet', slot: 'amulet', icon: '📿', reqLvl: 1 },
    ],
    boots: [
        { name: 'Boots', slot: 'boots', icon: '👢', defense: 5, reqLvl: 1 },
        { name: 'Heavy Boots', slot: 'boots', icon: '👢', defense: 15, reqLvl: 8 },
        { name: 'Chain Boots', slot: 'boots', icon: '👢', defense: 30, reqLvl: 16 },
        { name: 'War Boots', slot: 'boots', icon: '👢', defense: 50, reqLvl: 28 },
    ],
    gloves: [
        { name: 'Gloves', slot: 'gloves', icon: '🧤', defense: 5, reqLvl: 1 },
        { name: 'Heavy Gloves', slot: 'gloves', icon: '🧤', defense: 15, reqLvl: 8 },
        { name: 'Chain Gloves', slot: 'gloves', icon: '🧤', defense: 30, reqLvl: 16 },
        { name: 'War Gauntlets', slot: 'gloves', icon: '🧤', defense: 50, reqLvl: 28 },
    ],
    belts: [
        { name: 'Sash', slot: 'belt', icon: '🎗️', defense: 2, reqLvl: 1 },
        { name: 'Belt', slot: 'belt', icon: '🎗️', defense: 8, reqLvl: 6 },
        { name: 'Heavy Belt', slot: 'belt', icon: '🎗️', defense: 18, reqLvl: 14 },
        { name: 'War Belt', slot: 'belt', icon: '🎗️', defense: 35, reqLvl: 25 },
    ]
};

// Affixes
const PREFIXES = [
    { name: 'Sharp', stat: 'minDmg', min: 1, max: 5, slots: ['weapon'], reqLvl: 1 },
    { name: 'Fine', stat: 'maxDmg', min: 2, max: 8, slots: ['weapon'], reqLvl: 1 },
    { name: 'Warrior\'s', stat: 'damage', min: 5, max: 15, percent: true, slots: ['weapon'], reqLvl: 8 },
    { name: 'Merciless', stat: 'damage', min: 20, max: 40, percent: true, slots: ['weapon'], reqLvl: 20 },
    { name: 'Sturdy', stat: 'defense', min: 10, max: 30, slots: ['armor', 'helm', 'boots', 'gloves', 'belt'], reqLvl: 1 },
    { name: 'Strong', stat: 'defense', min: 30, max: 60, slots: ['armor', 'helm', 'boots', 'gloves', 'belt'], reqLvl: 10 },
    { name: 'Glorious', stat: 'defense', min: 60, max: 120, slots: ['armor', 'helm', 'boots', 'gloves', 'belt'], reqLvl: 25 },
    { name: 'Bronze', stat: 'goldFind', min: 10, max: 25, slots: ['ring', 'amulet', 'belt'], reqLvl: 1 },
    { name: 'Silver', stat: 'goldFind', min: 30, max: 50, slots: ['ring', 'amulet', 'belt'], reqLvl: 12 },
    { name: 'Gold', stat: 'goldFind', min: 60, max: 100, slots: ['ring', 'amulet', 'belt'], reqLvl: 25 },
    { name: 'Lucky', stat: 'magicFind', min: 5, max: 15, slots: ['ring', 'amulet', 'helm', 'boots', 'gloves'], reqLvl: 1 },
    { name: 'Fortuitous', stat: 'magicFind', min: 15, max: 30, slots: ['ring', 'amulet', 'helm', 'boots', 'gloves'], reqLvl: 15 },
    { name: 'Godly', stat: 'magicFind', min: 35, max: 50, slots: ['ring', 'amulet', 'helm'], reqLvl: 30 },
];

const SUFFIXES = [
    { name: 'of Attack', stat: 'attackSpeed', min: 5, max: 15, percent: true, slots: ['weapon', 'gloves', 'ring'], reqLvl: 1 },
    { name: 'of Quickness', stat: 'attackSpeed', min: 15, max: 25, percent: true, slots: ['weapon', 'gloves', 'ring'], reqLvl: 15 },
    { name: 'of the Leech', stat: 'lifeSteal', min: 2, max: 5, slots: ['weapon', 'ring'], reqLvl: 10 },
    { name: 'of the Bat', stat: 'lifeSteal', min: 5, max: 8, slots: ['weapon', 'ring'], reqLvl: 25 },
    { name: 'of Life', stat: 'life', min: 10, max: 30, slots: ['armor', 'helm', 'amulet', 'belt'], reqLvl: 1 },
    { name: 'of Vita', stat: 'life', min: 30, max: 60, slots: ['armor', 'helm', 'amulet', 'belt'], reqLvl: 15 },
    { name: 'of the Whale', stat: 'life', min: 60, max: 100, slots: ['armor', 'helm', 'amulet', 'belt'], reqLvl: 30 },
    { name: 'of Fortune', stat: 'magicFind', min: 10, max: 20, slots: ['boots', 'gloves', 'ring', 'amulet'], reqLvl: 8 },
    { name: 'of Luck', stat: 'magicFind', min: 20, max: 35, slots: ['boots', 'gloves', 'ring', 'amulet'], reqLvl: 20 },
    { name: 'of Greed', stat: 'goldFind', min: 20, max: 40, slots: ['boots', 'ring', 'belt'], reqLvl: 5 },
    { name: 'of Wealth', stat: 'goldFind', min: 50, max: 80, slots: ['boots', 'ring', 'belt'], reqLvl: 18 },
    { name: 'of the Colossus', stat: 'damage', min: 10, max: 25, percent: true, slots: ['weapon'], reqLvl: 12 },
];

// Unique Items
const UNIQUES = [
    {
        baseName: 'Short Sword', name: 'The Diggler', flavor: '"Dig it."',
        stats: { minDmg: 15, maxDmg: 25, attackSpeed: 30, magicFind: 25 }, reqLvl: 5, icon: '🗡️'
    },
    {
        baseName: 'Ring', name: 'Nagelring', flavor: '"The Gnome King lost his love."',
        stats: { magicFind: 30, minDmg: 3, maxDmg: 8 }, reqLvl: 7, icon: '💍'
    },
    {
        baseName: 'Skull Cap', name: 'Tarnhelm', flavor: '"The helm of the cunning."',
        stats: { defense: 30, magicFind: 50, goldFind: 50 }, reqLvl: 10, icon: '⛑️'
    },
    {
        baseName: 'Boots', name: 'Hotspur', flavor: '"The wicked flee when none pursue."',
        stats: { defense: 25, life: 45, goldFind: 35 }, reqLvl: 8, icon: '👢'
    },
    {
        baseName: 'Amulet', name: 'The Eye of Etlich', flavor: '"The eye sees all."',
        stats: { magicFind: 40, lifeSteal: 7, life: 30 }, reqLvl: 15, icon: '📿'
    },
    {
        baseName: 'Long Sword', name: 'Ginther\'s Rift', flavor: '"Cuts through dimensions."',
        stats: { minDmg: 30, maxDmg: 55, attackSpeed: 20, magicFind: 35 }, reqLvl: 12, icon: '⚔️'
    },
    {
        baseName: 'Leather Armor', name: 'The Spirit Shroud', flavor: '"Worn by those between worlds."',
        stats: { defense: 80, magicFind: 40, life: 50 }, reqLvl: 12, icon: '👕'
    },
    {
        baseName: 'Heavy Belt', name: 'Goldwrap', flavor: '"Weighs heavily with fortune."',
        stats: { defense: 40, goldFind: 100, magicFind: 30 }, reqLvl: 18, icon: '🎗️'
    },
    {
        baseName: 'Battle Axe', name: 'Deathcleaver', flavor: '"None escape its bite."',
        stats: { minDmg: 50, maxDmg: 90, damage: 40, lifeSteal: 6 }, reqLvl: 20, icon: '🪓'
    },
    {
        baseName: 'Great Helm', name: 'Crown of Ages', flavor: '"Worn by kings eternal."',
        stats: { defense: 150, damage: 15, magicFind: 25, life: 80 }, reqLvl: 25, icon: '👑'
    },
    {
        baseName: 'Chain Mail', name: 'Skullder\'s Ire', flavor: '"The very sight inspires dread."',
        stats: { defense: 200, magicFind: 123 }, reqLvl: 28, icon: '🦺'
    },
    {
        baseName: 'War Boots', name: 'War Traveler', flavor: '"Paths of glory lead but to the grave."',
        stats: { defense: 80, magicFind: 50, minDmg: 15, maxDmg: 25 }, reqLvl: 30, icon: '👢'
    },
    {
        baseName: 'Ring', name: 'Stone of Jordan', flavor: '"Wealth beyond measure."',
        stats: { magicFind: 25, life: 50, damage: 20 }, reqLvl: 35, icon: '💍'
    },
    {
        baseName: 'Phase Blade', name: 'Lightsabre', flavor: '"An elegant weapon for a more civilized age."',
        stats: { minDmg: 60, maxDmg: 100, attackSpeed: 40, magicFind: 20 }, reqLvl: 35, icon: '⚔️'
    },
    {
        baseName: 'Diadem', name: 'Griffon\'s Eye', flavor: '"See with perfect clarity."',
        stats: { defense: 150, magicFind: 75, damage: 25 }, reqLvl: 45, icon: '👑'
    },
];

// Runes
const RUNES = [
    { name: 'El', number: 1, icon: 'ᛖ' },
    { name: 'Eld', number: 2, icon: 'ᛟ' },
    { name: 'Tir', number: 3, icon: 'ᛏ' },
    { name: 'Nef', number: 4, icon: 'ᚾ' },
    { name: 'Eth', number: 5, icon: 'ᛖ' },
    { name: 'Ith', number: 6, icon: 'ᛁ' },
    { name: 'Tal', number: 7, icon: 'ᛏ' },
    { name: 'Ral', number: 8, icon: 'ᚱ' },
    { name: 'Ort', number: 9, icon: 'ᛟ' },
    { name: 'Thul', number: 10, icon: 'ᚦ' },
    { name: 'Amn', number: 11, icon: 'ᚨ' },
    { name: 'Sol', number: 12, icon: 'ᛊ' },
    { name: 'Shael', number: 13, icon: 'ᛋ' },
    { name: 'Dol', number: 14, icon: 'ᛞ' },
    { name: 'Hel', number: 15, icon: 'ᚺ' },
    { name: 'Io', number: 16, icon: 'ᛇ' },
    { name: 'Lum', number: 17, icon: 'ᛚ' },
    { name: 'Ko', number: 18, icon: 'ᚲ' },
    { name: 'Fal', number: 19, icon: 'ᚠ' },
    { name: 'Lem', number: 20, icon: 'ᛚ' },
    { name: 'Pul', number: 21, icon: 'ᛈ' },
    { name: 'Um', number: 22, icon: 'ᚢ' },
    { name: 'Mal', number: 23, icon: 'ᛗ' },
    { name: 'Ist', number: 24, icon: 'ᛁ' },
    { name: 'Gul', number: 25, icon: 'ᚷ' },
    { name: 'Vex', number: 26, icon: 'ᚡ' },
    { name: 'Ohm', number: 27, icon: 'ᛟ' },
    { name: 'Lo', number: 28, icon: 'ᛚ' },
    { name: 'Sur', number: 29, icon: 'ᛊ' },
    { name: 'Ber', number: 30, icon: 'ᛒ' },
    { name: 'Jah', number: 31, icon: 'ᛃ' },
    { name: 'Cham', number: 32, icon: 'ᚲ' },
    { name: 'Zod', number: 33, icon: 'ᛉ' },
];

// Zones
const ZONES = [
    { name: 'The Blood Moor', level: 1, monsters: ['Zombie', 'Quill Rat', 'Fallen'], drops: ['normal'], unlocked: true },
    { name: 'Cold Plains', level: 4, monsters: ['Dark Hunter', 'Hungry Dead', 'Fallen Shaman'], drops: ['normal', 'magic'], unlocked: true },
    { name: 'Underground Passage', level: 7, monsters: ['Dark Stalker', 'Skeleton', 'Spike Fiend'], drops: ['normal', 'magic'], unlocked: false },
    { name: 'Dark Wood', level: 10, monsters: ['Brute', 'Yeti', 'Dark One'], drops: ['magic', 'rare'], unlocked: false },
    { name: 'Black Marsh', level: 14, monsters: ['Drowned Carcass', 'Plague Bearer', 'Tainted'], drops: ['magic', 'rare'], unlocked: false },
    { name: 'The Pit', level: 18, monsters: ['Devilkin', 'Dark Archer', 'Skeleton Mage'], drops: ['magic', 'rare', 'unique'], unlocked: false },
    { name: 'Catacombs', level: 22, monsters: ['Afflicted', 'Banished', 'Ghouls'], drops: ['rare', 'unique'], unlocked: false },
    { name: 'Arcane Sanctuary', level: 28, monsters: ['Specter', 'Ghoul Lord', 'Hell Clan'], drops: ['rare', 'unique'], unlocked: false },
    { name: 'Chaos Sanctuary', level: 35, monsters: ['Venom Lord', 'Storm Caster', 'Oblivion Knight'], drops: ['rare', 'unique', 'rune'], unlocked: false },
    { name: 'Worldstone Keep', level: 45, monsters: ['Death Lord', 'Blood Lord', 'Minion of Destruction'], drops: ['unique', 'rune'], unlocked: false },
];

// Game State
let state = {
    player: {
        level: 1,
        xp: 0,
        xpToLevel: 100,
        gold: 0,
        baseDamage: { min: 10, max: 15 },
        baseSpeed: 1.0,
        magicFind: 0,
        goldFind: 0,
    },
    currentZone: 0,
    kills: 0,
    totalKills: 0,
    monster: {
        name: 'Zombie',
        hp: 100,
        maxHp: 100,
    },
    inventory: [],
    equipment: {
        weapon: null,
        armor: null,
        helm: null,
        boots: null,
        gloves: null,
        belt: null,
        ring1: null,
        ring2: null,
        amulet: null,
    },
    runesCollected: [],
    recentDrops: [],
    lastSave: Date.now(),
    lastOnline: Date.now(),
};

// DOM Elements
const elements = {
    playerLevel: document.getElementById('playerLevel'),
    playerXP: document.getElementById('playerXP'),
    playerGold: document.getElementById('playerGold'),
    statDamage: document.getElementById('statDamage'),
    statSpeed: document.getElementById('statSpeed'),
    statMF: document.getElementById('statMF'),
    statGF: document.getElementById('statGF'),
    zoneList: document.getElementById('zoneList'),
    currentZone: document.getElementById('currentZone'),
    zoneSubtitle: document.getElementById('zoneSubtitle'),
    killCount: document.getElementById('killCount'),
    killRate: document.getElementById('killRate'),
    monsterName: document.getElementById('monsterName'),
    monsterHP: document.getElementById('monsterHP'),
    monsterProgress: document.getElementById('monsterProgress'),
    lootDrops: document.getElementById('lootDrops'),
    mfDisplay: document.getElementById('mfDisplay'),
    inventoryGrid: document.getElementById('inventoryGrid'),
    invCount: document.getElementById('invCount'),
    recentDrops: document.getElementById('recentDrops'),
    tooltip: document.getElementById('tooltip'),
    offlineModal: document.getElementById('offlineModal'),
    offlineSummary: document.getElementById('offlineSummary'),
    offlineLoot: document.getElementById('offlineLoot'),
    runeGrid: document.getElementById('runeGrid'),
    equipmentGrid: document.getElementById('equipmentGrid'),
};

// Combat timing
let lastAttack = 0;
let killsThisSecond = 0;
let lastKillCheck = Date.now();

// Initialize
function init() {
    loadGame();
    renderZones();
    renderInventory();
    renderEquipment();
    renderRunes();
    updateStats();
    setupEventListeners();
    checkOfflineGains();
    requestAnimationFrame(gameLoop);

    // Auto-save every 10 seconds
    setInterval(saveGame, 10000);
}

// Game Loop
function gameLoop(timestamp) {
    const zone = ZONES[state.currentZone];
    const attackInterval = 1000 / getAttackSpeed();

    if (timestamp - lastAttack >= attackInterval) {
        attack();
        lastAttack = timestamp;
    }

    // Update kill rate display
    if (Date.now() - lastKillCheck >= 1000) {
        elements.killRate.textContent = `${killsThisSecond.toFixed(1)} kills/sec`;
        killsThisSecond = 0;
        lastKillCheck = Date.now();
    }

    requestAnimationFrame(gameLoop);
}

// Combat
function attack() {
    const damage = getDamage();
    state.monster.hp -= damage;

    updateMonsterDisplay();

    if (state.monster.hp <= 0) {
        killMonster();
    }
}

function killMonster() {
    state.kills++;
    state.totalKills++;
    killsThisSecond++;

    const zone = ZONES[state.currentZone];

    // XP gain
    const xpGain = Math.floor(zone.level * (5 + Math.random() * 5));
    state.player.xp += xpGain;
    checkLevelUp();

    // Gold drop
    const goldGain = Math.floor(zone.level * (3 + Math.random() * 7) * (1 + state.player.goldFind / 100));
    state.player.gold += goldGain;

    // Loot rolls
    rollLoot(zone);

    // Spawn new monster
    spawnMonster();

    // Update displays
    elements.killCount.textContent = formatNumber(state.totalKills);
    elements.playerXP.textContent = formatNumber(state.player.xp) + '/' + formatNumber(state.player.xpToLevel);
    elements.playerGold.textContent = formatNumber(state.player.gold);
}

function spawnMonster() {
    const zone = ZONES[state.currentZone];
    const monsterName = zone.monsters[Math.floor(Math.random() * zone.monsters.length)];
    const baseHp = 50 + zone.level * 20;

    state.monster = {
        name: monsterName,
        hp: baseHp,
        maxHp: baseHp,
    };

    updateMonsterDisplay();
}

function updateMonsterDisplay() {
    elements.monsterName.textContent = state.monster.name;
    elements.monsterHP.textContent = `${Math.max(0, Math.floor(state.monster.hp))}/${state.monster.maxHp}`;
    elements.monsterProgress.style.width = `${Math.max(0, (state.monster.hp / state.monster.maxHp) * 100)}%`;
}

// Loot Generation
function rollLoot(zone) {
    const mf = state.player.magicFind;
    const baseDrop = 0.15; // 15% base drop rate

    if (Math.random() > baseDrop) return;

    // Determine rarity
    let rarity = 'normal';
    const roll = Math.random() * 1000;
    const mfBonus = mf * 2.5;

    if (roll < 1 + mfBonus * 0.01 && zone.drops.includes('rune')) {
        // Rune drop
        dropRune(zone);
        return;
    } else if (roll < 5 + mfBonus * 0.1 && zone.drops.includes('unique')) {
        rarity = 'unique';
    } else if (roll < 50 + mfBonus * 0.5 && zone.drops.includes('rare')) {
        rarity = 'rare';
    } else if (roll < 200 + mfBonus && zone.drops.includes('magic')) {
        rarity = 'magic';
    }

    generateItem(rarity, zone.level);
}

function dropRune(zone) {
    // Higher zones = higher runes possible
    const maxRune = Math.min(33, Math.floor(zone.level / 1.5) + 5);

    // Weighted towards lower runes
    let runeIndex = 0;
    const roll = Math.random();
    if (roll < 0.5) {
        runeIndex = Math.floor(Math.random() * Math.min(10, maxRune));
    } else if (roll < 0.8) {
        runeIndex = Math.floor(Math.random() * Math.min(20, maxRune));
    } else if (roll < 0.95) {
        runeIndex = Math.floor(Math.random() * Math.min(27, maxRune));
    } else {
        runeIndex = Math.floor(Math.random() * maxRune);
    }

    const rune = RUNES[runeIndex];

    if (!state.runesCollected.includes(rune.name)) {
        state.runesCollected.push(rune.name);
        renderRunes();
    }

    showLootDrop(`${rune.icon} ${rune.name} Rune`, 'rune');
    addToRecentDrops({
        name: `${rune.name} Rune`,
        rarity: 'rune',
        type: 'Rune',
        stats: [`Rune #${rune.number}`]
    });
}

function generateItem(rarity, areaLevel) {
    // Pick random item type
    const types = Object.keys(ITEM_BASES);
    const type = types[Math.floor(Math.random() * types.length)];

    // Filter bases by level
    const validBases = ITEM_BASES[type].filter(b => b.reqLvl <= areaLevel + 5);
    if (validBases.length === 0) return;

    const base = validBases[Math.floor(Math.random() * validBases.length)];

    let item;

    if (rarity === 'unique') {
        // Try to find a unique for this base
        const uniqueOptions = UNIQUES.filter(u => u.baseName === base.name && u.reqLvl <= areaLevel + 10);
        if (uniqueOptions.length > 0) {
            const unique = uniqueOptions[Math.floor(Math.random() * uniqueOptions.length)];
            item = {
                ...base,
                name: unique.name,
                rarity: 'unique',
                stats: unique.stats,
                flavor: unique.flavor,
                icon: unique.icon,
                reqLvl: unique.reqLvl,
            };
        } else {
            rarity = 'rare'; // Downgrade if no unique found
        }
    }

    if (!item) {
        item = { ...base, rarity };
        item.stats = {};

        if (rarity === 'magic') {
            // 1 affix
            addAffix(item, areaLevel);
        } else if (rarity === 'rare') {
            // 2-4 affixes
            const numAffixes = 2 + Math.floor(Math.random() * 3);
            for (let i = 0; i < numAffixes; i++) {
                addAffix(item, areaLevel);
            }
            // Generate rare name
            item.name = generateRareName(base.name);
        }
    }

    // Add to inventory if space
    if (state.inventory.length < 50) {
        state.inventory.push(item);
        renderInventory();
        showLootDrop(`${item.icon} ${item.name}`, item.rarity);
        addToRecentDrops(item);
    }
}

function addAffix(item, areaLevel) {
    const isPrefix = Math.random() < 0.5;
    const pool = isPrefix ? PREFIXES : SUFFIXES;

    const validAffixes = pool.filter(a =>
        a.reqLvl <= areaLevel + 5 &&
        a.slots.includes(item.slot) &&
        !item.stats[a.stat]
    );

    if (validAffixes.length === 0) return;

    const affix = validAffixes[Math.floor(Math.random() * validAffixes.length)];
    const value = affix.min + Math.floor(Math.random() * (affix.max - affix.min + 1));

    item.stats[affix.stat] = value;
    if (affix.percent) item.stats[affix.stat + 'Percent'] = true;

    if (isPrefix && item.rarity === 'magic') {
        item.name = `${affix.name} ${item.name}`;
    } else if (!isPrefix && item.rarity === 'magic') {
        item.name = `${item.name} ${affix.name}`;
    }
}

function generateRareName(baseName) {
    const prefixes = ['Death', 'Storm', 'Soul', 'Blood', 'Doom', 'Grim', 'Shadow', 'Rune', 'Pain', 'Skull', 'Viper', 'Eagle'];
    const suffixes = ['Bane', 'Mark', 'Scar', 'Song', 'Grasp', 'Touch', 'Bite', 'Heart', 'Eye', 'Wing', 'Claw', 'Roar'];

    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

    return `${prefix} ${suffix}`;
}

function showLootDrop(text, rarity) {
    const drop = document.createElement('div');
    drop.className = `loot-drop ${rarity}`;
    drop.textContent = text;
    drop.style.left = `${20 + Math.random() * 60}%`;
    drop.style.top = `${30 + Math.random() * 40}%`;

    elements.lootDrops.appendChild(drop);

    setTimeout(() => drop.remove(), 2000);
}

function addToRecentDrops(item) {
    const displayStats = [];
    for (const [stat, value] of Object.entries(item.stats || {})) {
        if (stat.endsWith('Percent')) continue;
        const isPercent = item.stats[stat + 'Percent'];
        displayStats.push(`+${value}${isPercent ? '%' : ''} ${formatStatName(stat)}`);
    }

    state.recentDrops.unshift({
        name: item.name,
        rarity: item.rarity,
        type: item.slot || 'Rune',
        stats: displayStats.slice(0, 3),
    });

    state.recentDrops = state.recentDrops.slice(0, 20);
    renderRecentDrops();
}

// Stats Calculation
function getDamage() {
    let minDmg = state.player.baseDamage.min;
    let maxDmg = state.player.baseDamage.max;
    let damagePercent = 0;

    // Add equipment bonuses
    for (const slot of Object.values(state.equipment)) {
        if (!slot) continue;
        if (slot.minDmg) minDmg += slot.minDmg;
        if (slot.maxDmg) maxDmg += slot.maxDmg;
        if (slot.stats) {
            if (slot.stats.minDmg) minDmg += slot.stats.minDmg;
            if (slot.stats.maxDmg) maxDmg += slot.stats.maxDmg;
            if (slot.stats.damage) damagePercent += slot.stats.damage;
        }
    }

    const baseDamage = minDmg + Math.random() * (maxDmg - minDmg);
    return Math.floor(baseDamage * (1 + damagePercent / 100));
}

function getAttackSpeed() {
    let speed = state.player.baseSpeed;
    let speedPercent = 0;

    for (const slot of Object.values(state.equipment)) {
        if (!slot) continue;
        if (slot.speed) speed = slot.speed;
        if (slot.stats && slot.stats.attackSpeed) speedPercent += slot.stats.attackSpeed;
    }

    return speed * (1 + speedPercent / 100);
}

function calculateTotalMF() {
    let mf = 0;
    for (const slot of Object.values(state.equipment)) {
        if (!slot || !slot.stats) continue;
        if (slot.stats.magicFind) mf += slot.stats.magicFind;
    }
    return mf;
}

function calculateTotalGF() {
    let gf = 0;
    for (const slot of Object.values(state.equipment)) {
        if (!slot || !slot.stats) continue;
        if (slot.stats.goldFind) gf += slot.stats.goldFind;
    }
    return gf;
}

function updateStats() {
    state.player.magicFind = calculateTotalMF();
    state.player.goldFind = calculateTotalGF();

    let minDmg = state.player.baseDamage.min;
    let maxDmg = state.player.baseDamage.max;

    for (const slot of Object.values(state.equipment)) {
        if (!slot) continue;
        if (slot.minDmg) minDmg += slot.minDmg;
        if (slot.maxDmg) maxDmg += slot.maxDmg;
        if (slot.stats) {
            if (slot.stats.minDmg) minDmg += slot.stats.minDmg;
            if (slot.stats.maxDmg) maxDmg += slot.stats.maxDmg;
        }
    }

    elements.statDamage.textContent = `${minDmg}-${maxDmg}`;
    elements.statSpeed.textContent = `${getAttackSpeed().toFixed(2)}/s`;
    elements.statMF.textContent = `${state.player.magicFind}%`;
    elements.statGF.textContent = `${state.player.goldFind}%`;
    elements.mfDisplay.textContent = `${state.player.magicFind}%`;
    elements.playerLevel.textContent = state.player.level;
    elements.playerXP.textContent = formatNumber(state.player.xp) + '/' + formatNumber(state.player.xpToLevel);
    elements.playerGold.textContent = formatNumber(state.player.gold);
}

function checkLevelUp() {
    while (state.player.xp >= state.player.xpToLevel) {
        state.player.xp -= state.player.xpToLevel;
        state.player.level++;
        state.player.xpToLevel = Math.floor(state.player.xpToLevel * 1.5);
        state.player.baseDamage.min += 2;
        state.player.baseDamage.max += 4;

        // Unlock zones
        ZONES.forEach((zone, i) => {
            if (state.player.level >= zone.level - 2 && !zone.unlocked) {
                zone.unlocked = true;
            }
        });

        renderZones();
        updateStats();
    }
}

// Rendering
function renderZones() {
    elements.zoneList.innerHTML = '';

    ZONES.forEach((zone, index) => {
        const div = document.createElement('div');
        div.className = `zone ${index === state.currentZone ? 'active' : ''} ${!zone.unlocked ? 'locked' : ''}`;

        const dropIndicators = zone.drops.map(d => {
            const colors = { normal: '#666', magic: '#4444aa', rare: '#aaaa44', unique: '#aa7744', rune: '#8844aa' };
            return `<div class="drop-indicator" style="background: ${colors[d]}"></div>`;
        }).join('');

        div.innerHTML = `
            <div class="zone-header">
                <span class="zone-name">${zone.name}</span>
                <span class="zone-level">Lv.${zone.level}</span>
            </div>
            <div class="zone-desc">${zone.monsters.join(', ')}</div>
            <div class="zone-drops">${dropIndicators}</div>
        `;

        if (zone.unlocked) {
            div.addEventListener('click', () => selectZone(index));
        }

        elements.zoneList.appendChild(div);
    });
}

function selectZone(index) {
    if (!ZONES[index].unlocked) return;

    state.currentZone = index;
    const zone = ZONES[index];

    elements.currentZone.textContent = zone.name;
    elements.zoneSubtitle.textContent = `Monster Level ${zone.level}`;

    spawnMonster();
    renderZones();
}

function renderInventory() {
    elements.inventoryGrid.innerHTML = '';
    elements.invCount.textContent = state.inventory.length;

    for (let i = 0; i < 50; i++) {
        const slot = document.createElement('div');
        slot.className = 'inv-slot';

        if (state.inventory[i]) {
            const item = state.inventory[i];
            slot.classList.add('has-item', item.rarity);
            slot.innerHTML = `<span class="item-icon">${item.icon}</span>`;
            slot.addEventListener('mouseenter', (e) => showTooltip(e, item));
            slot.addEventListener('mouseleave', hideTooltip);
            slot.addEventListener('click', () => equipItem(i));
        }

        elements.inventoryGrid.appendChild(slot);
    }
}

function renderEquipment() {
    const slots = [
        { key: 'helm', label: 'Helm', icon: '⛑️' },
        { key: 'amulet', label: 'Amulet', icon: '📿' },
        { key: 'weapon', label: 'Weapon', icon: '⚔️' },
        { key: 'armor', label: 'Armor', icon: '🦺' },
        { key: 'ring1', label: 'Ring', icon: '💍' },
        { key: 'gloves', label: 'Gloves', icon: '🧤' },
        { key: 'belt', label: 'Belt', icon: '🎗️' },
        { key: 'ring2', label: 'Ring', icon: '💍' },
        { key: 'boots', label: 'Boots', icon: '👢' },
    ];

    elements.equipmentGrid.innerHTML = '';

    slots.forEach(({ key, label, icon }) => {
        const slot = document.createElement('div');
        slot.className = `equip-slot ${state.equipment[key] ? 'equipped' : ''}`;

        const equipped = state.equipment[key];
        slot.innerHTML = `
            <span class="equip-slot-icon">${equipped ? equipped.icon : icon}</span>
            <span class="equip-slot-label">${label}</span>
        `;

        if (equipped) {
            slot.classList.add(equipped.rarity);
            slot.addEventListener('mouseenter', (e) => showTooltip(e, equipped));
            slot.addEventListener('mouseleave', hideTooltip);
            slot.addEventListener('click', () => unequipItem(key));
        }

        elements.equipmentGrid.appendChild(slot);
    });
}

function renderRunes() {
    elements.runeGrid.innerHTML = '';

    RUNES.forEach(rune => {
        const slot = document.createElement('div');
        slot.className = `rune-slot ${state.runesCollected.includes(rune.name) ? 'collected' : ''}`;
        slot.textContent = rune.icon;
        slot.title = `${rune.name} (#${rune.number})`;
        elements.runeGrid.appendChild(slot);
    });
}

function renderRecentDrops() {
    elements.recentDrops.innerHTML = '';

    state.recentDrops.forEach(item => {
        const div = document.createElement('div');
        div.className = 'drop-item';
        div.innerHTML = `
            <div class="drop-item-name ${item.rarity}">${item.name}</div>
            <div class="drop-item-stats">${item.stats.join(' | ')}</div>
        `;
        elements.recentDrops.appendChild(div);
    });
}

// Equipment
function equipItem(inventoryIndex) {
    const item = state.inventory[inventoryIndex];
    if (!item) return;

    let slotKey = item.slot;

    // Handle rings (two slots)
    if (slotKey === 'ring') {
        if (!state.equipment.ring1) {
            slotKey = 'ring1';
        } else if (!state.equipment.ring2) {
            slotKey = 'ring2';
        } else {
            slotKey = 'ring1'; // Replace first ring
        }
    }

    // Swap if slot is occupied
    if (state.equipment[slotKey]) {
        state.inventory[inventoryIndex] = state.equipment[slotKey];
    } else {
        state.inventory.splice(inventoryIndex, 1);
    }

    state.equipment[slotKey] = item;

    renderInventory();
    renderEquipment();
    updateStats();
}

function unequipItem(slotKey) {
    if (!state.equipment[slotKey]) return;
    if (state.inventory.length >= 50) return;

    state.inventory.push(state.equipment[slotKey]);
    state.equipment[slotKey] = null;

    renderInventory();
    renderEquipment();
    updateStats();
}

// Tooltip
function showTooltip(e, item) {
    const tooltip = elements.tooltip;

    const rarityColors = {
        normal: '#aaa',
        magic: '#6666ff',
        rare: '#ffff00',
        unique: '#ffa500',
    };

    let statsHtml = '';
    if (item.minDmg || item.maxDmg) {
        statsHtml += `<div class="tooltip-stat">Damage: ${item.minDmg || 0}-${item.maxDmg || 0}</div>`;
    }
    if (item.defense) {
        statsHtml += `<div class="tooltip-stat">Defense: ${item.defense}</div>`;
    }

    for (const [stat, value] of Object.entries(item.stats || {})) {
        if (stat.endsWith('Percent')) continue;
        const isPercent = item.stats[stat + 'Percent'];
        statsHtml += `<div class="tooltip-stat">+${value}${isPercent ? '%' : ''} ${formatStatName(stat)}</div>`;
    }

    tooltip.innerHTML = `
        <div class="tooltip-name" style="color: ${rarityColors[item.rarity]}">${item.name}</div>
        <div class="tooltip-type">${item.slot ? item.slot.charAt(0).toUpperCase() + item.slot.slice(1) : ''} (Req Lvl ${item.reqLvl})</div>
        ${statsHtml}
        ${item.flavor ? `<div class="tooltip-flavor">${item.flavor}</div>` : ''}
    `;

    tooltip.style.display = 'block';
    tooltip.style.left = `${e.clientX + 15}px`;
    tooltip.style.top = `${e.clientY + 15}px`;
}

function hideTooltip() {
    elements.tooltip.style.display = 'none';
}

function formatStatName(stat) {
    const names = {
        minDmg: 'Min Damage',
        maxDmg: 'Max Damage',
        damage: 'Damage',
        defense: 'Defense',
        attackSpeed: 'Attack Speed',
        magicFind: 'Magic Find',
        goldFind: 'Gold Find',
        lifeSteal: 'Life Steal',
        life: 'Life',
    };
    return names[stat] || stat;
}

// Offline Progress
function checkOfflineGains() {
    const now = Date.now();
    const offlineTime = now - state.lastOnline;
    const offlineSeconds = Math.min(offlineTime / 1000, 8 * 60 * 60); // Cap at 8 hours

    if (offlineSeconds < 60) return; // Minimum 1 minute offline

    const zone = ZONES[state.currentZone];
    const killsPerSecond = getAttackSpeed() * 0.7; // Assume 70% efficiency offline
    const offlineKills = Math.floor(killsPerSecond * offlineSeconds);

    // Calculate offline gains
    const xpPerKill = zone.level * 7;
    const goldPerKill = zone.level * 5 * (1 + state.player.goldFind / 100);

    const totalXP = Math.floor(offlineKills * xpPerKill);
    const totalGold = Math.floor(offlineKills * goldPerKill);

    // Generate some offline loot
    const offlineLoot = [];
    const dropChance = 0.15;
    const potentialDrops = Math.floor(offlineKills * dropChance);
    const actualDrops = Math.min(potentialDrops, 10); // Cap at 10 items

    for (let i = 0; i < actualDrops && state.inventory.length < 50; i++) {
        const mf = state.player.magicFind;
        let rarity = 'normal';
        const roll = Math.random() * 1000;
        const mfBonus = mf * 2.5;

        if (roll < 5 + mfBonus * 0.1 && zone.drops.includes('unique')) {
            rarity = 'unique';
        } else if (roll < 50 + mfBonus * 0.5 && zone.drops.includes('rare')) {
            rarity = 'rare';
        } else if (roll < 200 + mfBonus && zone.drops.includes('magic')) {
            rarity = 'magic';
        }

        // Only show magic+ items
        if (rarity !== 'normal') {
            const types = Object.keys(ITEM_BASES);
            const type = types[Math.floor(Math.random() * types.length)];
            const validBases = ITEM_BASES[type].filter(b => b.reqLvl <= zone.level + 5);
            if (validBases.length > 0) {
                const base = validBases[Math.floor(Math.random() * validBases.length)];
                const item = { ...base, rarity, stats: {} };

                if (rarity === 'magic') {
                    addAffix(item, zone.level);
                } else if (rarity === 'rare') {
                    const numAffixes = 2 + Math.floor(Math.random() * 3);
                    for (let j = 0; j < numAffixes; j++) {
                        addAffix(item, zone.level);
                    }
                    item.name = generateRareName(base.name);
                } else if (rarity === 'unique') {
                    const uniqueOptions = UNIQUES.filter(u => u.baseName === base.name && u.reqLvl <= zone.level + 10);
                    if (uniqueOptions.length > 0) {
                        const unique = uniqueOptions[Math.floor(Math.random() * uniqueOptions.length)];
                        item.name = unique.name;
                        item.stats = unique.stats;
                        item.flavor = unique.flavor;
                        item.icon = unique.icon;
                    }
                }

                state.inventory.push(item);
                offlineLoot.push(item);
            }
        }
    }

    // Apply gains
    state.player.xp += totalXP;
    state.player.gold += totalGold;
    state.totalKills += offlineKills;

    checkLevelUp();

    // Show modal
    const hours = Math.floor(offlineSeconds / 3600);
    const minutes = Math.floor((offlineSeconds % 3600) / 60);

    elements.offlineSummary.innerHTML = `
        <p style="margin-bottom: 15px;">You were away for ${hours > 0 ? hours + 'h ' : ''}${minutes}m</p>
        <p style="color: #8b0000; font-size: 18px; margin-bottom: 10px;">☠️ ${formatNumber(offlineKills)} monsters slain</p>
        <p style="color: #4a9eff;">+${formatNumber(totalXP)} XP</p>
        <p style="color: #ffd700;">+${formatNumber(totalGold)} Gold</p>
    `;

    elements.offlineLoot.innerHTML = offlineLoot.map(item => {
        const rarityColors = { magic: '#6666ff', rare: '#ffff00', unique: '#ffa500' };
        return `<div style="padding: 5px 0; color: ${rarityColors[item.rarity]}">${item.icon} ${item.name}</div>`;
    }).join('');

    elements.offlineModal.classList.add('active');
}

// Save/Load
function saveGame() {
    state.lastSave = Date.now();
    state.lastOnline = Date.now();

    const saveData = {
        player: state.player,
        currentZone: state.currentZone,
        totalKills: state.totalKills,
        inventory: state.inventory,
        equipment: state.equipment,
        runesCollected: state.runesCollected,
        lastOnline: state.lastOnline,
        zonesUnlocked: ZONES.map(z => z.unlocked),
    };

    localStorage.setItem('lootGrindSave', JSON.stringify(saveData));
}

function loadGame() {
    const saved = localStorage.getItem('lootGrindSave');
    if (!saved) {
        spawnMonster();
        return;
    }

    try {
        const data = JSON.parse(saved);

        state.player = { ...state.player, ...data.player };
        state.currentZone = data.currentZone || 0;
        state.totalKills = data.totalKills || 0;
        state.inventory = data.inventory || [];
        state.equipment = data.equipment || state.equipment;
        state.runesCollected = data.runesCollected || [];
        state.lastOnline = data.lastOnline || Date.now();

        if (data.zonesUnlocked) {
            data.zonesUnlocked.forEach((unlocked, i) => {
                if (ZONES[i]) ZONES[i].unlocked = unlocked;
            });
        }

        const zone = ZONES[state.currentZone];
        elements.currentZone.textContent = zone.name;
        elements.zoneSubtitle.textContent = `Monster Level ${zone.level}`;
        elements.killCount.textContent = formatNumber(state.totalKills);

        spawnMonster();
    } catch (e) {
        console.error('Failed to load save:', e);
        spawnMonster();
    }
}

function resetGame() {
    if (!confirm('Are you sure you want to reset? All progress will be lost!')) return;

    localStorage.removeItem('lootGrindSave');
    location.reload();
}

// Event Listeners
function setupEventListeners() {
    // Tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const tabName = tab.dataset.tab;
            document.getElementById('inventoryTab').style.display = tabName === 'inventory' ? 'block' : 'none';
            document.getElementById('equipmentTab').style.display = tabName === 'equipment' ? 'block' : 'none';
            document.getElementById('runesTab').style.display = tabName === 'runes' ? 'block' : 'none';
        });
    });

    // Controls
    document.getElementById('sellJunkBtn').addEventListener('click', () => {
        const normalItems = state.inventory.filter(i => i.rarity === 'normal');
        const goldGain = normalItems.length * 10;
        state.inventory = state.inventory.filter(i => i.rarity !== 'normal');
        state.player.gold += goldGain;
        renderInventory();
        updateStats();
    });

    document.getElementById('resetBtn').addEventListener('click', resetGame);

    document.getElementById('claimOffline').addEventListener('click', () => {
        elements.offlineModal.classList.remove('active');
        renderInventory();
        updateStats();
    });

    // Tooltip positioning
    document.addEventListener('mousemove', (e) => {
        if (elements.tooltip.style.display === 'block') {
            elements.tooltip.style.left = `${e.clientX + 15}px`;
            elements.tooltip.style.top = `${e.clientY + 15}px`;
        }
    });
}

// Utility
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return Math.floor(num).toString();
}

// Start
init();
