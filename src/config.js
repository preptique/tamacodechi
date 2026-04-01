// Config loading — ~/.tamacodechi/config.json with graceful defaults
import { readFileSync, existsSync } from 'fs';
const DEFAULT_CONFIG = {
    species: 'duck',
    name: 'Gravy',
    rarity: 'common',
    hat: 'none',
};
const VALID_SPECIES = [
    'duck', 'goose', 'blob', 'cat', 'dragon', 'octopus', 'owl', 'penguin',
    'turtle', 'snail', 'ghost', 'axolotl', 'capybara', 'cactus', 'robot',
    'rabbit', 'mushroom', 'chonk',
];
export function loadConfig(configPath) {
    try {
        if (!existsSync(configPath)) {
            return { ...DEFAULT_CONFIG };
        }
        const raw = readFileSync(configPath, 'utf-8');
        const parsed = JSON.parse(raw);
        const cfg = {
            species: VALID_SPECIES.includes(parsed.species ?? '') ? parsed.species : DEFAULT_CONFIG.species,
            name: typeof parsed.name === 'string' && parsed.name.length > 0 ? parsed.name : DEFAULT_CONFIG.name,
            rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary'].includes(parsed.rarity ?? '') ? parsed.rarity : DEFAULT_CONFIG.rarity,
            hat: parsed.hat ?? DEFAULT_CONFIG.hat,
        };
        return cfg;
    }
    catch {
        return { ...DEFAULT_CONFIG };
    }
}
export function getConfigPath() {
    const home = process.env.HOME ?? process.env.USERPROFILE ?? '/tmp';
    return `${home}/.tamacodechi/config.json`;
}
