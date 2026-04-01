import { test, describe } from 'node:test';
import assert from 'node:assert';
import { companionStatus, companionFeed, companionPet, companionReset, } from './responses.js';
describe('responses', () => {
    test('companion_status returns 3+ variants', () => {
        const variants = new Set();
        for (let i = 0; i < 100; i++) {
            variants.add(companionStatus('Gravy', 'duck'));
        }
        assert(variants.size >= 3, `status has ${variants.size} variants, want 3+`);
    });
    test('companion_status includes name', () => {
        const r = companionStatus('Butters', 'cat');
        assert(r.includes('Butters'), `includes name, got: ${r}`);
        // Not all variants mention species, but name should always be present
    });
    test('companion_feed returns 3+ variants', () => {
        const variants = new Set();
        for (let i = 0; i < 100; i++) {
            variants.add(companionFeed('Gravy', 'duck', 'const x = 1'));
        }
        assert(variants.size >= 3, `feed has ${variants.size} variants, want 3+`);
    });
    test('companion_feed handles empty code string', () => {
        const r = companionFeed('Gravy', 'duck', '');
        assert(r.length > 0, 'empty code produces response');
        assert(r.toLowerCase().includes('empty') || r.includes('0') || r.includes('nothing'), `empty code noted in: ${r}`);
    });
    test('companion_feed counts code length correctly', () => {
        const short = companionFeed('Gravy', 'duck', 'x'.repeat(50));
        const medium = companionFeed('Gravy', 'duck', 'x'.repeat(250));
        assert(short !== medium, `different lengths produce different responses: "${short}" vs "${medium}"`);
    });
    test('companion_feed includes name', () => {
        const r = companionFeed('Bubbles', 'goose', 'hello world');
        assert(r.includes('Bubbles'), `includes name, got: ${r}`);
    });
    test('companion_pet returns 3+ variants', () => {
        const variants = new Set();
        for (let i = 0; i < 100; i++) {
            variants.add(companionPet('Gravy', 'duck'));
        }
        assert(variants.size >= 3, `pet has ${variants.size} variants, want 3+`);
    });
    test('companion_pet includes name', () => {
        const r = companionPet('Snuggles', 'cat');
        assert(r.includes('Snuggles'), `includes name, got: ${r}`);
    });
    test('companion_reset returns 3+ variants', () => {
        const variants = new Set();
        for (let i = 0; i < 100; i++) {
            variants.add(companionReset('Gravy', 'duck'));
        }
        assert(variants.size >= 3, `reset has ${variants.size} variants, want 3+`);
    });
    test('companion_reset includes name', () => {
        const r = companionReset('Waffles', 'penguin');
        assert(r.includes('Waffles'), `includes name, got: ${r}`);
    });
});
