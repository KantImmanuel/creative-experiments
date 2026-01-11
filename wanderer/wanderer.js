/**
 * Wanderer - Infinite Procedural Terrain Explorer
 * Optimized with chunk caching and ImageData rendering
 */

class Wanderer {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');

        // Camera position
        this.camera = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.speed = 4;

        // Chunk system - each chunk is pre-rendered
        this.chunkSize = 64; // tiles per chunk
        this.tileSize = 6;   // pixels per tile
        this.chunkPixels = this.chunkSize * this.tileSize;
        this.chunks = new Map();
        this.maxChunks = 25; // Cache limit

        // Time & weather
        this.worldTime = 0.5;
        this.timeSpeed = 0.00015;
        this.timeRunning = true;
        this.lastLighting = -1;

        this.weather = {
            rain: false,
            fog: false,
            raindrops: [],
            fogDensity: 0
        };

        this.keys = {};
        this.permutation = this.generatePermutation();

        // Pre-compute biome colors as RGB arrays for speed
        this.biomeData = this.initBiomes();

        this.init();
    }

    init() {
        this.resize();
        this.setupInput();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupInput() {
        window.addEventListener('resize', () => {
            this.resize();
            this.chunks.clear(); // Re-render chunks on resize
        });

        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            if (e.key.toLowerCase() === 't') this.timeRunning = !this.timeRunning;
            if (e.key.toLowerCase() === 'r') {
                this.weather.rain = !this.weather.rain;
                this.updateWeatherDisplay();
            }
            if (e.key.toLowerCase() === 'f') {
                this.weather.fog = !this.weather.fog;
                this.updateWeatherDisplay();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }

    initBiomes() {
        // Pre-parse hex colors to RGB for fast access
        const parse = (hex) => {
            const h = hex.replace('#', '');
            return [parseInt(h.substr(0,2),16), parseInt(h.substr(2,2),16), parseInt(h.substr(4,2),16)];
        };

        return {
            ocean: { name: 'Ocean', colors: [parse('#1a3a5c'), parse('#1e4a6f'), parse('#224d73')] },
            sea: { name: 'Sea', colors: [parse('#2d5a7b'), parse('#3a6b8c'), parse('#4a7a9a')] },
            beach: { name: 'Beach', colors: [parse('#c2b280'), parse('#d4c48a'), parse('#e6d69c')] },
            snowpeak: { name: 'Snow Peak', colors: [parse('#e8e8e8'), parse('#f0f0f0'), parse('#ffffff')] },
            mountain: { name: 'Mountain', colors: [parse('#6b6b6b'), parse('#7a7a7a'), parse('#8a8a8a')] },
            rainforest: { name: 'Rainforest', colors: [parse('#1a4d1a'), parse('#2d5a2d'), parse('#1f4f1f')] },
            forest: { name: 'Forest', colors: [parse('#2d5a2d'), parse('#3d6b3d'), parse('#4d7a4d')] },
            taiga: { name: 'Taiga', colors: [parse('#3d5a4d'), parse('#4a6b5a'), parse('#5a7a6a')] },
            desert: { name: 'Desert', colors: [parse('#c4a35a'), parse('#d4b36a'), parse('#e4c37a')] },
            savanna: { name: 'Savanna', colors: [parse('#9a8a4a'), parse('#aa9a5a'), parse('#baaa6a')] },
            tundra: { name: 'Tundra', colors: [parse('#8a9a8a'), parse('#9aaa9a'), parse('#aabbaa')] },
            grassland: { name: 'Grassland', colors: [parse('#5a8a4a'), parse('#6a9a5a'), parse('#7aaa6a')] },
            plains: { name: 'Plains', colors: [parse('#6a9a5a'), parse('#7aaa6a'), parse('#8aba7a')] }
        };
    }

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
        const u = h < 2 ? x : y;
        const v = h < 2 ? y : x;
        return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
    }

    noise(x, y) {
        const p = this.permutation;
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        x -= Math.floor(x);
        y -= Math.floor(y);
        const u = this.fade(x);
        const v = this.fade(y);
        const A = p[X] + Y;
        const B = p[X + 1] + Y;
        return this.lerp(
            this.lerp(this.grad(p[A], x, y), this.grad(p[B], x - 1, y), u),
            this.lerp(this.grad(p[A + 1], x, y - 1), this.grad(p[B + 1], x - 1, y - 1), u),
            v
        );
    }

    // Simplified fbm - fewer octaves for speed
    fbm(x, y, octaves) {
        let value = 0, amp = 0.5, freq = 1, max = 0;
        for (let i = 0; i < octaves; i++) {
            value += amp * this.noise(x * freq, y * freq);
            max += amp;
            amp *= 0.5;
            freq *= 2;
        }
        return value / max;
    }

    getBiomeAt(worldX, worldY) {
        const scale = 0.01;
        const e = this.fbm(worldX * scale, worldY * scale, 4);
        const m = (this.fbm(worldX * 0.005 + 500, worldY * 0.005 + 500, 3) + 1) / 2;
        const t = (this.fbm(worldX * 0.004 + 1000, worldY * 0.004 + 1000, 2) + 1) / 2;

        if (e < -0.25) return this.biomeData.ocean;
        if (e < -0.05) return this.biomeData.sea;
        if (e < 0.05) return this.biomeData.beach;
        if (e > 0.55) return e > 0.7 ? this.biomeData.snowpeak : this.biomeData.mountain;

        if (m > 0.6) {
            if (t > 0.6) return this.biomeData.rainforest;
            if (t > 0.3) return this.biomeData.forest;
            return this.biomeData.taiga;
        }
        if (m < 0.3) {
            if (t > 0.6) return this.biomeData.desert;
            if (t > 0.3) return this.biomeData.savanna;
            return this.biomeData.tundra;
        }
        return t > 0.5 ? this.biomeData.grassland : this.biomeData.plains;
    }

    // Generate a chunk as an offscreen canvas
    generateChunk(cx, cy) {
        const canvas = document.createElement('canvas');
        canvas.width = this.chunkPixels;
        canvas.height = this.chunkPixels;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.createImageData(this.chunkPixels, this.chunkPixels);
        const data = imageData.data;

        const worldOffsetX = cx * this.chunkSize;
        const worldOffsetY = cy * this.chunkSize;

        for (let ty = 0; ty < this.chunkSize; ty++) {
            for (let tx = 0; tx < this.chunkSize; tx++) {
                const worldX = worldOffsetX + tx;
                const worldY = worldOffsetY + ty;

                const biome = this.getBiomeAt(worldX, worldY);
                const colorIdx = Math.abs(Math.floor(this.noise(worldX * 0.15, worldY * 0.15) * 3)) % 3;
                const rgb = biome.colors[colorIdx];

                // Fill tile pixels
                for (let py = 0; py < this.tileSize; py++) {
                    for (let px = 0; px < this.tileSize; px++) {
                        const pixelX = tx * this.tileSize + px;
                        const pixelY = ty * this.tileSize + py;
                        const idx = (pixelY * this.chunkPixels + pixelX) * 4;
                        data[idx] = rgb[0];
                        data[idx + 1] = rgb[1];
                        data[idx + 2] = rgb[2];
                        data[idx + 3] = 255;
                    }
                }
            }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas;
    }

    getChunk(cx, cy) {
        const key = `${cx},${cy}`;
        if (!this.chunks.has(key)) {
            // Evict old chunks if over limit
            if (this.chunks.size >= this.maxChunks) {
                const firstKey = this.chunks.keys().next().value;
                this.chunks.delete(firstKey);
            }
            this.chunks.set(key, this.generateChunk(cx, cy));
        }
        return this.chunks.get(key);
    }

    getLighting() {
        const t = this.worldTime;
        if (t < 0.25 || t > 0.75) {
            const np = t < 0.25 ? t / 0.25 : (1 - t) / 0.25;
            return 0.35 + np * 0.35;
        }
        return 0.7 + Math.sin((t - 0.25) / 0.5 * Math.PI) * 0.3;
    }

    getSkyColor() {
        const t = this.worldTime;
        const colors = [
            [0, 10, 15, 35], [0.22, 25, 30, 60], [0.27, 255, 140, 90],
            [0.32, 130, 180, 220], [0.5, 135, 195, 240], [0.68, 130, 175, 215],
            [0.73, 255, 130, 70], [0.78, 45, 35, 80], [1, 10, 15, 35]
        ];
        let p = colors[0], n = colors[1];
        for (let i = 0; i < colors.length - 1; i++) {
            if (t >= colors[i][0] && t < colors[i+1][0]) { p = colors[i]; n = colors[i+1]; break; }
        }
        const prog = (t - p[0]) / (n[0] - p[0]);
        return `rgb(${Math.round(this.lerp(p[1],n[1],prog))},${Math.round(this.lerp(p[2],n[2],prog))},${Math.round(this.lerp(p[3],n[3],prog))})`;
    }

    updateMovement() {
        let tx = 0, ty = 0;
        if (this.keys['w'] || this.keys['arrowup']) ty = -this.speed;
        if (this.keys['s'] || this.keys['arrowdown']) ty = this.speed;
        if (this.keys['a'] || this.keys['arrowleft']) tx = -this.speed;
        if (this.keys['d'] || this.keys['arrowright']) tx = this.speed;

        if (tx && ty) { tx *= 0.707; ty *= 0.707; }

        this.velocity.x += (tx - this.velocity.x) * 0.2;
        this.velocity.y += (ty - this.velocity.y) * 0.2;
        this.camera.x += this.velocity.x;
        this.camera.y += this.velocity.y;

        if (this.timeRunning) this.worldTime = (this.worldTime + this.timeSpeed) % 1;
    }

    updateWeather() {
        if (this.weather.rain) {
            for (let i = 0; i < 3; i++) {
                this.weather.raindrops.push({
                    x: Math.random() * this.canvas.width,
                    y: -10,
                    speed: 12 + Math.random() * 8,
                    length: 8 + Math.random() * 12
                });
            }
            this.weather.raindrops = this.weather.raindrops.filter(d => {
                d.y += d.speed; d.x -= 1.5;
                return d.y < this.canvas.height;
            });
            if (this.weather.raindrops.length > 300) this.weather.raindrops.splice(0, 100);
        } else {
            this.weather.raindrops = [];
        }

        this.weather.fogDensity += this.weather.fog
            ? Math.min(0.35, 0.008)
            : -Math.min(this.weather.fogDensity, 0.015);
        this.weather.fogDensity = Math.max(0, Math.min(0.35, this.weather.fogDensity));
    }

    updateWeatherDisplay() {
        const c = [];
        if (this.weather.rain) c.push('Rain');
        if (this.weather.fog) c.push('Fog');
        document.getElementById('weather').textContent = c.length ? c.join(', ') : 'Clear';
    }

    render() {
        const ctx = this.ctx;
        const w = this.canvas.width, h = this.canvas.height;
        const lighting = this.getLighting();

        // Sky
        ctx.fillStyle = this.getSkyColor();
        ctx.fillRect(0, 0, w, h);

        // Calculate visible chunks
        const camPixelX = this.camera.x * this.tileSize;
        const camPixelY = this.camera.y * this.tileSize;

        const startChunkX = Math.floor((camPixelX - w/2) / this.chunkPixels);
        const startChunkY = Math.floor((camPixelY - h/2) / this.chunkPixels);
        const endChunkX = Math.ceil((camPixelX + w/2) / this.chunkPixels);
        const endChunkY = Math.ceil((camPixelY + h/2) / this.chunkPixels);

        // Draw chunks
        for (let cy = startChunkY; cy <= endChunkY; cy++) {
            for (let cx = startChunkX; cx <= endChunkX; cx++) {
                const chunk = this.getChunk(cx, cy);
                const screenX = cx * this.chunkPixels - camPixelX + w/2;
                const screenY = cy * this.chunkPixels - camPixelY + h/2;
                ctx.drawImage(chunk, screenX, screenY);
            }
        }

        // Apply lighting overlay
        if (lighting < 0.95) {
            const alpha = (1 - lighting) * 0.7;
            const isNight = this.worldTime < 0.25 || this.worldTime > 0.75;
            ctx.fillStyle = isNight ? `rgba(10, 15, 40, ${alpha})` : `rgba(0, 0, 0, ${alpha * 0.5})`;
            ctx.fillRect(0, 0, w, h);
        }

        // Stars
        if (this.worldTime < 0.25 || this.worldTime > 0.75) {
            const starAlpha = this.worldTime < 0.25 ? (0.25 - this.worldTime) / 0.25 : (this.worldTime - 0.75) / 0.25;
            ctx.fillStyle = `rgba(255, 255, 255, ${starAlpha * 0.9})`;
            for (let i = 0; i < 80; i++) {
                const sx = (Math.sin(i * 12345) * 50000) % w;
                const sy = (Math.cos(i * 12345) * 50000) % (h * 0.5);
                const twinkle = Math.sin(this.worldTime * 80 + i * 7) * 0.3 + 0.7;
                ctx.globalAlpha = starAlpha * twinkle;
                ctx.beginPath();
                ctx.arc((sx + w) % w, (sy + h * 0.5) % (h * 0.5), 1 + (i % 3) * 0.5, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        }

        // Sun/Moon
        const celestialY = Math.sin(this.worldTime * Math.PI * 2 - Math.PI/2) * h * 0.3 + h * 0.25;
        const celestialX = w * 0.5 + Math.cos(this.worldTime * Math.PI * 2) * w * 0.25;

        if (this.worldTime > 0.22 && this.worldTime < 0.78) {
            ctx.fillStyle = '#fff8e0';
            ctx.beginPath();
            ctx.arc(celestialX, celestialY, 16, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillStyle = '#dde';
            ctx.beginPath();
            ctx.arc(celestialX, celestialY, 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = this.getSkyColor();
            ctx.beginPath();
            ctx.arc(celestialX + 5, celestialY - 2, 11, 0, Math.PI * 2);
            ctx.fill();
        }

        // Rain
        if (this.weather.raindrops.length) {
            ctx.strokeStyle = 'rgba(180, 200, 220, 0.35)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (const d of this.weather.raindrops) {
                ctx.moveTo(d.x, d.y);
                ctx.lineTo(d.x + 1.5, d.y + d.length);
            }
            ctx.stroke();
        }

        // Fog
        if (this.weather.fogDensity > 0) {
            ctx.fillStyle = `rgba(190, 200, 210, ${this.weather.fogDensity})`;
            ctx.fillRect(0, 0, w, h);
        }

        // Player dot
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.beginPath();
        ctx.arc(w/2, h/2, 3, 0, Math.PI * 2);
        ctx.fill();

        // UI
        document.getElementById('coords').textContent = `${Math.round(this.camera.x)}, ${Math.round(this.camera.y)}`;
        const biome = this.getBiomeAt(Math.round(this.camera.x), Math.round(this.camera.y));
        document.getElementById('biome').textContent = biome.name;
        const hrs = Math.floor(this.worldTime * 24);
        const mins = Math.floor((this.worldTime * 24 - hrs) * 60);
        document.getElementById('timeDisplay').textContent = `${hrs.toString().padStart(2,'0')}:${mins.toString().padStart(2,'0')}`;
    }

    animate() {
        this.updateMovement();
        this.updateWeather();
        this.render();
        requestAnimationFrame(() => this.animate());
    }
}

new Wanderer();
