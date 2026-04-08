export interface Point {
  x: number;
  y: number;
}

/**
 * Calculate angle ABC (angle at point B)
 * @param A - Point A {x, y}
 * @param B - Point B {x, y} (vertex)
 * @param C - Point C {x, y}
 * @returns - Angle in degrees
 */
export function calculateAngle(A: Point, B: Point, C: Point): number {
  // Vector BA
  const BA = { x: A.x - B.x, y: A.y - B.y };
  // Vector BC
  const BC = { x: C.x - B.x, y: C.y - B.y };

  // Calculate angle using dot product
  const dotProduct = BA.x * BC.x + BA.y * BC.y;
  const magnitudeBA = Math.sqrt(BA.x * BA.x + BA.y * BA.y);
  const magnitudeBC = Math.sqrt(BC.x * BC.x + BC.y * BC.y);

  if (magnitudeBA === 0 || magnitudeBC === 0) return 0;

  const cosAngle = dotProduct / (magnitudeBA * magnitudeBC);
  const angleRad = Math.acos(Math.max(-1, Math.min(1, cosAngle))); // Clamp to [-1, 1]

  return angleRad * (180 / Math.PI);
}

/**
 * Calculate angle between two lines
 * Line 1: A-B, Line 2: C-D
 * @param A - Point A {x, y}
 * @param B - Point B {x, y}
 * @param C - Point C {x, y}
 * @param D - Point D {x, y}
 * @returns - Angle in degrees
 */
export function calculateAngleBetweenLines(A: Point, B: Point, C: Point, D: Point): number {
  // Direction vector of line AB
  const v1 = { x: B.x - A.x, y: B.y - A.y };
  // Direction vector of line CD
  const v2 = { x: D.x - C.x, y: D.y - C.y };

  // Calculate angle using dot product
  const dotProduct = v1.x * v2.x + v1.y * v2.y;
  const magnitude1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
  const magnitude2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);

  if (magnitude1 === 0 || magnitude2 === 0) return 0;

  const cosAngle = dotProduct / (magnitude1 * magnitude2);
  const angleRad = Math.acos(Math.max(-1, Math.min(1, cosAngle)));

  return angleRad * (180 / Math.PI);
}

/**
 * Calculate distance between two points
 * @param A - Point A {x, y}
 * @param B - Point B {x, y}
 * @returns - Distance in pixels
 */
export function calculateDistance(A: Point, B: Point): number {
  const dx = B.x - A.x;
  const dy = B.y - A.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate perpendicular distance from point P to line AB
 * @param P - Point P {x, y}
 * @param A - Point A {x, y} on the line
 * @param B - Point B {x, y} on the line
 * @returns - Perpendicular distance
 */
export function calculatePointToLineDistance(P: Point, A: Point, B: Point): number {
  const lineLength = calculateDistance(A, B);
  if (lineLength === 0) return calculateDistance(P, A);

  // Using cross product to find perpendicular distance
  const numerator = Math.abs(
    (B.y - A.y) * P.x - (B.x - A.x) * P.y + B.x * A.y - B.y * A.x
  );
  return numerator / lineLength;
}
