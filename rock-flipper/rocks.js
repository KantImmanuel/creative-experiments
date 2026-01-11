/**
 * Rock Flipper - A cozy exploration game
 * Flip rocks to discover creatures underneath!
 */

class RockFlipper {
    constructor() {
        this.meadow = document.getElementById('meadow');
        this.rocksFlipped = 0;
        this.discovered = new Set();
        this.hintShown = true;

        // All possible creatures with rarity (1 = common, 5 = legendary)
        this.creatures = [
            // Common (rarity 1)
            { emoji: '🐜', name: 'Ant', fact: 'Ants can lift 50 times their body weight!', rarity: 1, anim: 'crawl' },
            { emoji: '🐛', name: 'Caterpillar', fact: 'Caterpillars have 12 eyes but poor vision.', rarity: 1, anim: 'crawl' },
            { emoji: '🪱', name: 'Earthworm', fact: 'Earthworms have 5 hearts!', rarity: 1, anim: 'wiggle' },
            { emoji: '🐌', name: 'Snail', fact: 'Snails can sleep for up to 3 years.', rarity: 1, anim: 'still' },
            { emoji: '🍄', name: 'Mushroom', fact: 'Mushrooms are more related to humans than plants!', rarity: 1, anim: 'still' },

            // Uncommon (rarity 2)
            { emoji: '🐞', name: 'Ladybug', fact: 'A ladybug can eat 5,000 insects in its lifetime.', rarity: 2, anim: 'crawl' },
            { emoji: '🦗', name: 'Cricket', fact: 'Crickets hear through their knees!', rarity: 2, anim: 'still' },
            { emoji: '🪲', name: 'Beetle', fact: 'Beetles make up 25% of all known life forms.', rarity: 2, anim: 'crawl' },
            { emoji: '🕷️', name: 'Spider', fact: 'Spider silk is stronger than steel by weight.', rarity: 2, anim: 'still' },
            { emoji: '🦎', name: 'Tiny Lizard', fact: 'Some lizards can detach their tails to escape predators!', rarity: 2, anim: 'still' },

            // Rare (rarity 3)
            { emoji: '🐸', name: 'Baby Frog', fact: 'Frogs absorb water through their skin, never drinking.', rarity: 3, anim: 'still' },
            { emoji: '🦂', name: 'Scorpion', fact: 'Scorpions glow under UV light!', rarity: 3, anim: 'still' },
            { emoji: '🐍', name: 'Baby Snake', fact: 'Snakes smell with their tongues.', rarity: 3, anim: 'wiggle' },
            { emoji: '🦀', name: 'Hermit Crab', fact: 'Hermit crabs form queues to swap shells!', rarity: 3, anim: 'crawl' },
            { emoji: '🪳', name: 'Rare Beetle', fact: 'This ancient beetle species is 300 million years old.', rarity: 3, anim: 'crawl' },

            // Very Rare (rarity 4)
            { emoji: '🦔', name: 'Baby Hedgehog', fact: 'Baby hedgehogs are called hoglets!', rarity: 4, anim: 'still' },
            { emoji: '🐢', name: 'Baby Turtle', fact: 'Turtles have been around for 200 million years.', rarity: 4, anim: 'still' },
            { emoji: '🦎', name: 'Gecko', fact: 'Geckos can walk on ceilings using molecular forces!', rarity: 4, anim: 'still' },
            { emoji: '🐁', name: 'Field Mouse', fact: 'Mice can squeeze through holes the size of a pencil.', rarity: 4, anim: 'wiggle' },

            // Legendary (rarity 5)
            { emoji: '🌈', name: 'Rainbow Beetle', fact: 'A mystical beetle said to bring good luck!', rarity: 5, anim: 'still' },
            { emoji: '✨', name: 'Fairy Ring', fact: 'An ancient circle of magical mushrooms!', rarity: 5, anim: 'still' },
            { emoji: '💎', name: 'Crystal Formation', fact: 'Took thousands of years to form underground.', rarity: 5, anim: 'still' },
            { emoji: '🦋', name: 'Rare Cocoon', fact: 'Inside, a magnificent butterfly is transforming!', rarity: 5, anim: 'still' },
        ];

        // Things that can also appear (not counted as species)
        this.extras = [
            { emoji: '🍂', name: 'Dead leaves' },
            { emoji: '🪨', name: 'Smaller rocks' },
            { emoji: '💧', name: 'Moisture' },
            { emoji: '🌱', name: 'Sprout' },
        ];

        this.rockColors = ['gray', 'brown', 'mossy', 'sandy', 'dark'];
        this.rockSizes = ['', 'small', 'large'];

        this.init();
    }

    init() {
        this.generateMeadow();
        this.setupEventListeners();
        this.updateJournal();
        document.getElementById('totalSpecies').textContent = this.creatures.length;
    }

    generateMeadow() {
        this.meadow.innerHTML = '';
        const rockCount = 12 + Math.floor(Math.random() * 6);

        for (let i = 0; i < rockCount; i++) {
            const rock = this.createRock();
            this.meadow.appendChild(rock);
        }
    }

    createRock() {
        const container = document.createElement('div');
        container.className = 'rock-container';

        // Random rock appearance
        const color = this.rockColors[Math.floor(Math.random() * this.rockColors.length)];
        const size = this.rockSizes[Math.floor(Math.random() * this.rockSizes.length)];

        // Dirt patch
        const dirt = document.createElement('div');
        dirt.className = 'dirt-patch';
        container.appendChild(dirt);

        // Underneath area
        const underneath = document.createElement('div');
        underneath.className = 'underneath';

        // Determine what's under this rock
        const contents = this.generateContents();
        contents.forEach(item => {
            const creature = document.createElement('span');
            creature.className = `creature ${item.anim || 'still'}`;
            creature.textContent = item.emoji;
            creature.title = item.name;
            creature.dataset.creature = JSON.stringify(item);
            underneath.appendChild(creature);
        });

        container.appendChild(underneath);
        container.dataset.contents = JSON.stringify(contents);

        // The rock itself
        const rock = document.createElement('div');
        rock.className = `rock ${color} ${size}`;
        container.appendChild(rock);

        // Random grass tufts
        if (Math.random() > 0.5) {
            const grass = document.createElement('span');
            grass.className = 'grass-tuft';
            grass.textContent = '🌿';
            grass.style.left = Math.random() > 0.5 ? '-5px' : '85%';
            container.appendChild(grass);
        }

        // Click handler
        container.addEventListener('click', () => this.flipRock(container));

        return container;
    }

    generateContents() {
        const contents = [];

        // Always have 1-4 things under each rock
        const count = 1 + Math.floor(Math.random() * 4);

        for (let i = 0; i < count; i++) {
            // 70% chance of creature, 30% chance of extra
            if (Math.random() < 0.7) {
                const creature = this.getRandomCreature();
                contents.push(creature);
            } else {
                const extra = this.extras[Math.floor(Math.random() * this.extras.length)];
                contents.push(extra);
            }
        }

        return contents;
    }

    getRandomCreature() {
        // Weighted random selection based on rarity
        // Lower rarity = more common
        const weights = this.creatures.map(c => 1 / (c.rarity * c.rarity));
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;

        for (let i = 0; i < this.creatures.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return this.creatures[i];
            }
        }

        return this.creatures[0];
    }

    flipRock(container) {
        if (container.classList.contains('flipped')) {
            // Unflip
            container.classList.remove('flipped');
            return;
        }

        container.classList.add('flipped');
        this.rocksFlipped++;

        // Hide hint after first flip
        if (this.hintShown) {
            document.getElementById('hint').classList.add('hidden');
            this.hintShown = false;
        }

        // Check for new discoveries
        const contents = JSON.parse(container.dataset.contents);
        const newCreatures = contents.filter(c => c.rarity && !this.discovered.has(c.name));

        if (newCreatures.length > 0) {
            // Show discovery popup for the rarest new find
            newCreatures.sort((a, b) => b.rarity - a.rarity);
            const discovery = newCreatures[0];
            this.discovered.add(discovery.name);
            this.showDiscovery(discovery, true);
        } else {
            // Chance to show info about existing creature
            const creatures = contents.filter(c => c.rarity);
            if (creatures.length > 0 && Math.random() < 0.3) {
                const creature = creatures[Math.floor(Math.random() * creatures.length)];
                this.showDiscovery(creature, false);
            }
        }

        this.updateJournal();
    }

    showDiscovery(creature, isNew) {
        const discovery = document.getElementById('discovery');
        const backdrop = document.getElementById('backdrop');

        document.getElementById('discoveryEmoji').textContent = creature.emoji;
        document.getElementById('discoveryName').textContent = creature.name;
        document.getElementById('discoveryFact').textContent = creature.fact;
        document.getElementById('newBadge').style.display = isNew ? 'inline-block' : 'none';

        discovery.classList.add('show');
        backdrop.classList.add('show');

        // Auto-close after delay or on click
        const close = () => {
            discovery.classList.remove('show');
            backdrop.classList.remove('show');
            backdrop.removeEventListener('click', close);
        };

        backdrop.addEventListener('click', close);
        setTimeout(close, isNew ? 4000 : 2500);
    }

    updateJournal() {
        document.getElementById('rocksFlipped').textContent = this.rocksFlipped;
        document.getElementById('speciesFound').textContent = this.discovered.size;

        // Find rarest discovered
        let rarestName = '-';
        let rarestRarity = 0;

        this.creatures.forEach(c => {
            if (this.discovered.has(c.name) && c.rarity > rarestRarity) {
                rarestRarity = c.rarity;
                rarestName = c.emoji + ' ' + c.name;
            }
        });

        document.getElementById('rarestFind').textContent = rarestName;
    }

    setupEventListeners() {
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.generateMeadow();
        });

        // Click on creature to see info
        this.meadow.addEventListener('click', (e) => {
            if (e.target.classList.contains('creature')) {
                const creature = JSON.parse(e.target.dataset.creature);
                if (creature.rarity) {
                    this.showDiscovery(creature, false);
                }
            }
        });
    }
}

// Start the game
new RockFlipper();
