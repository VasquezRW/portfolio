import { describe, expect, it } from 'vitest';
import { buildCareerGraph, type GraphJob } from '../../src/lib/career-graph';
import {
  formatYearMonth,
  monthsBetween,
  toDecimalYear,
  toDecimalYearEnd,
} from '../../src/lib/dates';

const jobs: GraphJob[] = [
  { id: 'b', company: 'B', role: 'QA', start: '2025-10', end: '2026-06', commits: ['x'] },
  { id: 'a', company: 'A', role: 'QA', start: '2023-01', end: '2025-09', commits: ['y', 'z'] },
];

const opts = { width: 1000, height: 380, now: 2026.9, personal: [{ name: 'p', date: '2025-01' }] };

describe('dates', () => {
  it('converts year-months to decimal years', () => {
    expect(toDecimalYear('2025-01')).toBe(2025);
    expect(toDecimalYear('2025-07')).toBe(2025.5);
    expect(toDecimalYearEnd('2025-12')).toBeCloseTo(2026);
  });

  it('counts months inclusively', () => {
    expect(monthsBetween('2023-01', '2025-09')).toBe(33);
    expect(monthsBetween('2025-10', '2026-06')).toBe(9);
  });

  it('rejects malformed values', () => {
    expect(() => toDecimalYear('2025-13')).toThrow();
  });

  it('formats per locale', () => {
    expect(formatYearMonth('2025-10', 'en-US')).toBe('Oct 2025');
  });
});

describe('buildCareerGraph', () => {
  const graph = buildCareerGraph(jobs, opts);

  it('orders branches chronologically and alternates lanes', () => {
    expect(graph.branches.map((b) => b.id)).toEqual(['a', 'b']);
    expect(graph.branches[0]!.label.y).not.toBe(graph.branches[1]!.label.y);
  });

  it('merges finished jobs back into the main line', () => {
    for (const b of graph.branches) {
      expect(b.open).toBe(false);
      expect(b.end.y).toBe(graph.main.from.y);
      expect(b.end.x).toBeGreaterThan(b.start.x);
    }
  });

  it('keeps a current job open to the right edge', () => {
    const open = buildCareerGraph([{ ...jobs[0]!, end: undefined }], opts);
    expect(open.branches[0]!.open).toBe(true);
    expect(open.branches[0]!.end.x).toBe(open.main.to.x);
  });

  it('places commits between branch start and end', () => {
    for (const b of graph.branches) {
      for (const c of b.commits) {
        expect(c.x).toBeGreaterThan(b.start.x);
        expect(c.x).toBeLessThan(b.end.x);
      }
    }
  });

  it('keeps everything inside the drawing area', () => {
    const xs = graph.branches.flatMap((b) => [b.start.x, b.end.x, ...b.commits.map((c) => c.x)]);
    expect(Math.min(...xs)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...xs)).toBeLessThanOrEqual(opts.width);
    expect(graph.axis.ticks.at(-1)!.x).toBeLessThanOrEqual(opts.width);
  });

  it('collapses commits that would overlap on a short branch', () => {
    const narrow = buildCareerGraph([{ ...jobs[0]!, commits: ['one', 'two', 'three'] }], {
      ...opts,
      width: 400,
    });
    expect(narrow.branches[0]!.commits).toEqual([
      expect.objectContaining({ name: 'one, two, three' }),
    ]);
  });

  it('draws the personal projects branch when there are projects', () => {
    expect(graph.personal?.commits).toHaveLength(1);
    expect(buildCareerGraph(jobs, { ...opts, personal: [] }).personal).toBeNull();
  });

  it('skips alternate year ticks when sparse', () => {
    const sparse = buildCareerGraph(jobs, { ...opts, sparseTicks: true });
    expect(sparse.axis.ticks.length).toBeLessThan(graph.axis.ticks.length);
  });
});
