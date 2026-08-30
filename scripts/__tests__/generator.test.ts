// scripts/__tests__/generator.test.ts — Unit tests for generator
import { describe, it, expect, vi } from 'vitest';
import {
  hashString,
  createRNG,
  pick,
  pickN,
  fmt,
  yamlValue,
  buildFrontmatterYaml,
  buildFAQ,
  buildRelatedLinks,
  getPrepositional,
  getAccusativeUnit,
  getLocPre,
  getUnitAcc,
} from '../lib/generator.js';

describe('Utility Functions', () => {
  describe('hashString', () => {
    it('produces deterministic hash', () => {
      expect(hashString('test')).toBe(hashString('test'));
      expect(hashString('test')).toBe(3124687005); // known value
    });

    it('different strings produce different hashes', () => {
      expect(hashString('a')).not.toBe(hashString('b'));
    });
  });

  describe('createRNG', () => {
    it('produces deterministic sequence for same seed', () => {
      const rng1 = createRNG(42);
      const rng2 = createRNG(42);
      const seq1 = [rng1(), rng1(), rng1()];
      const seq2 = [rng2(), rng2(), rng2()];
      expect(seq1).toEqual(seq2);
    });

    it('different seeds produce different sequences', () => {
      const rng1 = createRNG(1);
      const rng2 = createRNG(2);
      expect(rng1()).not.toBe(rng2());
    });

    it('produces values in [0, 1)', () => {
      const rng = createRNG(123);
      for (let i = 0; i < 100; i++) {
        const v = rng();
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThan(1);
      }
    });
  });

  describe('pick', () => {
    it('returns element from array', () => {
      const rng = vi.fn().mockReturnValue(0.5);
      const arr = ['a', 'b', 'c'];
      const result = pick(arr, rng);
      expect(arr).toContain(result);
    });
  });

  describe('pickN', () => {
    it('returns N unique elements', () => {
      const rng = vi.fn()
        .mockReturnValueOnce(0.1)
        .mockReturnValueOnce(0.5)
        .mockReturnValueOnce(0.9);
      const arr = ['a', 'b', 'c', 'd', 'e'];
      const result = pickN(arr, 3, () => 0.5); // deterministic
      expect(result).toHaveLength(3);
      expect(new Set(result).size).toBe(3);
      expect(result.every(r => arr.includes(r))).toBe(true);
    });

    it('returns all elements if n >= array length', () => {
      const result = pickN(['a', 'b'], 5, () => 0.5);
      expect(result).toHaveLength(2);
    });
  });

  describe('fmt', () => {
    it('replaces placeholders', () => {
      expect(fmt('Hello {name}', { name: 'World' })).toBe('Hello World');
    });

    it('handles numbers', () => {
      expect(fmt('Price: {price}', { price: 100 })).toBe('Price: 100');
    });

    it('leaves unknown placeholders', () => {
      expect(fmt('{unknown}', {})).toBe('');
    });
  });

  describe('yamlValue', () => {
    it('outputs numbers unquoted', () => {
      expect(yamlValue(42)).toBe('42');
      expect(yamlValue(3.14)).toBe('3.14');
    });

    it('outputs strings quoted', () => {
      expect(yamlValue('hello')).toBe('"hello"');
    });

    it('escapes quotes in strings', () => {
      expect(yamlValue('he said "hi"')).toBe('"he said \'hi\'"');
    });

    it('outputs empty array as []', () => {
      expect(yamlValue([])).toBe('[]');
    });

    it('outputs arrays as YAML list', () => {
      expect(yamlValue(['a', 'b'])).toBe('\n  - "a"\n  - "b"');
    });
  });

  describe('buildFrontmatterYaml', () => {
    it('generates valid YAML frontmatter', () => {
      const fm = {
        title: 'Test',
        price_min: 100,
        tags: ['a', 'b'],
      };
      const yaml = buildFrontmatterYaml(fm);
      expect(yaml).toContain('title: "Test"');
      expect(yaml).toContain('price_min: 100');
      expect(yaml).toContain('- "a"');
      expect(yaml).toContain('- "b"');
      expect(yaml.startsWith('---\n')).toBe(true);
      expect(yaml.endsWith('\n---\n\n')).toBe(true);
    });
  });
});

describe('FAQ Generation', () => {
  it('generates 5 FAQ items', () => {
    const ctx = {
      pools: {
        FAQ_VARIANTS: {
          price_q: ['Q1'], price_a: ['A1'],
          eta_q: ['Q2'], eta_a: ['A2'],
          warranty_q: ['Q3'], warranty_a: ['A3'],
          urgent_q: ['Q4'], urgent_a: ['A4'],
          pay_q: ['Q5'], pay_a: ['A5'],
        },
        ETA_BY_ZONE: { city: '30 мин' },
      },
      site: { eta_city: '30 мин', work_hours: '8:00–22:00' },
      locPre: (l: any) => l.name,
      unitAcc: (u: string) => u,
      bishkekMin: {},
      currency: 'сом',
    } as any;

    const service = {
      name: 'Test', name_gen: 'теста', price_min: 100, price_max: 200,
      unit: 'точка', time: '30 мин', category: 'cat',
    } as any;

    const faq = buildFAQ(ctx, service, null, () => 0.5);
    expect(faq).toHaveLength(5);
    expect(faq[0].q).toBe('Q1');
    expect(faq[0].a).toContain('100');
  });
});

describe('Morphology', () => {
  describe('getPrepositional', () => {
    it('declines feminine nouns ending in -а', () => {
      expect(getPrepositional('Чолпон-Ата')).toBe('Чолпон-Ате');
      expect(getPrepositional('Темировка')).toBe('Темировке');
      expect(getPrepositional('Баетовка')).toBe('Баетовке');
    });

    it('handles -ово → -ове', () => {
      expect(getPrepositional('Ананьево')).toBe('Ананьеве');
      expect(getPrepositional('Жаркынбаево')).toBe('Жаркынбаево'); // fallback for Kyrgyz
    });

    it('handles -й → -е', () => {
      expect(getPrepositional('Кызыл-Орюк')).toBe('Кызыл-Орюке');
    });

    it('handles multi-word names', () => {
      expect(getPrepositional('Григорьевская пристань')).toBe('Григорьевской пристани');
    });

    it('falls back for indeclinable', () => {
      expect(getPrepositional('Бостери')).toBe('Бостери');
      expect(getPrepositional('Тамчы')).toBe('Тамчы');
    });
  });

  describe('getAccusativeUnit', () => {
    it('returns correct accusative for known units', () => {
      expect(getAccusativeUnit('точка')).toBe('точку');
      expect(getAccusativeUnit('камера')).toBe('камеру');
      expect(getAccusativeUnit('контур')).toBe('контур');
      expect(getAccusativeUnit('м')).toBe('метр');
      expect(getAccusativeUnit('шт')).toBe('шт');
    });

    it('falls back to original for unknown', () => {
      expect(getAccusativeUnit('unknown')).toBe('unknown');
    });
  });

  describe('getLocPre', () => {
    it('uses pre field when available', () => {
      expect(getLocPre({ pre: 'Чолпон-Ате', name: 'Чолпон-Ата' })).toBe('Чолпон-Ате');
    });

    it('falls back to generated', () => {
      expect(getLocPre({ name: 'Темировка' })).toBe('Темировке');
    });
  });

  describe('getUnitAcc', () => {
    it('aliases getAccusativeUnit', () => {
      expect(getUnitAcc('точка')).toBe('точку');
    });
  });
});

describe('YAML formatting', () => {
  it('outputs numbers unquoted', () => {
    expect(yamlValue(42)).toBe('42');
    expect(yamlValue(3.14)).toBe('3.14');
    expect(yamlValue(-10)).toBe('-10');
  });

  it('quotes strings and escapes quotes', () => {
    expect(yamlValue('hello')).toBe('"hello"');
    expect(yamlValue('he said "hi"')).toBe('"he said \'hi\'"');
  });

  it('formats arrays correctly', () => {
    expect(yamlValue([])).toBe('[]');
    expect(yamlValue(['a', 'b'])).toBe('\n  - "a"\n  - "b"');
  });

  it('handles empty array as []', () => {
    expect(yamlValue([])).toBe('[]');
  });
});