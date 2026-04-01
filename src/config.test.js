import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import { writeFileSync, unlinkSync, mkdirSync } from 'fs';
import { loadConfig, getConfigPath } from './config.js';
const tmpdir = '/tmp/tamacodechi-test-' + Math.random().toString(36).slice(2);
beforeEach(() => {
    mkdirSync(tmpdir, { recursive: true });
});
function tmpPath(name) {
    return `${tmpdir}/${name}`;
}
describe('config', () => {
    test('missing config uses defaults', () => {
        const cfg = loadConfig('/nonexistent/path/config.json');
        assert(cfg.species === 'duck', `species: got ${cfg.species}, want duck`);
        assert(cfg.name === 'Gravy', `name: got ${cfg.name}, want Gravy`);
        assert(cfg.rarity === 'common', `rarity: got ${cfg.rarity}, want common`);
        assert(cfg.hat === 'none', `hat: got ${cfg.hat}, want none`);
    });
    test('corrupt JSON uses defaults', () => {
        const path = tmpPath('corrupt.json');
        writeFileSync(path, '{ broken json');
        const cfg = loadConfig(path);
        assert(cfg.species === 'duck', `corrupt JSON: species got ${cfg.species}, want duck`);
        assert(cfg.name === 'Gravy', `corrupt JSON: name got ${cfg.name}, want Gravy`);
        unlinkSync(path);
    });
    test('invalid species uses default duck', () => {
        const path = tmpPath('badspecies.json');
        writeFileSync(path, JSON.stringify({ species: 'unicorn', name: 'Fluffy' }));
        const cfg = loadConfig(path);
        assert(cfg.species === 'duck', `invalid species: got ${cfg.species}, want duck`);
        assert(cfg.name === 'Fluffy', `name should be preserved: got ${cfg.name}`);
        unlinkSync(path);
    });
    test('valid config is loaded correctly', () => {
        const path = tmpPath('valid.json');
        writeFileSync(path, JSON.stringify({ species: 'cat', name: 'Mittens', rarity: 'rare', hat: 'crown' }));
        const cfg = loadConfig(path);
        assert(cfg.species === 'cat', `species: got ${cfg.species}, want cat`);
        assert(cfg.name === 'Mittens', `name: got ${cfg.name}, want Mittens`);
        assert(cfg.rarity === 'rare', `rarity: got ${cfg.rarity}, want rare`);
        assert(cfg.hat === 'crown', `hat: got ${cfg.hat}, want crown`);
        unlinkSync(path);
    });
    test('partial config fills in defaults', () => {
        const path = tmpPath('partial.json');
        writeFileSync(path, JSON.stringify({ name: 'Patches' }));
        const cfg = loadConfig(path);
        assert(cfg.species === 'duck', `missing fields use defaults: species got ${cfg.species}`);
        assert(cfg.name === 'Patches', `present fields preserved: name got ${cfg.name}`);
        unlinkSync(path);
    });
    test('getConfigPath returns a path with HOME', () => {
        const p = getConfigPath();
        assert(p.includes('.tamacodechi/config.json'), `got: ${p}`);
        assert(p.startsWith('/'), `should be absolute: ${p}`);
    });
});
