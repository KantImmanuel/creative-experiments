/**
 * Cosmic Drift - An Interactive Particle Universe
 * A generative art experience with physics-based particles,
 * constellation connections, and mouse-driven gravity wells.
 */

class CosmicDrift {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.mouse = { x: null, y: null, influence: 150 };
        this.time = 0;
        this.deltaTime = 0;
        this.lastTime = 0;

        // Configuration
        this.config = {
            particleCount: 500,
            maxParticles: 800,
            maxSpeed: 2,
            connectionDistance: 100,
            mouseGravity: 0.15,
            friction: 0.99,
            showLines: true,
            showTrails: true,
            gravityEnabled: true,
            trailAlpha: 0.03,
            colorScheme: 0
        };

        // Color palettes - each is [primary, secondary, accent, background]
        this.palettes = [
            { name: 'Nebula', colors: ['#8B5CF6', '#EC4899', '#06B6D4', '#0a0a1a'], bg: '#0a0a1a' },
            { name: 'Aurora', colors: ['#10B981', '#3B82F6', '#F59E0B', '#0a1a0a'], bg: '#0a1a0a' },
            { name: 'Solar', colors: ['#F97316', '#EAB308', '#EF4444', '#1a0a0a'], bg: '#1a0a0a' },
            { name: 'Ocean', colors: ['#0EA5E9', '#6366F1', '#14B8A6', '#0a0a1a'], bg: '#0a0a1a' },
            { name: 'Mono', colors: ['#FFFFFF', '#A0A0A0', '#606060', '#000000'], bg: '#000000' },
        ];

        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.setupEventListeners();
        this.setupUI();
        this.animate(0);
    }

    resize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
    }

    createParticles() {
        this.particles = [];
        const palette = this.palettes[this.config.colorScheme].colors;

        for (let i = 0; i < this.config.particleCount; i++) {
            // Spawn in a circular pattern for visual interest
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * Math.min(this.width, this.height) * 0.4;

            this.particles.push({
                x: this.centerX + Math.cos(angle) * radius,
                y: this.centerY + Math.sin(angle) * radius,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                radius: Math.random() * 2 + 0.5,
                color: palette[Math.floor(Math.random() * 3)],
                alpha: Math.random() * 0.5 + 0.5,
                mass: Math.random() * 2 + 1,
                orbitAngle: Math.random() * Math.PI * 2,
                orbitSpeed: (Math.random() - 0.5) * 0.02,
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());

        this.canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });

        this.canvas.addEventListener('click', (e) => {
            this.createBurst(e.clientX, e.clientY, 15);
        });

        // Touch support
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.mouse.x = e.touches[0].clientX;
            this.mouse.y = e.touches[0].clientY;
        });

        this.canvas.addEventListener('touchend', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            switch(e.key.toLowerCase()) {
                case 'l': this.toggleLines(); break;
                case 'g': this.toggleGravity(); break;
                case 't': this.toggleTrails(); break;
                case ' ': this.cosmicBurst(); break;
                case '1': case '2': case '3': case '4': case '5':
                    this.setColorScheme(parseInt(e.key) - 1);
                    break;
            }
        });
    }

    setupUI() {
        // Button controls
        document.getElementById('toggleLines').addEventListener('click', () => this.toggleLines());
        document.getElementById('toggleGravity').addEventListener('click', () => this.toggleGravity());
        document.getElementById('toggleTrails').addEventListener('click', () => this.toggleTrails());
        document.getElementById('explode').addEventListener('click', () => this.cosmicBurst());

        // Color palette
        const paletteContainer = document.getElementById('colorPalette');
        this.palettes.forEach((palette, index) => {
            const dot = document.createElement('div');
            dot.className = 'color-dot' + (index === 0 ? ' active' : '');
            dot.style.background = `linear-gradient(135deg, ${palette.colors[0]}, ${palette.colors[1]})`;
            dot.title = palette.name;
            dot.addEventListener('click', () => this.setColorScheme(index));
            paletteContainer.appendChild(dot);
        });

        // Initial button states
        this.updateButtonStates();
    }

    updateButtonStates() {
        document.getElementById('toggleLines').classList.toggle('active', this.config.showLines);
        document.getElementById('toggleGravity').classList.toggle('active', this.config.gravityEnabled);
        document.getElementById('toggleTrails').classList.toggle('active', this.config.showTrails);
    }

    toggleLines() {
        this.config.showLines = !this.config.showLines;
        this.updateButtonStates();
    }

    toggleGravity() {
        this.config.gravityEnabled = !this.config.gravityEnabled;
        document.getElementById('modeIndicator').textContent =
            this.config.gravityEnabled ? 'Orbit Mode' : 'Drift Mode';
        this.updateButtonStates();
    }

    toggleTrails() {
        this.config.showTrails = !this.config.showTrails;
        this.updateButtonStates();
    }

    setColorScheme(index) {
        this.config.colorScheme = index;
        const palette = this.palettes[index].colors;

        // Update particle colors with smooth transition
        this.particles.forEach(p => {
            p.color = palette[Math.floor(Math.random() * 3)];
        });

        // Update active dot
        document.querySelectorAll('.color-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    createBurst(x, y, count) {
        const palette = this.palettes[this.config.colorScheme].colors;
        const availableSlots = this.config.maxParticles - this.particles.length;
        const actualCount = Math.min(count, availableSlots);

        for (let i = 0; i < actualCount; i++) {
            const angle = (Math.PI * 2 / actualCount) * i + Math.random() * 0.5;
            const speed = 3 + Math.random() * 5;

            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: Math.random() * 2 + 0.5,
                color: palette[Math.floor(Math.random() * 3)],
                alpha: 1,
                mass: Math.random() * 2 + 1,
                orbitAngle: angle,
                orbitSpeed: (Math.random() - 0.5) * 0.02,
                pulsePhase: Math.random() * Math.PI * 2,
                life: 1,
                decay: 0.005 + Math.random() * 0.005
            });
        }
    }

    cosmicBurst() {
        // Push existing particles outward (the main visual effect)
        this.particles.forEach(p => {
            const dx = p.x - this.centerX;
            const dy = p.y - this.centerY;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = 12;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
        });

        // Create a single burst from center
        this.createBurst(this.centerX, this.centerY, 20);
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            // Decay for burst particles
            if (p.life !== undefined) {
                p.life -= p.decay;
                p.alpha = p.life;
                if (p.life <= 0) {
                    this.particles.splice(i, 1);
                    continue;
                }
            }

            // Gentle orbital motion
            p.orbitAngle += p.orbitSpeed;
            p.vx += Math.cos(p.orbitAngle) * 0.01;
            p.vy += Math.sin(p.orbitAngle) * 0.01;

            // Mouse gravity
            if (this.config.gravityEnabled && this.mouse.x !== null) {
                const dx = this.mouse.x - p.x;
                const dy = this.mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.mouse.influence * 3) {
                    const force = this.config.mouseGravity * p.mass / (dist * 0.1 + 1);
                    p.vx += (dx / dist) * force;
                    p.vy += (dy / dist) * force;
                }
            }

            // Center gravity (gentle pull to keep particles on screen)
            const centerDx = this.centerX - p.x;
            const centerDy = this.centerY - p.y;
            const centerDist = Math.sqrt(centerDx * centerDx + centerDy * centerDy);
            if (centerDist > Math.min(this.width, this.height) * 0.4) {
                p.vx += centerDx * 0.0001;
                p.vy += centerDy * 0.0001;
            }

            // Apply velocity with friction
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= this.config.friction;
            p.vy *= this.config.friction;

            // Speed limit
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (speed > this.config.maxSpeed * 3) {
                p.vx = (p.vx / speed) * this.config.maxSpeed * 3;
                p.vy = (p.vy / speed) * this.config.maxSpeed * 3;
            }

            // Wrap around edges with smooth transition
            const margin = 50;
            if (p.x < -margin) p.x = this.width + margin;
            if (p.x > this.width + margin) p.x = -margin;
            if (p.y < -margin) p.y = this.height + margin;
            if (p.y > this.height + margin) p.y = -margin;
        }
    }

    findConnections() {
        this.connections = [];
        const maxConnections = 600;
        let connectionCount = 0;

        // Spatial hash for performance
        const cellSize = this.config.connectionDistance;
        const grid = new Map();

        // Only use base particles for connections (skip burst particles for perf)
        const baseParticles = this.particles.filter(p => p.life === undefined);

        // Populate grid
        baseParticles.forEach((p, i) => {
            const cellX = Math.floor(p.x / cellSize);
            const cellY = Math.floor(p.y / cellSize);
            const key = `${cellX},${cellY}`;
            if (!grid.has(key)) grid.set(key, []);
            grid.get(key).push(i);
        });

        // Find connections
        for (let i = 0; i < baseParticles.length && connectionCount < maxConnections; i++) {
            const p = baseParticles[i];
            const cellX = Math.floor(p.x / cellSize);
            const cellY = Math.floor(p.y / cellSize);

            // Check neighboring cells
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    const key = `${cellX + dx},${cellY + dy}`;
                    const cell = grid.get(key);
                    if (!cell) continue;

                    for (const j of cell) {
                        if (j <= i) continue;
                        if (connectionCount >= maxConnections) break;

                        const p2 = baseParticles[j];
                        const ddx = p.x - p2.x;
                        const ddy = p.y - p2.y;
                        const distSq = ddx * ddx + ddy * ddy;
                        const maxDistSq = this.config.connectionDistance * this.config.connectionDistance;

                        if (distSq < maxDistSq) {
                            const dist = Math.sqrt(distSq);
                            this.connections.push({
                                p1: p,
                                p2: p2,
                                dist: dist,
                                alpha: 1 - (dist / this.config.connectionDistance)
                            });
                            connectionCount++;
                        }
                    }
                }
            }
        }
    }

    draw() {
        const palette = this.palettes[this.config.colorScheme];

        // Trail effect or clear
        if (this.config.showTrails) {
            this.ctx.fillStyle = palette.bg + '08'; // Very transparent for trails
            this.ctx.fillRect(0, 0, this.width, this.height);
        } else {
            this.ctx.fillStyle = palette.bg;
            this.ctx.fillRect(0, 0, this.width, this.height);
        }

        // Draw connections (batched by similar alpha for performance)
        if (this.config.showLines) {
            this.ctx.lineCap = 'round';
            this.ctx.lineWidth = 1;

            for (const conn of this.connections) {
                const alpha = conn.alpha * 0.25 * conn.p1.alpha * conn.p2.alpha;
                this.ctx.strokeStyle = conn.p1.color + this.alphaToHex(alpha);
                this.ctx.beginPath();
                this.ctx.moveTo(conn.p1.x, conn.p1.y);
                this.ctx.lineTo(conn.p2.x, conn.p2.y);
                this.ctx.stroke();
            }
        }

        // Draw particles - simplified for performance
        for (const p of this.particles) {
            const pulse = Math.sin(this.time * 0.003 + p.pulsePhase) * 0.2 + 0.8;
            const radius = p.radius * pulse;

            // Outer glow (simple circle, no gradient)
            this.ctx.fillStyle = p.color + this.alphaToHex(p.alpha * 0.15);
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, radius * 3, 0, Math.PI * 2);
            this.ctx.fill();

            // Core
            this.ctx.fillStyle = p.color + this.alphaToHex(p.alpha * 0.9);
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // Mouse influence visualization
        if (this.mouse.x !== null && this.config.gravityEnabled) {
            const gradient = this.ctx.createRadialGradient(
                this.mouse.x, this.mouse.y, 0,
                this.mouse.x, this.mouse.y, this.mouse.influence
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
            gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.02)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(this.mouse.x, this.mouse.y, this.mouse.influence, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    alphaToHex(alpha) {
        const hex = Math.floor(Math.max(0, Math.min(1, alpha)) * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }

    updateStats() {
        const stats = document.getElementById('stats');
        stats.textContent = `particles: ${this.particles.length} | connections: ${this.connections.length} | fps: ${Math.round(1000 / this.deltaTime)}`;
    }

    animate(currentTime) {
        this.deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        this.time = currentTime;

        this.updateParticles();
        if (this.config.showLines) {
            this.findConnections();
        }
        this.draw();

        // Update stats every 10 frames
        if (Math.floor(this.time / 100) % 3 === 0) {
            this.updateStats();
        }

        requestAnimationFrame((t) => this.animate(t));
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CosmicDrift();
});
