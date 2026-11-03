// Geometry for the 600-cell (hexacosichoron): the regular 4D polytope with
// 120 vertices, 720 edges, 1200 triangular faces and 600 tetrahedral cells.
//
// Vertices of a 600-cell of circumradius 1:
//   - 8   permutations of (±1, 0, 0, 0)
//   - 16  points (±½, ±½, ±½, ±½)
//   - 96  even permutations of ½(±φ, ±1, ±1/φ, 0)
// Two vertices share an edge when their distance is 1/φ (the edge length).

export type Vec4 = [number, number, number, number];

export interface Polytope {
  vertices: Vec4[];
  edges: [number, number][];
}

const PHI = (1 + Math.sqrt(5)) / 2;

// The 12 even permutations of four indices.
const EVEN_PERMS: number[][] = [
  [0, 1, 2, 3],
  [0, 2, 3, 1],
  [0, 3, 1, 2],
  [1, 0, 3, 2],
  [1, 2, 0, 3],
  [1, 3, 2, 0],
  [2, 0, 1, 3],
  [2, 1, 3, 0],
  [2, 3, 0, 1],
  [3, 0, 2, 1],
  [3, 1, 0, 2],
  [3, 2, 1, 0]
];

function signs(n: number): number[][] {
  const out: number[][] = [];
  for (let m = 0; m < 1 << n; m++) {
    const s: number[] = [];
    for (let i = 0; i < n; i++) s.push(m & (1 << i) ? -1 : 1);
    out.push(s);
  }
  return out;
}

export function build600Cell(): Polytope {
  const vertices: Vec4[] = [];

  for (let axis = 0; axis < 4; axis++) {
    for (const s of [1, -1]) {
      const v: Vec4 = [0, 0, 0, 0];
      v[axis] = s;
      vertices.push(v);
    }
  }

  for (const s of signs(4)) {
    vertices.push([s[0] / 2, s[1] / 2, s[2] / 2, s[3] / 2]);
  }

  const base = [PHI / 2, 1 / 2, 1 / (2 * PHI)];
  for (const s of signs(3)) {
    const src = [base[0] * s[0], base[1] * s[1], base[2] * s[2], 0];
    for (const p of EVEN_PERMS) {
      vertices.push([src[p[0]], src[p[1]], src[p[2]], src[p[3]]]);
    }
  }

  const edgeLenSq = 1 / (PHI * PHI);
  const edges: [number, number][] = [];
  for (let i = 0; i < vertices.length; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
      const a = vertices[i];
      const b = vertices[j];
      const dx = a[0] - b[0];
      const dy = a[1] - b[1];
      const dz = a[2] - b[2];
      const dw = a[3] - b[3];
      if (Math.abs(dx * dx + dy * dy + dz * dz + dw * dw - edgeLenSq) < 1e-6) {
        edges.push([i, j]);
      }
    }
  }

  return { vertices, edges };
}
