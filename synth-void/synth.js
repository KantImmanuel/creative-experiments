/**
 * Synth Void - An Audio-Reactive Visualizer & Synthesizer
 * WebGL shaders + Web Audio API
 */

class SynthVoid {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');

        if (!this.gl) {
            alert('WebGL not supported');
            return;
        }

        this.audioStarted = false;
        this.time = 0;
        this.activeNotes = new Map();
        this.analyserData = new Uint8Array(256);
        this.smoothedBass = 0;
        this.smoothedMid = 0;
        this.smoothedHigh = 0;
        this.mouse = { x: 0.5, y: 0.5, down: false };
        this.vizMode = 0;
        this.vizModes = ['Void', 'Pulse', 'Fractal', 'Wave'];

        this.config = {
            waveform: 'sine',
            reverb: false,
            distortion: false,
            visualsEnabled: true
        };

        // Musical scale (A minor pentatonic + extras for full keyboard)
        this.notes = [
            { key: 'a', note: 'C4', freq: 261.63 },
            { key: 'w', note: 'C#4', freq: 277.18, black: true },
            { key: 's', note: 'D4', freq: 293.66 },
            { key: 'e', note: 'D#4', freq: 311.13, black: true },
            { key: 'd', note: 'E4', freq: 329.63 },
            { key: 'f', note: 'F4', freq: 349.23 },
            { key: 't', note: 'F#4', freq: 369.99, black: true },
            { key: 'g', note: 'G4', freq: 392.00 },
            { key: 'y', note: 'G#4', freq: 415.30, black: true },
            { key: 'h', note: 'A4', freq: 440.00 },
            { key: 'u', note: 'A#4', freq: 466.16, black: true },
            { key: 'j', note: 'B4', freq: 493.88 },
            { key: 'k', note: 'C5', freq: 523.25 },
            { key: 'o', note: 'C#5', freq: 554.37, black: true },
            { key: 'l', note: 'D5', freq: 587.33 },
        ];

        this.init();
    }

    init() {
        this.resize();
        this.initWebGL();
        this.setupEventListeners();
        this.buildKeyboard();
        this.animate();
    }

    initAudio() {
        if (this.audioStarted) return;
        this.audioStarted = true;

        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        // Master chain
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.value = 0.3;

        // Analyser for visualization
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 512;
        this.analyserData = new Uint8Array(this.analyser.frequencyBinCount);

        // Reverb (convolver)
        this.convolver = this.audioCtx.createConvolver();
        this.reverbGain = this.audioCtx.createGain();
        this.reverbGain.gain.value = 0;
        this.createReverbImpulse();

        // Distortion
        this.distortion = this.audioCtx.createWaveShaper();
        this.distortion.curve = this.makeDistortionCurve(0);
        this.distortionGain = this.audioCtx.createGain();
        this.distortionGain.gain.value = 1;

        // Filter for mouse control
        this.filter = this.audioCtx.createBiquadFilter();
        this.filter.type = 'lowpass';
        this.filter.frequency.value = 20000;
        this.filter.Q.value = 1;

        // Connect chain
        this.masterGain.connect(this.filter);
        this.filter.connect(this.distortion);
        this.distortion.connect(this.analyser);
        this.analyser.connect(this.audioCtx.destination);

        // Reverb send
        this.masterGain.connect(this.convolver);
        this.convolver.connect(this.reverbGain);
        this.reverbGain.connect(this.analyser);

        document.getElementById('startOverlay').classList.add('hidden');
    }

    createReverbImpulse() {
        const rate = this.audioCtx.sampleRate;
        const length = rate * 2;
        const impulse = this.audioCtx.createBuffer(2, length, rate);

        for (let channel = 0; channel < 2; channel++) {
            const data = impulse.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
            }
        }

        this.convolver.buffer = impulse;
    }

    makeDistortionCurve(amount) {
        const samples = 44100;
        const curve = new Float32Array(samples);
        const deg = Math.PI / 180;

        for (let i = 0; i < samples; i++) {
            const x = (i * 2) / samples - 1;
            curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
        }

        return curve;
    }

    playNote(noteData) {
        if (!this.audioStarted) return;
        if (this.activeNotes.has(noteData.key)) return;

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = this.config.waveform;
        osc.frequency.value = noteData.freq;

        // ADSR envelope
        const now = this.audioCtx.currentTime;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.5, now + 0.02); // Attack
        gain.gain.linearRampToValueAtTime(0.3, now + 0.1);  // Decay to sustain

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();

        this.activeNotes.set(noteData.key, { osc, gain });

        // Update frequency display
        document.getElementById('freqDisplay').textContent = `${noteData.freq.toFixed(1)} Hz`;
    }

    stopNote(noteData) {
        const note = this.activeNotes.get(noteData.key);
        if (!note) return;

        const now = this.audioCtx.currentTime;
        note.gain.gain.linearRampToValueAtTime(0, now + 0.3); // Release

        setTimeout(() => {
            note.osc.stop();
            note.osc.disconnect();
            note.gain.disconnect();
        }, 300);

        this.activeNotes.delete(noteData.key);

        if (this.activeNotes.size === 0) {
            document.getElementById('freqDisplay').textContent = '';
        }
    }

    bassDrop() {
        if (!this.audioStarted) return;

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        const now = this.audioCtx.currentTime;

        // Pitch drop
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.5);

        // Volume envelope
        gain.gain.setValueAtTime(0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 1);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(now + 1);
    }

    initWebGL() {
        const gl = this.gl;

        // Vertex shader - simple fullscreen quad
        const vsSource = `
            attribute vec2 position;
            void main() {
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `;

        // Fragment shader - the visual magic
        const fsSource = `
            precision highp float;

            uniform vec2 resolution;
            uniform float time;
            uniform float bass;
            uniform float mid;
            uniform float high;
            uniform vec2 mouse;
            uniform int mode;

            #define PI 3.14159265359

            // Noise functions
            float hash(vec2 p) {
                return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
            }

            float noise(vec2 p) {
                vec2 i = floor(p);
                vec2 f = fract(p);
                f = f * f * (3.0 - 2.0 * f);
                return mix(
                    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
                    f.y
                );
            }

            float fbm(vec2 p) {
                float v = 0.0;
                float a = 0.5;
                for (int i = 0; i < 5; i++) {
                    v += a * noise(p);
                    p *= 2.0;
                    a *= 0.5;
                }
                return v;
            }

            // Color palette
            vec3 palette(float t) {
                vec3 a = vec3(0.5, 0.5, 0.5);
                vec3 b = vec3(0.5, 0.5, 0.5);
                vec3 c = vec3(1.0, 1.0, 1.0);
                vec3 d = vec3(0.263, 0.416, 0.557);
                return a + b * cos(6.28318 * (c * t + d));
            }

            // Void mode - dark swirling void
            vec3 voidMode(vec2 uv, float t) {
                vec2 center = uv - mouse;
                float dist = length(center);
                float angle = atan(center.y, center.x);

                // Swirl effect
                float swirl = sin(dist * 10.0 - t * 2.0 + bass * 5.0) * 0.5 + 0.5;
                float spiral = sin(angle * 5.0 + dist * 20.0 - t * 3.0) * 0.5 + 0.5;

                // Noise overlay
                float n = fbm(uv * 3.0 + t * 0.2);

                // Combine
                float pattern = swirl * spiral * (1.0 + bass * 2.0);
                pattern += n * 0.3 * (1.0 + mid);

                // Vignette
                float vignette = 1.0 - dist * 0.8;

                vec3 color = palette(pattern * 0.5 + t * 0.1);
                color *= pattern * vignette;
                color += vec3(high * 0.1) * (1.0 - dist);

                return color * 0.8;
            }

            // Pulse mode - concentric reactive circles
            vec3 pulseMode(vec2 uv, float t) {
                vec2 center = uv - 0.5;
                float dist = length(center);
                float angle = atan(center.y, center.x);

                // Pulsing rings
                float rings = sin(dist * 30.0 - t * 4.0 - bass * 10.0);
                rings = smoothstep(0.0, 0.1, rings);

                // Angular segments
                float segments = sin(angle * 8.0 + t) * 0.5 + 0.5;
                segments *= (1.0 + mid * 2.0);

                // Combine
                float pattern = rings * segments;

                // Mouse interaction
                float mouseDist = length(uv - mouse);
                pattern += smoothstep(0.3, 0.0, mouseDist) * high * 2.0;

                vec3 color = palette(dist + t * 0.2);
                color *= pattern;
                color += vec3(0.02, 0.01, 0.03); // Ambient

                return color;
            }

            // Fractal mode
            vec3 fractalMode(vec2 uv, float t) {
                vec2 c = (uv - 0.5) * 3.0;
                c += (mouse - 0.5) * 2.0;

                vec2 z = vec2(0.0);
                float iter = 0.0;

                for (int i = 0; i < 50; i++) {
                    z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
                    if (length(z) > 2.0) break;
                    iter += 1.0;
                }

                iter += bass * 10.0;

                float smooth_iter = iter - log2(log2(dot(z, z)));

                vec3 color = palette(smooth_iter * 0.05 + t * 0.1);
                color *= (1.0 + mid);

                // Glow at high frequencies
                color += vec3(high * 0.3, high * 0.1, high * 0.2);

                return color * 0.7;
            }

            // Wave mode - audio waveform inspired
            vec3 waveMode(vec2 uv, float t) {
                vec2 p = uv - 0.5;

                float wave = 0.0;
                for (float i = 1.0; i < 8.0; i++) {
                    float freq = i * 2.0;
                    float amp = (1.0 / i) * (bass + 0.2);
                    wave += sin(p.x * freq * 10.0 + t * i + bass * 5.0) * amp;
                    wave += cos(p.y * freq * 8.0 - t * i * 0.7 + mid * 3.0) * amp * 0.5;
                }

                wave *= 0.1;
                float dist = abs(p.y - wave);

                // Line glow
                float line = smoothstep(0.05, 0.0, dist);
                float glow = smoothstep(0.2, 0.0, dist) * 0.5;

                // Mouse ripple
                float mouseDist = length(uv - mouse);
                float ripple = sin(mouseDist * 30.0 - t * 5.0) * 0.5 + 0.5;
                ripple *= smoothstep(0.5, 0.0, mouseDist) * high;

                vec3 color = palette(p.x + t * 0.1) * (line + glow);
                color += vec3(0.1, 0.05, 0.15) * ripple;
                color += vec3(0.01, 0.005, 0.02); // Ambient

                return color;
            }

            void main() {
                vec2 uv = gl_FragCoord.xy / resolution;

                vec3 color;

                if (mode == 0) {
                    color = voidMode(uv, time);
                } else if (mode == 1) {
                    color = pulseMode(uv, time);
                } else if (mode == 2) {
                    color = fractalMode(uv, time);
                } else {
                    color = waveMode(uv, time);
                }

                // Global adjustments
                color = pow(color, vec3(0.9)); // Gamma
                color *= 1.0 + bass * 0.3; // Bass boost brightness

                gl_FragColor = vec4(color, 1.0);
            }
        `;

        // Compile shaders
        const vs = this.compileShader(gl.VERTEX_SHADER, vsSource);
        const fs = this.compileShader(gl.FRAGMENT_SHADER, fsSource);

        // Create program
        this.program = gl.createProgram();
        gl.attachShader(this.program, vs);
        gl.attachShader(this.program, fs);
        gl.linkProgram(this.program);

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            console.error('Program link failed:', gl.getProgramInfoLog(this.program));
        }

        // Fullscreen quad
        const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        // Get locations
        this.positionLoc = gl.getAttribLocation(this.program, 'position');
        this.uniforms = {
            resolution: gl.getUniformLocation(this.program, 'resolution'),
            time: gl.getUniformLocation(this.program, 'time'),
            bass: gl.getUniformLocation(this.program, 'bass'),
            mid: gl.getUniformLocation(this.program, 'mid'),
            high: gl.getUniformLocation(this.program, 'high'),
            mouse: gl.getUniformLocation(this.program, 'mouse'),
            mode: gl.getUniformLocation(this.program, 'mode')
        };

        gl.enableVertexAttribArray(this.positionLoc);
        gl.vertexAttribPointer(this.positionLoc, 2, gl.FLOAT, false, 0, 0);
    }

    compileShader(type, source) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compile failed:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        if (this.gl) {
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    buildKeyboard() {
        const keyboard = document.getElementById('keyboard');

        this.notes.forEach(note => {
            const key = document.createElement('div');
            key.className = 'key' + (note.black ? ' black' : '');
            key.dataset.key = note.key;
            key.textContent = note.key.toUpperCase();

            key.addEventListener('mousedown', () => {
                this.initAudio();
                this.playNote(note);
                key.classList.add('active');
            });

            key.addEventListener('mouseup', () => {
                this.stopNote(note);
                key.classList.remove('active');
            });

            key.addEventListener('mouseleave', () => {
                this.stopNote(note);
                key.classList.remove('active');
            });

            keyboard.appendChild(key);
        });
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());

        // Start overlay
        document.getElementById('startOverlay').addEventListener('click', () => {
            this.initAudio();
        });

        // Keyboard input
        document.addEventListener('keydown', (e) => {
            if (e.repeat) return;

            this.initAudio();

            if (e.key === ' ') {
                e.preventDefault();
                this.bassDrop();
                return;
            }

            // Number keys for waveform
            if (e.key >= '1' && e.key <= '4') {
                const waves = ['sine', 'triangle', 'sawtooth', 'square'];
                this.setWaveform(waves[parseInt(e.key) - 1]);
                return;
            }

            const note = this.notes.find(n => n.key === e.key.toLowerCase());
            if (note) {
                this.playNote(note);
                const keyEl = document.querySelector(`.key[data-key="${note.key}"]`);
                if (keyEl) keyEl.classList.add('active');
            }
        });

        document.addEventListener('keyup', (e) => {
            const note = this.notes.find(n => n.key === e.key.toLowerCase());
            if (note) {
                this.stopNote(note);
                const keyEl = document.querySelector(`.key[data-key="${note.key}"]`);
                if (keyEl) keyEl.classList.remove('active');
            }
        });

        // Mouse for filter control
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX / this.canvas.width;
            this.mouse.y = 1 - e.clientY / this.canvas.height;

            if (this.mouse.down && this.filter) {
                // Map mouse X to filter frequency
                const freq = 200 + this.mouse.x * 19800;
                this.filter.frequency.value = freq;
                // Map mouse Y to resonance
                this.filter.Q.value = 1 + this.mouse.y * 15;
            }
        });

        this.canvas.addEventListener('mousedown', () => {
            this.mouse.down = true;
            this.initAudio();
        });

        this.canvas.addEventListener('mouseup', () => {
            this.mouse.down = false;
            if (this.filter) {
                this.filter.frequency.value = 20000;
                this.filter.Q.value = 1;
            }
        });

        // Waveform buttons
        document.querySelectorAll('.wave-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setWaveform(btn.dataset.wave);
            });
        });

        // Control buttons
        document.getElementById('toggleVisuals').addEventListener('click', (e) => {
            this.config.visualsEnabled = !this.config.visualsEnabled;
            e.target.classList.toggle('active', this.config.visualsEnabled);
        });

        document.getElementById('toggleReverb').addEventListener('click', (e) => {
            this.config.reverb = !this.config.reverb;
            e.target.classList.toggle('active', this.config.reverb);
            if (this.reverbGain) {
                this.reverbGain.gain.value = this.config.reverb ? 0.5 : 0;
            }
        });

        document.getElementById('toggleDistortion').addEventListener('click', (e) => {
            this.config.distortion = !this.config.distortion;
            e.target.classList.toggle('active', this.config.distortion);
            if (this.distortion) {
                this.distortion.curve = this.makeDistortionCurve(this.config.distortion ? 50 : 0);
            }
        });

        document.getElementById('cycleViz').addEventListener('click', () => {
            this.vizMode = (this.vizMode + 1) % this.vizModes.length;
            document.getElementById('vizMode').textContent = this.vizModes[this.vizMode] + ' Mode';
        });
    }

    setWaveform(wave) {
        this.config.waveform = wave;

        document.querySelectorAll('.wave-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.wave === wave);
        });

        // Update playing notes
        this.activeNotes.forEach(note => {
            note.osc.type = wave;
        });
    }

    analyzeAudio() {
        if (!this.analyser) return;

        this.analyser.getByteFrequencyData(this.analyserData);

        // Split into frequency bands
        let bass = 0, mid = 0, high = 0;
        const len = this.analyserData.length;

        for (let i = 0; i < len; i++) {
            const val = this.analyserData[i] / 255;
            if (i < len * 0.15) bass += val;
            else if (i < len * 0.5) mid += val;
            else high += val;
        }

        bass /= len * 0.15;
        mid /= len * 0.35;
        high /= len * 0.5;

        // Smooth
        this.smoothedBass += (bass - this.smoothedBass) * 0.3;
        this.smoothedMid += (mid - this.smoothedMid) * 0.3;
        this.smoothedHigh += (high - this.smoothedHigh) * 0.3;
    }

    render() {
        const gl = this.gl;

        if (!this.config.visualsEnabled) {
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
            return;
        }

        gl.useProgram(this.program);

        gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height);
        gl.uniform1f(this.uniforms.time, this.time);
        gl.uniform1f(this.uniforms.bass, this.smoothedBass);
        gl.uniform1f(this.uniforms.mid, this.smoothedMid);
        gl.uniform1f(this.uniforms.high, this.smoothedHigh);
        gl.uniform2f(this.uniforms.mouse, this.mouse.x, this.mouse.y);
        gl.uniform1i(this.uniforms.mode, this.vizMode);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    animate() {
        this.time += 0.016;
        this.analyzeAudio();
        this.render();
        requestAnimationFrame(() => this.animate());
    }
}

// Start
document.addEventListener('DOMContentLoaded', () => {
    new SynthVoid();
});
