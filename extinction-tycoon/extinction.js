/**
 * Mass Extinction Tycoon
 * "Nature's balance is overrated anyway."
 */

class ExtinctionTycoon {
    constructor() {
        this.canvas = document.getElementById('earthCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Game state
        this.paused = false;
        this.time = 0;
        this.gameSpeed = 1;

        // Resources
        this.extinctionPoints = 50;
        this.pointsPerSecond = 1;
        this.totalKills = 0;
        this.speciesExtinct = 0;

        // Timeline (millions of years ago)
        this.currentYear = 538;
        this.era = 'Cambrian';

        // Active effects
        this.activeEvents = [];
        this.particles = [];

        // Initialize
        this.initSpecies();
        this.initTools();
        this.initUpgrades();
        this.initAchievements();
        this.initEras();

        this.resize();
        this.setupEventListeners();
        this.render();
        this.gameLoop();
    }

    initSpecies() {
        // Species with population, resilience, and value
        this.allSpecies = [
            // Cambrian
            { id: 'trilobite', name: 'Trilobites', icon: '🦐', pop: 1000000, maxPop: 1000000, resilience: 0.3, era: 'Cambrian', value: 1 },
            { id: 'anomalocaris', name: 'Anomalocaris', icon: '🦑', pop: 500000, maxPop: 500000, resilience: 0.4, era: 'Cambrian', value: 2 },
            { id: 'hallucigenia', name: 'Hallucigenia', icon: '🐛', pop: 800000, maxPop: 800000, resilience: 0.2, era: 'Cambrian', value: 1 },

            // Devonian
            { id: 'placoderm', name: 'Placoderms', icon: '🐟', pop: 0, maxPop: 2000000, resilience: 0.5, era: 'Devonian', value: 3 },
            { id: 'coelacanth', name: 'Coelacanths', icon: '🐠', pop: 0, maxPop: 1000000, resilience: 0.8, era: 'Devonian', value: 5 },

            // Carboniferous
            { id: 'meganeura', name: 'Giant Dragonflies', icon: '🪰', pop: 0, maxPop: 3000000, resilience: 0.3, era: 'Carboniferous', value: 2 },
            { id: 'arthropleura', name: 'Arthropleura', icon: '🐛', pop: 0, maxPop: 500000, resilience: 0.4, era: 'Carboniferous', value: 4 },

            // Permian
            { id: 'dimetrodon', name: 'Dimetrodon', icon: '🦎', pop: 0, maxPop: 800000, resilience: 0.5, era: 'Permian', value: 5 },
            { id: 'gorgonopsid', name: 'Gorgonopsids', icon: '🐺', pop: 0, maxPop: 400000, resilience: 0.6, era: 'Permian', value: 6 },

            // Triassic
            { id: 'eoraptor', name: 'Early Dinosaurs', icon: '🦖', pop: 0, maxPop: 600000, resilience: 0.5, era: 'Triassic', value: 7 },
            { id: 'pterosaur', name: 'Pterosaurs', icon: '🦅', pop: 0, maxPop: 1000000, resilience: 0.4, era: 'Triassic', value: 6 },

            // Jurassic
            { id: 'sauropod', name: 'Sauropods', icon: '🦕', pop: 0, maxPop: 500000, resilience: 0.7, era: 'Jurassic', value: 10 },
            { id: 'allosaurus', name: 'Allosaurus', icon: '🦖', pop: 0, maxPop: 200000, resilience: 0.6, era: 'Jurassic', value: 12 },
            { id: 'stegosaurus', name: 'Stegosaurus', icon: '🦕', pop: 0, maxPop: 400000, resilience: 0.5, era: 'Jurassic', value: 8 },

            // Cretaceous
            { id: 'trex', name: 'T-Rex', icon: '🦖', pop: 0, maxPop: 100000, resilience: 0.7, era: 'Cretaceous', value: 20 },
            { id: 'triceratops', name: 'Triceratops', icon: '🦏', pop: 0, maxPop: 300000, resilience: 0.6, era: 'Cretaceous', value: 15 },
            { id: 'velociraptor', name: 'Velociraptors', icon: '🦖', pop: 0, maxPop: 500000, resilience: 0.5, era: 'Cretaceous', value: 10 },

            // Cenozoic
            { id: 'mammoth', name: 'Mammoths', icon: '🦣', pop: 0, maxPop: 800000, resilience: 0.5, era: 'Cenozoic', value: 12 },
            { id: 'sabertooth', name: 'Sabertooth Cats', icon: '🐅', pop: 0, maxPop: 200000, resilience: 0.6, era: 'Cenozoic', value: 15 },
            { id: 'megatherium', name: 'Giant Sloths', icon: '🦥', pop: 0, maxPop: 300000, resilience: 0.4, era: 'Cenozoic', value: 10 },
            { id: 'terror_bird', name: 'Terror Birds', icon: '🐦', pop: 0, maxPop: 400000, resilience: 0.5, era: 'Cenozoic', value: 8 },
        ];

        this.species = this.allSpecies.filter(s => s.era === 'Cambrian');
    }

    initEras() {
        this.eras = [
            { name: 'Cambrian', start: 538, end: 485, color: '#2a4a3a' },
            { name: 'Ordovician', start: 485, end: 443, color: '#3a5a4a' },
            { name: 'Silurian', start: 443, end: 419, color: '#4a6a5a' },
            { name: 'Devonian', start: 419, end: 358, color: '#3a5a6a' },
            { name: 'Carboniferous', start: 358, end: 298, color: '#2a4a2a' },
            { name: 'Permian', start: 298, end: 252, color: '#5a4a3a' },
            { name: 'Triassic', start: 252, end: 201, color: '#6a5a4a' },
            { name: 'Jurassic', start: 201, end: 145, color: '#4a6a4a' },
            { name: 'Cretaceous', start: 145, end: 66, color: '#5a6a5a' },
            { name: 'Cenozoic', start: 66, end: 0, color: '#6a6a5a' },
        ];
    }

    initTools() {
        this.tools = [
            {
                id: 'meteor_shower',
                name: 'Meteor Shower',
                icon: '☄️',
                desc: 'Small rocks from space. Annoying but survivable.',
                cost: 10,
                power: 5,
                cooldown: 0,
                maxCooldown: 3,
                unlocked: true,
                effect: (species) => species.pop * 0.05
            },
            {
                id: 'volcanic_eruption',
                name: 'Volcanic Eruption',
                icon: '🌋',
                desc: 'Localized devastation. Great for islands.',
                cost: 25,
                power: 15,
                cooldown: 0,
                maxCooldown: 5,
                unlocked: true,
                effect: (species) => species.pop * 0.15
            },
            {
                id: 'ice_age',
                name: 'Ice Age',
                icon: '🥶',
                desc: 'Slow but thorough. Tropical species hate this.',
                cost: 50,
                power: 30,
                cooldown: 0,
                maxCooldown: 10,
                unlocked: false,
                unlockCost: 100,
                effect: (species) => species.pop * 0.25
            },
            {
                id: 'supervolcano',
                name: 'Supervolcano',
                icon: '🔥',
                desc: 'Block out the sun. Everything suffers.',
                cost: 100,
                power: 50,
                cooldown: 0,
                maxCooldown: 15,
                unlocked: false,
                unlockCost: 250,
                effect: (species) => species.pop * 0.4
            },
            {
                id: 'asteroid',
                name: 'Extinction Asteroid',
                icon: '💥',
                desc: 'The classic. Ask the dinosaurs.',
                cost: 500,
                power: 90,
                cooldown: 0,
                maxCooldown: 30,
                unlocked: false,
                unlockCost: 1000,
                effect: (species) => species.pop * 0.7
            },
            {
                id: 'gamma_burst',
                name: 'Gamma Ray Burst',
                icon: '⚡',
                desc: 'Sterilize half the planet instantly.',
                cost: 1000,
                power: 95,
                cooldown: 0,
                maxCooldown: 60,
                unlocked: false,
                unlockCost: 5000,
                effect: (species) => species.pop * 0.85
            },
        ];
    }

    initUpgrades() {
        this.upgrades = [
            { id: 'efficiency1', name: 'Orbital Mechanics', desc: '+50% extinction points', cost: 100, bought: false, effect: () => this.pointsPerSecond *= 1.5 },
            { id: 'efficiency2', name: 'Impact Angles', desc: '+100% extinction points', cost: 500, bought: false, effect: () => this.pointsPerSecond *= 2 },
            { id: 'cooldown1', name: 'Rapid Fire', desc: '-25% cooldowns', cost: 300, bought: false, effect: () => this.tools.forEach(t => t.maxCooldown *= 0.75) },
            { id: 'power1', name: 'Bigger Rocks', desc: '+25% damage', cost: 400, bought: false, effect: () => this.damageMultiplier = (this.damageMultiplier || 1) * 1.25 },
            { id: 'chain', name: 'Chain Reaction', desc: 'Events spread', cost: 800, bought: false, effect: () => this.chainReaction = true },
        ];
        this.damageMultiplier = 1;
        this.chainReaction = false;
    }

    initAchievements() {
        this.achievements = [
            { id: 'first_blood', name: 'First Blood', desc: 'Kill 1,000 organisms', icon: '🩸', condition: () => this.totalKills >= 1000, unlocked: false },
            { id: 'mass_murder', name: 'Mass Murderer', desc: 'Kill 1,000,000 organisms', icon: '💀', condition: () => this.totalKills >= 1000000, unlocked: false },
            { id: 'extinction', name: 'Extinction Event', desc: 'Drive a species extinct', icon: '☠️', condition: () => this.speciesExtinct >= 1, unlocked: false },
            { id: 'serial', name: 'Serial Extinctionist', desc: 'Extinct 5 species', icon: '🏆', condition: () => this.speciesExtinct >= 5, unlocked: false },
            { id: 'asteroid_user', name: 'Dinosaur Hater', desc: 'Use the asteroid', icon: '☄️', condition: () => this.asteroidsUsed >= 1, unlocked: false },
            { id: 'completionist', name: 'Nature is Overrated', desc: 'Extinct 10 species', icon: '👑', condition: () => this.speciesExtinct >= 10, unlocked: false },
            { id: 'speedrun', name: 'Speedrunner', desc: 'Extinct a species in 30 seconds', icon: '⚡', condition: () => this.fastestExtinction <= 30, unlocked: false },
            { id: 'patient', name: 'Patient Destroyer', desc: 'Play for 10 minutes', icon: '⏰', condition: () => this.playTime >= 600, unlocked: false },
        ];
        this.asteroidsUsed = 0;
        this.fastestExtinction = Infinity;
        this.playTime = 0;
        this.speciesTimers = {};
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());

        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.paused = !this.paused;
            document.getElementById('pauseBtn').textContent = this.paused ? 'Resume' : 'Pause';
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            if (confirm('Reset all progress?')) {
                location.reload();
            }
        });

        this.renderTools();
        this.renderUpgrades();
        this.renderAchievements();
    }

    resize() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    }

    renderTools() {
        const container = document.getElementById('toolsList');
        container.innerHTML = '';

        this.tools.forEach(tool => {
            const div = document.createElement('div');
            div.className = `extinction-tool ${tool.unlocked ? '' : 'locked'} ${tool.cooldown > 0 ? 'cooling' : ''}`;
            div.innerHTML = `
                <div class="tool-header">
                    <span class="tool-name">${tool.name}</span>
                    <span class="tool-icon">${tool.icon}</span>
                </div>
                <div class="tool-desc">${tool.desc}</div>
                <div class="tool-stats">
                    <span class="tool-cost">${tool.unlocked ? `Cost: ${tool.cost} EP` : `Unlock: ${tool.unlockCost} EP`}</span>
                    <span class="tool-power">Power: ${tool.power}%</span>
                </div>
                ${tool.cooldown > 0 ? `<div style="font-size: 10px; color: #ff4444; margin-top: 5px;">Cooling: ${Math.ceil(tool.cooldown)}s</div>` : ''}
            `;

            div.addEventListener('click', () => this.useTool(tool));
            container.appendChild(div);
        });
    }

    renderUpgrades() {
        const container = document.getElementById('upgradesList');
        container.innerHTML = '';

        this.upgrades.filter(u => !u.bought).forEach(upgrade => {
            const div = document.createElement('div');
            div.className = 'extinction-tool';
            div.innerHTML = `
                <div class="tool-header">
                    <span class="tool-name">${upgrade.name}</span>
                    <span class="tool-icon">⬆️</span>
                </div>
                <div class="tool-desc">${upgrade.desc}</div>
                <div class="tool-stats">
                    <span class="tool-cost">Cost: ${upgrade.cost} EP</span>
                </div>
            `;

            div.addEventListener('click', () => this.buyUpgrade(upgrade));
            container.appendChild(div);
        });
    }

    renderAchievements() {
        const container = document.getElementById('achievements');
        container.innerHTML = '';

        this.achievements.forEach(ach => {
            const div = document.createElement('div');
            div.className = `achievement ${ach.unlocked ? 'unlocked' : ''}`;
            div.textContent = ach.icon;
            div.title = `${ach.name}: ${ach.desc}`;
            container.appendChild(div);
        });
    }

    renderSpecies() {
        const container = document.getElementById('speciesList');
        container.innerHTML = '';

        this.species
            .sort((a, b) => a.pop - b.pop)
            .forEach(species => {
                const percent = species.pop / species.maxPop;
                const status = species.pop === 0 ? 'extinct' : percent < 0.2 ? 'endangered' : '';
                const barClass = percent < 0.1 ? 'critical' : percent < 0.3 ? 'low' : '';

                const div = document.createElement('div');
                div.className = `species-item ${status}`;
                div.innerHTML = `
                    <span class="species-icon">${species.icon}</span>
                    <div class="species-info">
                        <div class="species-name">${species.name}</div>
                        <div class="species-pop">${this.formatNumber(species.pop)} ${species.pop === 0 ? '(EXTINCT)' : ''}</div>
                    </div>
                    <div class="species-bar">
                        <div class="species-bar-fill ${barClass}" style="width: ${percent * 100}%"></div>
                    </div>
                `;
                container.appendChild(div);
            });
    }

    useTool(tool) {
        if (!tool.unlocked) {
            if (this.extinctionPoints >= tool.unlockCost) {
                this.extinctionPoints -= tool.unlockCost;
                tool.unlocked = true;
                this.logEvent(`Unlocked ${tool.name}!`, 'achievement');
                this.renderTools();
            }
            return;
        }

        if (tool.cooldown > 0 || this.extinctionPoints < tool.cost) return;

        this.extinctionPoints -= tool.cost;
        tool.cooldown = tool.maxCooldown;

        if (tool.id === 'asteroid') this.asteroidsUsed++;

        // Apply damage to all species
        let totalKilled = 0;
        this.species.forEach(species => {
            if (species.pop > 0) {
                const baseDamage = tool.effect(species);
                const damage = Math.floor(baseDamage * this.damageMultiplier * (1 - species.resilience * 0.5));
                const killed = Math.min(species.pop, damage);
                species.pop -= killed;
                totalKilled += killed;

                if (species.pop <= 0) {
                    species.pop = 0;
                    this.speciesExtinct++;
                    const time = (Date.now() - (this.speciesTimers[species.id] || Date.now())) / 1000;
                    if (time < this.fastestExtinction) this.fastestExtinction = time;
                    this.logEvent(`${species.name} went EXTINCT!`, 'extinction');
                }
            }
        });

        this.totalKills += totalKilled;
        this.logEvent(`${tool.name}: ${this.formatNumber(totalKilled)} casualties`, 'death');

        // Visual effect
        this.createExplosion(tool);

        // Chain reaction
        if (this.chainReaction && Math.random() < 0.3) {
            setTimeout(() => {
                const randomTool = this.tools.find(t => t.unlocked && t.cooldown === 0 && t.cost <= this.extinctionPoints);
                if (randomTool) {
                    this.logEvent('Chain reaction triggered!', 'achievement');
                    this.useTool(randomTool);
                }
            }, 500);
        }

        this.renderTools();
    }

    buyUpgrade(upgrade) {
        if (this.extinctionPoints >= upgrade.cost && !upgrade.bought) {
            this.extinctionPoints -= upgrade.cost;
            upgrade.bought = true;
            upgrade.effect();
            this.logEvent(`Purchased ${upgrade.name}`, 'achievement');
            this.renderUpgrades();
        }
    }

    createExplosion(tool) {
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;
        const count = tool.power;

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 5;
            const hue = tool.id.includes('ice') ? 200 : tool.id.includes('gamma') ? 280 : 20;

            this.particles.push({
                x: cx + (Math.random() - 0.5) * 100,
                y: cy + (Math.random() - 0.5) * 100,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                decay: 0.02,
                size: 3 + Math.random() * 5,
                hue: hue
            });
        }

        // Screen shake
        this.canvas.classList.add('shaking');
        setTimeout(() => this.canvas.classList.remove('shaking'), 200);
    }

    updateEra() {
        const currentEra = this.eras.find(e => this.currentYear <= e.start && this.currentYear > e.end);
        if (currentEra && currentEra.name !== this.era) {
            this.era = currentEra.name;
            this.logEvent(`Entered ${this.era} Period`, 'achievement');

            // Spawn new species for this era
            const newSpecies = this.allSpecies.filter(s => s.era === this.era && !this.species.find(sp => sp.id === s.id));
            newSpecies.forEach(s => {
                s.pop = s.maxPop;
                this.species.push(s);
                this.speciesTimers[s.id] = Date.now();
                this.logEvent(`${s.name} evolved!`, 'achievement');
            });
        }

        document.getElementById('eraDisplay').textContent = `${this.era} Period`;
        document.getElementById('yearDisplay').textContent = `${this.currentYear} Million Years Ago`;
    }

    logEvent(message, type = '') {
        const log = document.getElementById('eventLog');
        const event = document.createElement('div');
        event.className = `event ${type}`;
        event.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        log.insertBefore(event, log.firstChild);

        if (log.children.length > 50) {
            log.removeChild(log.lastChild);
        }
    }

    formatNumber(num) {
        if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return Math.floor(num).toString();
    }

    checkAchievements() {
        this.achievements.forEach(ach => {
            if (!ach.unlocked && ach.condition()) {
                ach.unlocked = true;
                this.logEvent(`Achievement: ${ach.name}!`, 'achievement');
                this.extinctionPoints += 50;
                this.renderAchievements();
            }
        });
    }

    update(dt) {
        if (this.paused) return;

        this.time += dt;
        this.playTime += dt;

        // Progress time (moving towards present)
        this.currentYear = Math.max(0, this.currentYear - dt * 0.5 * this.gameSpeed);
        this.updateEra();

        // Earn points
        this.extinctionPoints += this.pointsPerSecond * dt;

        // Species slowly recover
        this.species.forEach(species => {
            if (species.pop > 0 && species.pop < species.maxPop) {
                species.pop = Math.min(species.maxPop, species.pop + species.maxPop * 0.01 * dt);
            }
        });

        // Update cooldowns
        this.tools.forEach(tool => {
            if (tool.cooldown > 0) {
                tool.cooldown = Math.max(0, tool.cooldown - dt);
            }
        });

        // Update particles
        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1;
            p.life -= p.decay;
            return p.life > 0;
        });

        // Check achievements
        this.checkAchievements();

        // Calculate biodiversity
        const totalPop = this.species.reduce((sum, s) => sum + s.pop, 0);
        const maxPop = this.species.reduce((sum, s) => sum + s.maxPop, 0);
        const biodiversity = maxPop > 0 ? (totalPop / maxPop) * 100 : 0;

        document.getElementById('biodiversityFill').style.width = biodiversity + '%';
        document.getElementById('biodiversityPercent').textContent = Math.round(biodiversity);
    }

    render() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Get current era color
        const currentEra = this.eras.find(e => this.currentYear <= e.start && this.currentYear > e.end);
        const bgColor = currentEra ? currentEra.color : '#2a4a3a';

        // Background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, w, h);

        // Draw simple earth representation
        const earthRadius = Math.min(w, h) * 0.35;
        const cx = w / 2;
        const cy = h / 2;

        // Earth glow
        const glow = ctx.createRadialGradient(cx, cy, earthRadius * 0.8, cx, cy, earthRadius * 1.2);
        glow.addColorStop(0, 'rgba(100, 200, 100, 0.3)');
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(cx, cy, earthRadius * 1.2, 0, Math.PI * 2);
        ctx.fill();

        // Earth
        const earthGradient = ctx.createRadialGradient(cx - earthRadius * 0.3, cy - earthRadius * 0.3, 0, cx, cy, earthRadius);
        earthGradient.addColorStop(0, '#4a8a4a');
        earthGradient.addColorStop(0.5, '#3a6a5a');
        earthGradient.addColorStop(1, '#2a4a3a');
        ctx.fillStyle = earthGradient;
        ctx.beginPath();
        ctx.arc(cx, cy, earthRadius, 0, Math.PI * 2);
        ctx.fill();

        // Continents (simple shapes based on era)
        ctx.fillStyle = '#5a9a5a';
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2 + this.time * 0.01;
            const dist = earthRadius * 0.5;
            const size = earthRadius * (0.2 + Math.sin(i * 1234) * 0.1);
            ctx.beginPath();
            ctx.arc(cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist, size, 0, Math.PI * 2);
            ctx.fill();
        }

        // Species icons orbiting
        this.species.filter(s => s.pop > 0).forEach((species, i) => {
            const angle = (i / this.species.length) * Math.PI * 2 + this.time * 0.5;
            const dist = earthRadius * 1.1;
            const x = cx + Math.cos(angle) * dist;
            const y = cy + Math.sin(angle) * dist;

            ctx.font = '20px serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(species.icon, x, y);
        });

        // Particles
        this.particles.forEach(p => {
            ctx.fillStyle = `hsla(${p.hue}, 80%, 50%, ${p.life})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            ctx.fill();
        });

        // Update UI
        document.getElementById('extinctionPoints').textContent = this.formatNumber(this.extinctionPoints);
        document.getElementById('pointsRate').textContent = `+${this.formatNumber(this.pointsPerSecond)}/sec`;
        document.getElementById('killCount').textContent = this.formatNumber(this.totalKills);
        document.getElementById('speciesExtinct').textContent = this.speciesExtinct;
    }

    gameLoop() {
        const now = Date.now();
        const dt = Math.min((now - (this.lastUpdate || now)) / 1000, 0.1);
        this.lastUpdate = now;

        this.update(dt);
        this.render();
        this.renderSpecies();

        if (this.time % 1 < 0.016) {
            this.renderTools();
        }

        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start the game
new ExtinctionTycoon();
