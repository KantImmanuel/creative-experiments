/**
 * Echo Verse - Musical Universe Explorer
 * Combines: Procedural terrain, Particles, Audio synthesis, Discovery mechanics
 */

class EchoVerse {
    constructor() {
        // Canvases
        this.bgCanvas = document.getElementById('bgCanvas');
        this.worldCanvas = document.getElementById('worldCanvas');
        this.particleCanvas = document.getElementById('particleCanvas');
        this.bgCtx = this.bgCanvas.getContext('2d');
        this.worldCtx = this.worldCanvas.getContext('2d');
        this.particleCtx = this.particleCanvas.getContext('2d');

        // State
        this.started = false;
        this.camera = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.speed = 3;
        this.time = 0;
        this.keys = {};

        // World
        this.tileSize = 8;
        this.chunkSize = 48;
        this.chunkPixels = this.chunkSize * this.tileSize;
        this.chunks = new Map();
        this.permutation = this.generatePermutation();

        // Particles
        this.particles = [];
        this.maxParticles = 300;

        // Audio
        this.audioCtx = null;
        this.masterGain = null;
        this.currentBiome = null;
        this.biomeOscillators = new Map();
        this.analyser = null;
        this.analyserData = new Uint8Array(64);

        // Discoveries
        this.discoveries = new Set();
        this.artifacts = new Map(); // World position -> artifact
        this.artifactTypes = this.initArtifacts();

        // Biomes with musical properties
        this.biomes = this.initBiomes();

        this.init();
    }

    initBiomes() {
        return {
            void: {
                name: 'The Void',
                colors: [[10, 10, 20], [15, 15, 30], [20, 20, 40]],
                music: { baseFreq: 55, scale: [0, 3, 7, 10], tempo: 0.5, wave: 'sine', filterFreq: 400 },
                particleColor: 'rgba(100, 100, 200, 0.6)'
            },
            crystal: {
                name: 'Crystal Caverns',
                colors: [[40, 60, 80], [50, 80, 110], [60, 100, 140]],
                music: { baseFreq: 220, scale: [0, 4, 7, 11, 12], tempo: 1.2, wave: 'triangle', filterFreq: 2000 },
                particleColor: 'rgba(150, 200, 255, 0.7)'
            },
            ember: {
                name: 'Ember Fields',
                colors: [[60, 30, 20], [80, 40, 25], [100, 50, 30]],
                music: { baseFreq: 110, scale: [0, 2, 5, 7, 9], tempo: 0.8, wave: 'sawtooth', filterFreq: 800 },
                particleColor: 'rgba(255, 150, 50, 0.7)'
            },
            moss: {
                name: 'Moss Gardens',
                colors: [[30, 50, 35], [40, 65, 45], [50, 80, 55]],
                music: { baseFreq: 165, scale: [0, 2, 4, 7, 9, 11], tempo: 0.6, wave: 'sine', filterFreq: 1200 },
                particleColor: 'rgba(100, 200, 120, 0.6)'
            },
            echo: {
                name: 'Echo Peaks',
                colors: [[50, 50, 60], [70, 70, 85], [90, 90, 110]],
                music: { baseFreq: 330, scale: [0, 5, 7, 12], tempo: 1.5, wave: 'sine', filterFreq: 3000 },
                particleColor: 'rgba(200, 200, 255, 0.8)'
            },
            abyss: {
                name: 'The Abyss',
                colors: [[5, 10, 25], [10, 15, 35], [15, 25, 50]],
                music: { baseFreq: 40, scale: [0, 1, 5, 6, 10], tempo: 0.3, wave: 'sine', filterFreq: 200 },
                particleColor: 'rgba(80, 100, 180, 0.5)'
            }
        };
    }

    initArtifacts() {
        return [
            { emoji: '🔮', name: 'Resonance Crystal', effect: 'Adds harmonic overtones', found: false, audioEffect: 'harmonic' },
            { emoji: '🎵', name: 'Melody Shard', effect: 'Unlocks arpeggios', found: false, audioEffect: 'arpeggio' },
            { emoji: '⭐', name: 'Star Fragment', effect: 'Brightens particle trails', found: false, visualEffect: 'trails' },
            { emoji: '🌙', name: 'Moon Echo', effect: 'Adds reverb depth', found: false, audioEffect: 'reverb' },
            { emoji: '💎', name: 'Prism Heart', effect: 'Rainbow particle colors', found: false, visualEffect: 'rainbow' },
            { emoji: '🔔', name: 'Ancient Bell', effect: 'Unlocks bell tones', found: false, audioEffect: 'bell' },
            { emoji: '🌸', name: 'Bloom Essence', effect: 'Particles multiply', found: false, visualEffect: 'multiply' },
            { emoji: '⚡', name: 'Storm Core', effect: 'Electric bass pulses', found: false, audioEffect: 'pulse' },
            { emoji: '🎭', name: 'Phantom Mask', effect: 'Ghostly echoes', found: false, audioEffect: 'ghost' },
            { emoji: '🌊', name: 'Tide Stone', effect: 'Wave modulation', found: false, audioEffect: 'wave' },
        ];
    }

    init() {
        this.resize();
        this.setupEventListeners();
        this.createSoundBars();
        this.createInventory();
        this.animate();
    }

    resize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        [this.bgCanvas, this.worldCanvas, this.particleCanvas].forEach(c => {
            c.width = w;
            c.height = h;
        });
        this.width = w;
        this.height = h;
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());

        document.getElementById('startScreen').addEventListener('click', () => {
            this.start();
        });

        window.addEventListener('keydown', e => {
            this.keys[e.key.toLowerCase()] = true;
        });

        window.addEventListener('keyup', e => {
            this.keys[e.key.toLowerCase()] = false;
        });

        this.particleCanvas.addEventListener('click', (e) => {
            if (!this.started) return;
            this.handleClick(e.clientX, e.clientY);
        });
    }

    start() {
        if (this.started) return;
        this.started = true;
        document.getElementById('startScreen').classList.add('hidden');
        this.initAudio();
        this.spawnArtifacts();
    }

    initAudio() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.value = 0.3;

        // Analyser for visualization
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 128;
        this.analyserData = new Uint8Array(this.analyser.frequencyBinCount);

        // Reverb
        this.convolver = this.audioCtx.createConvolver();
        this.createReverb();
        this.reverbGain = this.audioCtx.createGain();
        this.reverbGain.gain.value = 0.2;

        // Main filter
        this.mainFilter = this.audioCtx.createBiquadFilter();
        this.mainFilter.type = 'lowpass';
        this.mainFilter.frequency.value = 1000;
        this.mainFilter.Q.value = 1;

        // Connect chain
        this.masterGain.connect(this.mainFilter);
        this.mainFilter.connect(this.analyser);
        this.analyser.connect(this.audioCtx.destination);

        // Reverb send
        this.masterGain.connect(this.convolver);
        this.convolver.connect(this.reverbGain);
        this.reverbGain.connect(this.audioCtx.destination);
    }

    createReverb() {
        const rate = this.audioCtx.sampleRate;
        const length = rate * 2.5;
        const impulse = this.audioCtx.createBuffer(2, length, rate);

        for (let ch = 0; ch < 2; ch++) {
            const data = impulse.getChannelData(ch);
            for (let i = 0; i < length; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
            }
        }
        this.convolver.buffer = impulse;
    }

    createSoundBars() {
        const container = document.getElementById('soundIndicator');
        for (let i = 0; i < 8; i++) {
            const bar = document.createElement('div');
            bar.className = 'sound-bar';
            bar.style.height = '5px';
            container.appendChild(bar);
        }
    }

    createInventory() {
        const container = document.getElementById('inventory');
        this.artifactTypes.forEach((artifact, i) => {
            const slot = document.createElement('div');
            slot.className = 'inventory-slot';
            slot.dataset.index = i;
            slot.title = artifact.name;
            container.appendChild(slot);
        });
    }

    spawnArtifacts() {
        // Scatter artifacts across the world
        const spread = 500;
        this.artifactTypes.forEach((artifact, i) => {
            const angle = (i / this.artifactTypes.length) * Math.PI * 2;
            const dist = 100 + Math.random() * spread;
            const x = Math.round(Math.cos(angle) * dist + (Math.random() - 0.5) * 200);
            const y = Math.round(Math.sin(angle) * dist + (Math.random() - 0.5) * 200);
            this.artifacts.set(`${x},${y}`, { ...artifact, x, y, index: i });
        });
    }

    handleClick(screenX, screenY) {
        // Check for nearby artifacts
        const worldX = Math.round(this.camera.x + (screenX - this.width / 2) / this.tileSize);
        const worldY = Math.round(this.camera.y + (screenY - this.height / 2) / this.tileSize);

        // Search in radius
        for (let dx = -3; dx <= 3; dx++) {
            for (let dy = -3; dy <= 3; dy++) {
                const key = `${worldX + dx},${worldY + dy}`;
                const artifact = this.artifacts.get(key);
                if (artifact && !artifact.found) {
                    this.collectArtifact(artifact);
                    return;
                }
            }
        }

        // Create interaction particles
        this.createBurst(screenX, screenY, 15);
        this.playInteractionSound();
    }

    collectArtifact(artifact) {
        artifact.found = true;
        this.discoveries.add(artifact.name);

        // Update UI
        document.getElementById('discoveryCount').textContent = this.discoveries.size;

        // Update inventory
        const slot = document.querySelector(`.inventory-slot[data-index="${artifact.index}"]`);
        slot.classList.add('found');
        slot.textContent = artifact.emoji;

        // Show popup
        this.showDiscoveryPopup(artifact);

        // Apply effect
        this.applyArtifactEffect(artifact);

        // Celebration particles
        const screenX = this.width / 2 + (artifact.x - this.camera.x) * this.tileSize;
        const screenY = this.height / 2 + (artifact.y - this.camera.y) * this.tileSize;
        this.createBurst(screenX, screenY, 40);

        // Sound
        this.playDiscoverySound();
    }

    showDiscoveryPopup(artifact) {
        const popup = document.getElementById('discoveryPopup');
        document.getElementById('popupEmoji').textContent = artifact.emoji;
        document.getElementById('popupName').textContent = artifact.name;
        document.getElementById('popupEffect').textContent = artifact.effect;

        popup.classList.add('show');
        setTimeout(() => popup.classList.remove('show'), 3000);
    }

    applyArtifactEffect(artifact) {
        // Audio effects
        if (artifact.audioEffect === 'reverb' && this.reverbGain) {
            this.reverbGain.gain.value = 0.5;
        }
        // Visual effects are checked in particle/render code via this.discoveries
    }

    playDiscoverySound() {
        if (!this.audioCtx) return;

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.1);
        osc.frequency.exponentialRampToValueAtTime(1320, this.audioCtx.currentTime + 0.2);

        gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.5);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.5);
    }

    playInteractionSound() {
        if (!this.audioCtx) return;

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        const biome = this.biomes[this.currentBiome] || this.biomes.void;
        const freq = biome.music.baseFreq * 2;

        osc.type = biome.music.wave;
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.2);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.2);
    }

    // Perlin noise
    generatePermutation() {
        const p = [];
        for (let i = 0; i < 256; i++) p[i] = i;
        for (let i = 255; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [p[i], p[j]] = [p[j], p[i]];
        }
        return [...p, ...p];
    }

    fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
    lerp(a, b, t) { return a + t * (b - a); }

    grad(hash, x, y) {
        const h = hash & 3;
        return ((h & 1) ? -x : x) + ((h & 2) ? -y : y);
    }

    noise(x, y) {
        const p = this.permutation;
        const X = Math.floor(x) & 255, Y = Math.floor(y) & 255;
        x -= Math.floor(x); y -= Math.floor(y);
        const u = this.fade(x), v = this.fade(y);
        const A = p[X] + Y, B = p[X + 1] + Y;
        return this.lerp(
            this.lerp(this.grad(p[A], x, y), this.grad(p[B], x - 1, y), u),
            this.lerp(this.grad(p[A + 1], x, y - 1), this.grad(p[B + 1], x - 1, y - 1), u), v
        );
    }

    fbm(x, y, octaves) {
        let v = 0, a = 0.5, f = 1, m = 0;
        for (let i = 0; i < octaves; i++) {
            v += a * this.noise(x * f, y * f);
            m += a; a *= 0.5; f *= 2;
        }
        return v / m;
    }

    getBiomeAt(wx, wy) {
        const scale = 0.008;
        const e = this.fbm(wx * scale, wy * scale, 4);
        const m = this.fbm(wx * scale * 0.5 + 500, wy * scale * 0.5 + 500, 3);

        if (e < -0.3) return 'abyss';
        if (e < -0.1) return 'void';
        if (e > 0.4) return 'echo';
        if (m > 0.2) return 'crystal';
        if (m < -0.2) return 'ember';
        return 'moss';
    }

    generateChunk(cx, cy) {
        const canvas = document.createElement('canvas');
        canvas.width = this.chunkPixels;
        canvas.height = this.chunkPixels;
        const ctx = canvas.getContext('2d');
        const imgData = ctx.createImageData(this.chunkPixels, this.chunkPixels);
        const data = imgData.data;

        const worldOffX = cx * this.chunkSize;
        const worldOffY = cy * this.chunkSize;

        for (let ty = 0; ty < this.chunkSize; ty++) {
            for (let tx = 0; tx < this.chunkSize; tx++) {
                const wx = worldOffX + tx;
                const wy = worldOffY + ty;

                const biomeKey = this.getBiomeAt(wx, wy);
                const biome = this.biomes[biomeKey];
                const detail = (this.noise(wx * 0.1, wy * 0.1) + 1) / 2;
                const colorIdx = Math.floor(detail * 2.99);
                const color = biome.colors[colorIdx];

                for (let py = 0; py < this.tileSize; py++) {
                    for (let px = 0; px < this.tileSize; px++) {
                        const idx = ((ty * this.tileSize + py) * this.chunkPixels + tx * this.tileSize + px) * 4;
                        data[idx] = color[0];
                        data[idx + 1] = color[1];
                        data[idx + 2] = color[2];
                        data[idx + 3] = 255;
                    }
                }
            }
        }

        ctx.putImageData(imgData, 0, 0);
        return canvas;
    }

    getChunk(cx, cy) {
        const key = `${cx},${cy}`;
        if (!this.chunks.has(key)) {
            if (this.chunks.size > 30) {
                const first = this.chunks.keys().next().value;
                this.chunks.delete(first);
            }
            this.chunks.set(key, this.generateChunk(cx, cy));
        }
        return this.chunks.get(key);
    }

    updateMovement() {
        let tx = 0, ty = 0;
        if (this.keys['w'] || this.keys['arrowup']) ty = -this.speed;
        if (this.keys['s'] || this.keys['arrowdown']) ty = this.speed;
        if (this.keys['a'] || this.keys['arrowleft']) tx = -this.speed;
        if (this.keys['d'] || this.keys['arrowright']) tx = this.speed;

        if (tx && ty) { tx *= 0.707; ty *= 0.707; }

        this.velocity.x += (tx - this.velocity.x) * 0.15;
        this.velocity.y += (ty - this.velocity.y) * 0.15;
        this.camera.x += this.velocity.x;
        this.camera.y += this.velocity.y;

        // Spawn movement particles
        if (Math.abs(this.velocity.x) > 0.5 || Math.abs(this.velocity.y) > 0.5) {
            if (Math.random() < 0.3 && this.particles.length < this.maxParticles) {
                this.spawnMovementParticle();
            }
        }
    }

    spawnMovementParticle() {
        const biome = this.biomes[this.currentBiome] || this.biomes.void;
        const hasRainbow = this.discoveries.has('Prism Heart');

        let color = biome.particleColor;
        if (hasRainbow) {
            const hue = (this.time * 50) % 360;
            color = `hsla(${hue}, 70%, 60%, 0.7)`;
        }

        this.particles.push({
            x: this.width / 2 + (Math.random() - 0.5) * 20,
            y: this.height / 2 + (Math.random() - 0.5) * 20,
            vx: -this.velocity.x * 0.5 + (Math.random() - 0.5) * 2,
            vy: -this.velocity.y * 0.5 + (Math.random() - 0.5) * 2,
            life: 1,
            decay: 0.015,
            radius: 2 + Math.random() * 3,
            color: color
        });
    }

    createBurst(x, y, count) {
        const biome = this.biomes[this.currentBiome] || this.biomes.void;
        const hasMultiply = this.discoveries.has('Bloom Essence');
        const actualCount = hasMultiply ? count * 2 : count;

        for (let i = 0; i < actualCount && this.particles.length < this.maxParticles * 2; i++) {
            const angle = (Math.PI * 2 / actualCount) * i;
            const speed = 2 + Math.random() * 4;

            let color = biome.particleColor;
            if (this.discoveries.has('Prism Heart')) {
                const hue = (i / actualCount) * 360;
                color = `hsla(${hue}, 80%, 60%, 0.8)`;
            }

            this.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                decay: 0.02,
                radius: 2 + Math.random() * 2,
                color: color
            });
        }
    }

    updateParticles() {
        const hasTrails = this.discoveries.has('Star Fragment');

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.98;
            p.vy *= 0.98;
            p.life -= p.decay * (hasTrails ? 0.5 : 1);

            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    updateBiomeAudio() {
        const biomeKey = this.getBiomeAt(Math.round(this.camera.x), Math.round(this.camera.y));

        if (biomeKey !== this.currentBiome) {
            this.currentBiome = biomeKey;
            const biome = this.biomes[biomeKey];

            // Update biome name display
            const nameEl = document.getElementById('biomeName');
            nameEl.textContent = biome.name;
            nameEl.classList.add('visible');
            setTimeout(() => nameEl.classList.remove('visible'), 2000);

            // Update filter
            if (this.mainFilter) {
                this.mainFilter.frequency.setTargetAtTime(biome.music.filterFreq, this.audioCtx.currentTime, 0.5);
            }
        }

        // Play ambient notes
        if (this.audioCtx && Math.random() < 0.02) {
            this.playAmbientNote();
        }
    }

    playAmbientNote() {
        const biome = this.biomes[this.currentBiome];
        if (!biome) return;

        const music = biome.music;
        const scale = music.scale;
        const noteIndex = Math.floor(Math.random() * scale.length);
        const semitone = scale[noteIndex];
        const freq = music.baseFreq * Math.pow(2, semitone / 12);

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = music.wave;
        osc.frequency.value = freq;

        const now = this.audioCtx.currentTime;
        const duration = 0.5 + Math.random() * 1.5;

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

        osc.connect(gain);
        gain.connect(this.masterGain);

        // Arpeggio effect
        if (this.discoveries.has('Melody Shard') && Math.random() < 0.3) {
            const osc2 = this.audioCtx.createOscillator();
            const gain2 = this.audioCtx.createGain();
            osc2.type = music.wave;
            osc2.frequency.value = freq * 1.5;
            gain2.gain.setValueAtTime(0, now + 0.1);
            gain2.gain.linearRampToValueAtTime(0.05, now + 0.2);
            gain2.gain.exponentialRampToValueAtTime(0.01, now + duration);
            osc2.connect(gain2);
            gain2.connect(this.masterGain);
            osc2.start(now + 0.1);
            osc2.stop(now + duration);
        }

        // Harmonic effect
        if (this.discoveries.has('Resonance Crystal')) {
            const osc3 = this.audioCtx.createOscillator();
            const gain3 = this.audioCtx.createGain();
            osc3.type = 'sine';
            osc3.frequency.value = freq * 2;
            gain3.gain.setValueAtTime(0, now);
            gain3.gain.linearRampToValueAtTime(0.03, now + 0.1);
            gain3.gain.exponentialRampToValueAtTime(0.01, now + duration * 0.7);
            osc3.connect(gain3);
            gain3.connect(this.masterGain);
            osc3.start();
            osc3.stop(now + duration * 0.7);
        }

        osc.start();
        osc.stop(now + duration);
    }

    updateSoundBars() {
        if (!this.analyser) return;

        this.analyser.getByteFrequencyData(this.analyserData);
        const bars = document.querySelectorAll('.sound-bar');

        bars.forEach((bar, i) => {
            const value = this.analyserData[i * 4] || 0;
            const height = 5 + (value / 255) * 25;
            bar.style.height = height + 'px';
        });
    }

    render() {
        // Clear particle canvas
        this.particleCtx.clearRect(0, 0, this.width, this.height);

        if (!this.started) return;

        // Render world
        const camPxX = this.camera.x * this.tileSize;
        const camPxY = this.camera.y * this.tileSize;

        const startCX = Math.floor((camPxX - this.width / 2) / this.chunkPixels);
        const startCY = Math.floor((camPxY - this.height / 2) / this.chunkPixels);
        const endCX = Math.ceil((camPxX + this.width / 2) / this.chunkPixels);
        const endCY = Math.ceil((camPxY + this.height / 2) / this.chunkPixels);

        this.worldCtx.clearRect(0, 0, this.width, this.height);

        for (let cy = startCY; cy <= endCY; cy++) {
            for (let cx = startCX; cx <= endCX; cx++) {
                const chunk = this.getChunk(cx, cy);
                const sx = cx * this.chunkPixels - camPxX + this.width / 2;
                const sy = cy * this.chunkPixels - camPxY + this.height / 2;
                this.worldCtx.drawImage(chunk, sx, sy);
            }
        }

        // Render artifacts (unfound ones glow)
        this.artifacts.forEach(artifact => {
            if (artifact.found) return;

            const sx = (artifact.x - this.camera.x) * this.tileSize + this.width / 2;
            const sy = (artifact.y - this.camera.y) * this.tileSize + this.height / 2;

            if (sx < -50 || sx > this.width + 50 || sy < -50 || sy > this.height + 50) return;

            // Pulsing glow
            const pulse = Math.sin(this.time * 3) * 0.3 + 0.7;
            const glowSize = 15 + pulse * 10;

            this.worldCtx.shadowColor = 'rgba(255, 255, 200, 0.8)';
            this.worldCtx.shadowBlur = glowSize;
            this.worldCtx.font = '16px serif';
            this.worldCtx.textAlign = 'center';
            this.worldCtx.fillText(artifact.emoji, sx, sy);
            this.worldCtx.shadowBlur = 0;
        });

        // Render particles
        for (const p of this.particles) {
            this.particleCtx.globalAlpha = p.life;
            this.particleCtx.fillStyle = p.color;
            this.particleCtx.beginPath();
            this.particleCtx.arc(p.x, p.y, p.radius * p.life, 0, Math.PI * 2);
            this.particleCtx.fill();
        }
        this.particleCtx.globalAlpha = 1;

        // Player indicator
        this.particleCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.particleCtx.beginPath();
        this.particleCtx.arc(this.width / 2, this.height / 2, 4, 0, Math.PI * 2);
        this.particleCtx.fill();

        // Update coords
        document.getElementById('coords').textContent =
            `${Math.round(this.camera.x)}, ${Math.round(this.camera.y)}`;
    }

    animate() {
        this.time += 0.016;

        if (this.started) {
            this.updateMovement();
            this.updateBiomeAudio();
            this.updateParticles();
            this.updateSoundBars();
        }

        this.render();
        requestAnimationFrame(() => this.animate());
    }
}

// Start
new EchoVerse();
