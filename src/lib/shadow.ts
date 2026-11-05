// Geometry for the "Shadow Projection" figure: a seeded cloud of points on the
// 3-sphere in 4D, joined to their nearest neighbours *in 4D*. Rotations are
// isometries, so that graph never changes for a seed; only the way it casts
// its shadow on the page does.

export type Vec4 = [number, number, number, number];

export interface ShadowFigure {
  vertices: Vec4[];
  // [a, b, length in 4D]
  edges: [number, number, number][];
  maxEdge: number;
  // Seeded rotation rates and phase offsets for the XW, YZ and ZW planes.
  rate: [number, number, number];
  offset: [number, number, number];
}

export interface Projection {
  x: Float32Array; // roughly [-1.5, 1.5], multiply by a pixel scale
  y: Float32Array;
  w: Float32Array; // hidden 4D coordinate, -1 (far) .. 1 (near)
  k: Float32Array; // 3D perspective factor, close to 1
}

// Camera distance of the 3D viewer along z.
const CAMERA_3D = 4;

// mulberry32: a tiny seeded generator, so a seed always gives the same figure.
export function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(rand: () => number): number {
  // Box-Muller; 1 - rand() keeps the log argument above zero.
  const u = 1 - rand();
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function dist4(a: Vec4, b: Vec4): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  const dw = a[3] - b[3];
  return Math.sqrt(dx * dx + dy * dy + dz * dz + dw * dw);
}

export function buildFigure(
  seed: number,
  count: number,
  neighbors: number
): ShadowFigure {
  const rand = seeded(seed);

  // Each seed turns the figure at its own cadence of incommensurate rates.
  const rate: [number, number, number] = [
    1,
    0.5 + rand() * 0.35,
    0.15 + rand() * 0.3
  ];
  const offset: [number, number, number] = [
    rand() * Math.PI * 2,
    rand() * Math.PI * 2,
    rand() * Math.PI * 2
  ];

  // Uniform scatter on the 3-sphere: normalised Gaussian vectors in 4D.
  const vertices: Vec4[] = [];
  for (let i = 0; i < count; i++) {
    const x = gaussian(rand);
    const y = gaussian(rand);
    const z = gaussian(rand);
    const w = gaussian(rand);
    const m = Math.sqrt(x * x + y * y + z * z + w * w) || 1;
    vertices.push([x / m, y / m, z / m, w / m]);
  }

  const edges: [number, number, number][] = [];
  const seen: { [key: number]: boolean } = {};
  let maxEdge = 1e-9;
  for (let i = 0; i < count; i++) {
    const near: [number, number][] = [];
    for (let j = 0; j < count; j++) {
      if (j !== i) near.push([dist4(vertices[i], vertices[j]), j]);
    }
    near.sort((p, q) => p[0] - q[0]);
    for (let m = 0; m < neighbors && m < near.length; m++) {
      const j = near[m][1];
      const key = Math.min(i, j) * 100000 + Math.max(i, j);
      if (!seen[key]) {
        seen[key] = true;
        edges.push([i, j, near[m][0]]);
        if (near[m][0] > maxEdge) maxEdge = near[m][0];
      }
    }
  }

  return { vertices, edges, maxEdge, rate, offset };
}

export function createProjection(count: number): Projection {
  return {
    x: new Float32Array(count),
    y: new Float32Array(count),
    w: new Float32Array(count),
    k: new Float32Array(count)
  };
}

// Rotate in the XW, YZ and ZW planes, perspective 4D -> 3D, turn the view by
// yaw/pitch, then perspective 3D -> 2D. `depth4` is the 4D camera distance
// (larger is gentler) and must be above 2.
export function project(
  fig: ShadowFigure,
  t: number,
  depth4: number,
  yaw: number,
  pitch: number,
  out: Projection
): void {
  const a = t * fig.rate[0] + fig.offset[0];
  const b = t * fig.rate[1] + fig.offset[1];
  const c = t * fig.rate[2] + fig.offset[2];
  const ca = Math.cos(a), sa = Math.sin(a);
  const cb = Math.cos(b), sb = Math.sin(b);
  const cc = Math.cos(c), sc = Math.sin(c);
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  const cp = Math.cos(pitch), sp = Math.sin(pitch);

  for (let i = 0; i < fig.vertices.length; i++) {
    const v = fig.vertices[i];
    let x = v[0], y = v[1], z = v[2], w = v[3];
    let n: number;

    // XW
    n = x * ca - w * sa;
    w = x * sa + w * ca;
    x = n;
    // YZ
    n = y * cb - z * sb;
    z = y * sb + z * cb;
    y = n;
    // ZW
    n = z * cc - w * sc;
    w = z * sc + w * cc;
    z = n;

    // 4D -> 3D
    const k4 = depth4 / (depth4 - w);
    x *= k4;
    y *= k4;
    z *= k4;

    // View turn
    const x2 = x * cy + z * sy;
    const z2 = -x * sy + z * cy;
    const y2 = y * cp - z2 * sp;
    const z3 = y * sp + z2 * cp;

    // 3D -> 2D
    const k3 = CAMERA_3D / (CAMERA_3D - z3);
    out.x[i] = x2 * k3;
    out.y[i] = y2 * k3;
    out.w[i] = w;
    out.k[i] = k3;
  }
}
