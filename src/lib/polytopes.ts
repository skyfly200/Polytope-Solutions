// Small set of regular 4D polytopes for the home page visuals. Every shape is
// scaled so its vertices sit on a unit circumsphere, which lets one renderer
// draw them all at a similar size.

import { build600Cell, Polytope, Vec4 } from "@/lib/polytope600";

export type ShapeName = "tesseract" | "cell16" | "cell24" | "cell600";

const cache = new Map<ShapeName, Polytope>();

// Joins every pair of vertices at the shortest non-zero distance found.
function edgesAtMinDistance(vertices: Vec4[]): [number, number][] {
  const d2 = (a: Vec4, b: Vec4) =>
    (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2 + (a[3] - b[3]) ** 2;
  let min = Infinity;
  for (let i = 0; i < vertices.length; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
      min = Math.min(min, d2(vertices[i], vertices[j]));
    }
  }
  const edges: [number, number][] = [];
  for (let i = 0; i < vertices.length; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
      if (Math.abs(d2(vertices[i], vertices[j]) - min) < 1e-6) edges.push([i, j]);
    }
  }
  return edges;
}

function unitCircumsphere(vertices: Vec4[]): Vec4[] {
  let max = 0;
  for (const v of vertices) max = Math.max(max, Math.hypot(v[0], v[1], v[2], v[3]));
  return vertices.map(v => [v[0] / max, v[1] / max, v[2] / max, v[3] / max] as Vec4);
}

function tesseract(): Polytope {
  const vertices: Vec4[] = [];
  for (let m = 0; m < 16; m++) {
    vertices.push([0, 1, 2, 3].map(bit => (m & (1 << bit) ? 1 : -1)) as Vec4);
  }
  const v = unitCircumsphere(vertices);
  return { vertices: v, edges: edgesAtMinDistance(v) };
}

function cell16(): Polytope {
  const vertices: Vec4[] = [];
  for (let axis = 0; axis < 4; axis++) {
    for (const s of [1, -1]) {
      const v: Vec4 = [0, 0, 0, 0];
      v[axis] = s;
      vertices.push(v);
    }
  }
  return { vertices, edges: edgesAtMinDistance(vertices) };
}

function cell24(): Polytope {
  // Permutations of (±1, ±1, 0, 0): every pair of axes with four sign choices.
  const vertices: Vec4[] = [];
  for (let i = 0; i < 4; i++) {
    for (let j = i + 1; j < 4; j++) {
      for (const si of [1, -1]) {
        for (const sj of [1, -1]) {
          const v: Vec4 = [0, 0, 0, 0];
          v[i] = si;
          v[j] = sj;
          vertices.push(v);
        }
      }
    }
  }
  const v = unitCircumsphere(vertices);
  return { vertices: v, edges: edgesAtMinDistance(v) };
}

export function getPolytope(shape: ShapeName): Polytope {
  let poly = cache.get(shape);
  if (!poly) {
    switch (shape) {
      case "tesseract":
        poly = tesseract();
        break;
      case "cell16":
        poly = cell16();
        break;
      case "cell24":
        poly = cell24();
        break;
      default:
        poly = build600Cell();
    }
    cache.set(shape, poly);
  }
  return poly;
}
