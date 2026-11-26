import { toDecimalYear, toDecimalYearEnd, type YearMonth } from './dates';

/**
 * Pure geometry for the career graph: the career drawn as a git history.
 * A main line runs left to right; each job branches off at its start and merges
 * back at its end; a job without an end stays open to the right edge.
 * Personal projects sit on a dashed branch below the main line.
 */

export interface GraphJob {
  id: string;
  company: string;
  role: string;
  start: YearMonth;
  end?: YearMonth;
  commits: string[]; // project names shown as commits on the branch
}

export interface GraphOptions {
  width: number;
  height: number;
  /** Decimal year shown at the right edge (usually the build date). */
  now: number;
  personal: { name: string; date: YearMonth }[];
  margin?: { left: number; right: number };
  /** Show every other year label when the graph is narrow. */
  sparseTicks?: boolean;
}

export interface Point {
  x: number;
  y: number;
}

export interface GraphBranch {
  id: string;
  company: string;
  role: string;
  open: boolean;
  colorIndex: number;
  path: string;
  start: Point;
  end: Point;
  label: Point;
  commits: (Point & { name: string })[];
}

export interface CareerGraph {
  width: number;
  height: number;
  main: { from: Point; to: Point };
  personal: { path: string; label: Point; commits: (Point & { name: string })[] } | null;
  branches: GraphBranch[];
  axis: { y: number; ticks: { x: number; year: number }[] };
}

const LANE_OFFSETS = [80, 170];
const CURVE = 26;
const MIN_COMMIT_GAP = 16;

export function buildCareerGraph(jobs: GraphJob[], opts: GraphOptions): CareerGraph {
  const { width, height, now, personal } = opts;
  const margin = opts.margin ?? { left: 20, right: 28 };
  const sorted = [...jobs].sort((a, b) => toDecimalYear(a.start) - toDecimalYear(b.start));

  const startDates = [
    ...sorted.map((j) => toDecimalYear(j.start)),
    ...personal.map((p) => toDecimalYear(p.date)),
  ];
  const yearStart = Math.floor(Math.min(...startDates, now)) - 1;
  const yearEnd = Math.ceil(now + 0.01);

  const innerW = width - margin.left - margin.right;
  const x = (year: number) =>
    round(margin.left + ((year - yearStart) / (yearEnd - yearStart)) * innerW);

  const axisY = height - 40;
  const mainY = height - 104;
  const personalY = mainY + 46;
  const right = width - margin.right;

  const branches = sorted.map((job, i): GraphBranch => {
    const laneY = mainY - LANE_OFFSETS[i % LANE_OFFSETS.length]!;
    const xs = x(toDecimalYear(job.start));
    const open = !job.end;
    const xe = open ? right : x(toDecimalYearEnd(job.end!));
    const k = Math.min(CURVE, (xe - xs) / 3);
    let path = `M${xs},${mainY} C${xs},${laneY} ${xs},${laneY} ${round(xs + k)},${laneY} L${round(open ? xe : xe - k)},${laneY}`;
    if (!open) path += ` C${xe},${laneY} ${xe},${laneY} ${xe},${mainY}`;
    // When the branch is too short to space commits apart, collapse them into one dot
    // whose tooltip lists every name.
    const span = xe - xs - 2 * k;
    const names =
      span / (job.commits.length + 1) >= MIN_COMMIT_GAP ? job.commits : [job.commits.join(', ')];
    const commits = names.map((name, c) => ({
      name,
      x: round(xs + k + (span * (c + 1)) / (names.length + 1)),
      y: laneY,
    }));
    return {
      id: job.id,
      company: job.company,
      role: job.role,
      open,
      colorIndex: i,
      path,
      start: { x: xs, y: mainY },
      end: open ? { x: xe, y: laneY } : { x: xe, y: mainY },
      label: { x: xs + 8, y: laneY },
      commits,
    };
  });

  let personalBranch: CareerGraph['personal'] = null;
  if (personal.length > 0) {
    const first = Math.min(...personal.map((p) => toDecimalYear(p.date)));
    const px = x(first - 0.25);
    personalBranch = {
      path: `M${px},${mainY} C${px},${personalY} ${px},${personalY} ${px + 20},${personalY} L${right},${personalY}`,
      label: { x: px + 26, y: personalY },
      commits: personal.map((p) => ({ name: p.name, x: x(toDecimalYear(p.date)), y: personalY })),
    };
  }

  const ticks: { x: number; year: number }[] = [];
  for (let year = yearStart; year <= yearEnd; year++) {
    if (opts.sparseTicks && (year - yearStart) % 2 === 1) continue;
    ticks.push({ x: x(year), year });
  }

  return {
    width,
    height,
    main: { from: { x: margin.left, y: mainY }, to: { x: right, y: mainY } },
    personal: personalBranch,
    branches,
    axis: { y: axisY, ticks },
  };
}

function round(n: number): number {
  return Math.round(n * 10) / 10;
}
