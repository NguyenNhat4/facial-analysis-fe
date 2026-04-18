import { Point } from "../../../core/geometry/math-utils";
import { LandmarksObject } from "../types";

/**
 * Find intersection of two infinite lines
 * Line 1: passes through A and B
 * Line 2: passes through C and D
 * Returns intersection point or null if lines are parallel
 */
function findLineIntersection(A: Point, B: Point, C: Point, D: Point): Point | null {
  const x1 = A.x, y1 = A.y;
  const x2 = B.x, y2 = B.y;
  const x3 = C.x, y3 = C.y;
  const x4 = D.x, y4 = D.y;

  const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  
  // Lines are parallel if denominator is 0
  if (Math.abs(denom) < 0.0001) return null;

  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;

  return {
    x: x1 + t * (x2 - x1),
    y: y1 + t * (y2 - y1)
  };
}

/**
 * Draw a line on canvas
 * @param ctx - Canvas context
 * @param start - Start point {x, y}
 * @param end - End point {x, y}
 * @param scale - Scale factor
 * @param color - Line color
 * @param width - Line width
 * @param dash - Line dash pattern
 */
export function drawLine(
  ctx: CanvasRenderingContext2D,
  start: Point,
  end: Point,
  scale: number,
  color: string = '#FF0000',
  width: number = 2,
  dash: number[] = []
): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash(dash);
  ctx.beginPath();
  ctx.moveTo(start.x * scale, start.y * scale);
  ctx.lineTo(end.x * scale, end.y * scale);
  ctx.stroke();
  ctx.restore();
}

/**
 * Draw an angle arc
 * @param ctx - Canvas context
 * @param A - Point A {x, y}
 * @param B - Point B {x, y} (vertex)
 * @param C - Point C {x, y}
 * @param scale - Scale factor
 * @param color - Arc color
 */
export function drawAngleArc(
  ctx: CanvasRenderingContext2D,
  A: Point,
  B: Point,
  C: Point,
  scale: number,
  color: string = '#FF0000'
): void {
  const radius = 30;

  // Calculate angles
  let angleToA = Math.atan2(A.y - B.y, A.x - B.x);
  let angleToC = Math.atan2(C.y - B.y, C.x - B.x);

  // Calculate raw angle difference
  let angleDiff = angleToC - angleToA;

  // Normalize to [0, 2π] to get the absolute angle
  while (angleDiff < 0) angleDiff += 2 * Math.PI;
  while (angleDiff >= 2 * Math.PI) angleDiff -= 2 * Math.PI;

  // Determine if we should draw clockwise or counterclockwise
  // to get the SMALLER angle (inner angle < 180°)
  let anticlockwise;
  if (angleDiff <= Math.PI) {
    // The counterclockwise angle from A to C is <= 180°, use it
    anticlockwise = false;
  } else {
    // The counterclockwise angle is > 180°, so the clockwise angle is smaller
    anticlockwise = true;
  }

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(B.x * scale, B.y * scale, radius, angleToA, angleToC, anticlockwise);
  ctx.stroke();
  ctx.restore();
}

/**
 * Draw an extended (infinite-looking) line that passes through A and B
 * @param ctx - Canvas context
 * @param A - Point A {x, y}
 * @param B - Point B {x, y}
 * @param scale - Scale factor
 * @param color - Line color
 * @param width - Line width
 * @param dash - Line dash pattern
 */
export function drawExtendedLine(
  ctx: CanvasRenderingContext2D,
  A: Point,
  B: Point,
  scale: number,
  color: string = '#FF0000',
  width: number = 2,
  dash: number[] = []
): void {
  const extensionLength = 2000; // Arbitrary large number to make it look infinite

  const dx = B.x - A.x;
  const dy = B.y - A.y;
  const length = Math.sqrt(dx * dx + dy * dy);

  if (length === 0) return;

  const ux = dx / length;
  const uy = dy / length;

  const extendedStart = {
    x: A.x - ux * extensionLength,
    y: A.y - uy * extensionLength
  };

  const extendedEnd = {
    x: B.x + ux * extensionLength,
    y: B.y + uy * extensionLength
  };

  drawLine(ctx, extendedStart, extendedEnd, scale, color, width, dash);
}


/**
 * Draw perpendicular line from point to line
 * @param ctx - Canvas context
 * @param P - Point P {x, y}
 * @param A - Point A {x, y} on the line
 * @param B - Point B {x, y} on the line
 * @param scale - Scale factor
 * @param color - Line color
 * @param dashed - Whether to draw as a dashed line
 */
export function drawPerpendicularLine(
  ctx: CanvasRenderingContext2D,
  P: Point,
  A: Point,
  B: Point,
  scale: number,
  color: string = '#00FF00',
  dashed: boolean = true
): void {
  // Find perpendicular projection point on line AB
  const AP = { x: P.x - A.x, y: P.y - A.y };
  const AB = { x: B.x - A.x, y: B.y - A.y };

  const dotProduct = AP.x * AB.x + AP.y * AB.y;
  const lengthSquared = AB.x * AB.x + AB.y * AB.y;

  if (lengthSquared === 0) return;

  const t = dotProduct / lengthSquared;
  const projection = {
    x: A.x + t * AB.x,
    y: A.y + t * AB.y
  };

  drawLine(ctx, P, projection, scale, color, 2, dashed ? [5, 5] : []);
}

/**
 * Draw measurement line with arrows
 * @param ctx - Canvas context
 * @param start - Start point {x, y}
 * @param end - End point {x, y}
 * @param scale - Scale factor
 */
export function drawMeasurementLine(
  ctx: CanvasRenderingContext2D,
  start: Point,
  end: Point,
  scale: number
): void {
  const color = '#FFFF00';
  drawLine(ctx, start, end, scale, color, 2);

  // Draw arrows
  const arrowSize = 10;
  const angle = Math.atan2(end.y - start.y, end.x - start.x);

  // Arrow at start
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(start.x * scale, start.y * scale);
  ctx.lineTo(
    (start.x + arrowSize * Math.cos(angle + Math.PI / 6)) * scale,
    (start.y + arrowSize * Math.sin(angle + Math.PI / 6)) * scale
  );
  ctx.lineTo(
    (start.x + arrowSize * Math.cos(angle - Math.PI / 6)) * scale,
    (start.y + arrowSize * Math.sin(angle - Math.PI / 6)) * scale
  );
  ctx.closePath();
  ctx.fill();

  // Arrow at end
  ctx.beginPath();
  ctx.moveTo(end.x * scale, end.y * scale);
  ctx.lineTo(
    (end.x - arrowSize * Math.cos(angle + Math.PI / 6)) * scale,
    (end.y - arrowSize * Math.sin(angle + Math.PI / 6)) * scale
  );
  ctx.lineTo(
    (end.x - arrowSize * Math.cos(angle - Math.PI / 6)) * scale,
    (end.y - arrowSize * Math.sin(angle - Math.PI / 6)) * scale
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}


/**
 * Draw guides for specific measurements
 */
export const drawMeasurementGuides: Record<string, (ctx: CanvasRenderingContext2D, landmarks: LandmarksObject, scale: number) => void> = {
  SNA: (ctx, landmarks, scale) => {
    const { S, N, A } = landmarks;
    if (!S || !N || !A) return;
    drawLine(ctx, S, N, scale, '#FFFF00', 2);
    drawLine(ctx, N, A, scale, '#FFFF00', 2);
    drawAngleArc(ctx, S, N, A, scale, '#00FF00');
  },
  SNB: (ctx, landmarks, scale) => {
    const { S, N, B } = landmarks;
    if (!S || !N || !B) return;
    drawLine(ctx, S, N, scale, '#FFFF00', 2);
    drawLine(ctx, N, B, scale, '#FFFF00', 2);
    drawAngleArc(ctx, S, N, B, scale, '#00FF00');
  },
  ANB: (ctx, landmarks, scale) => {
    const { A, N, B } = landmarks;
    if (!A || !N || !B) return;
    drawLine(ctx, A, N, scale, '#FFFF00', 2);
    drawLine(ctx, N, B, scale, '#FFFF00', 2);
    drawAngleArc(ctx, A, N, B, scale, '#00FF00');
  },
  WITS: (ctx, landmarks, scale) => {
    const { A, B, ANS, PNS } = landmarks;
    if (!A || !B || !ANS || !PNS) return;
    drawLine(ctx, ANS, PNS, scale, '#F38181', 1, [5, 5]);
    drawLine(ctx, A, { x: A.x, y: B.y }, scale, '#F38181', 2);
    drawLine(ctx, B, { x: B.x, y: A.y }, scale, '#F38181', 2);
  },
  FHR: (ctx, landmarks, scale) => {
    const { N, ANS, Me } = landmarks;
    if (!N || !ANS || !Me) return;
    drawLine(ctx, N, ANS, scale, '#FFB6B9', 3);
    drawLine(ctx, N, Me, scale, '#FFC9C9', 2, [5, 5]);
  },
  FMA: (ctx, landmarks, scale) => {
    const { Po, Or, Go, Me } = landmarks;
    if (!Po || !Or || !Go || !Me) return;
    drawLine(ctx, Po, Or, scale, '#FECA57', 2);
    drawLine(ctx, Go, Me, scale, '#FF6348', 2);
  },
  MPA: (ctx, landmarks, scale) => {
    const { S, N, Go, Gn } = landmarks;
    if (!S || !N || !Go || !Gn) return;
    drawLine(ctx, S, N, scale, '#A8E6CF', 2);
    drawLine(ctx, Go, Gn, scale, '#DCEDC1', 2);
  },
  FAA: (ctx, landmarks, scale) => {
    const { N, Gn, Po, Or } = landmarks;
    if (!N || !Gn || !Po || !Or) return;
    drawLine(ctx, N, Gn, scale, '#FFD3B6', 2);
    drawLine(ctx, Po, Or, scale, '#FFAAA5', 2);
  },
  FD: (ctx, landmarks, scale) => {
    const { N, Pog, Po, Or } = landmarks;
    if (!N || !Pog || !Po || !Or) return;
    drawLine(ctx, N, Pog, scale, '#D4A5A5', 2);
    drawLine(ctx, Po, Or, scale, '#FFCDA3', 2);
  },
  DH: (ctx, landmarks, scale) => {
    const { ANS, Me } = landmarks;
    if (!ANS || !Me) return;
    drawLine(ctx, ANS, Me, scale, '#E8B4B8', 2);
    drawMeasurementLine(ctx, ANS, Me, scale);
  },
  "I-NA": (ctx, landmarks, scale) => {
    const I = landmarks.I || landmarks.UIT;
    const { N, A } = landmarks;
    if (!I || !N || !A) return;
    
    // Draw NA reference line as dotted yellow
    drawExtendedLine(ctx, N, A, scale, '#FFFF00', 2, [5, 5]);
    
    // Draw I (upper incisor) to NA as solid green
    drawPerpendicularLine(ctx, I, N, A, scale, '#00FF00', false);
  
  },
  "i-NB": (ctx, landmarks, scale) => {
    const i = landmarks.i || landmarks.LIT;
    const I = landmarks.I || landmarks.UIT;
    const { N, B } = landmarks;
    if (!i || !N || !B) return;
    
    // Draw NB reference line as dotted yellow
    drawExtendedLine(ctx, N, B, scale, '#FFFF00', 2, [5, 5]);
    
    // Draw i (lower incisor) to NB as solid green
    drawPerpendicularLine(ctx, i, N, B, scale, '#00FF00', false);
    
  },
  INTERINCISAL: (ctx, landmarks, scale) => {
    const { UIT, UIA, LIT, LIA } = landmarks;
    if (!UIT || !UIA || !LIT || !LIA) return;
    drawLine(ctx, UIT, UIA, scale, '#F4A261', 2);
    drawLine(ctx, LIT, LIA, scale, '#E76F51', 2);
  },
  "i_MP": (ctx, landmarks, scale) => {
    const i = landmarks.i || landmarks.LIT;
    const LIA = landmarks.LIA;
    const Go = landmarks.go || landmarks.Go;
    const Me = landmarks.Me;
    if (!i || !LIA || !Go || !Me) return;
    
    // Draw extended incisor line (i to LIA) as dotted
    drawExtendedLine(ctx, i, LIA, scale, '#FFFF00', 2, [5, 5]);
    
    // Draw extended mandibular plane line (Go to Me) as dotted
    drawExtendedLine(ctx, Go, Me, scale, '#FFFF00', 2, [5, 5]);
    
    // Find intersection point of the two lines
    const intersectionPoint = findLineIntersection(i, LIA, Go, Me);
    
    // Draw angle arc at the intersection point if it exists
    if (intersectionPoint) {
      drawAngleArc(ctx, LIA, intersectionPoint, Go, scale, '#00FF00');
    }
  },
  "N-Me": (ctx, landmarks, scale) => {
    const { N, Me } = landmarks;
    if (!N || !Me) return;
    drawLine(ctx, N, Me, scale, '#E8B4B8', 2);
    drawMeasurementLine(ctx, N, Me, scale);
  },
  "I/i": (ctx, landmarks, scale) => {
    const I = landmarks.I || landmarks.UIT;
    const UIA = landmarks.UIA;
    const i = landmarks.i || landmarks.LIT;
    const LIA = landmarks.LIA;
    if (!I || !UIA || !i || !LIA) return;
    
    // Draw extended upper incisor line (I to UIA) as dotted
    drawExtendedLine(ctx, I, UIA, scale, '#FFFF00', 2, [5, 5]);
    
    // Draw extended lower incisor line (i to LIA) as dotted
    drawExtendedLine(ctx, i, LIA, scale, '#FFFF00', 2, [5, 5]);
    
    // Find intersection point of the two incisor lines
    const intersectionPoint = findLineIntersection(I, UIA, i, LIA);
    
    // Draw angle arc at the intersection point if it exists
    if (intersectionPoint) {
      drawAngleArc(ctx, UIA, intersectionPoint, LIA, scale, '#00FF00');
    }
  },
  "Li-E": (ctx, landmarks, scale) => {
    const { Li, Pn, "Pog`": Pog_soft } = landmarks;
    if (!Li || !Pn || !Pog_soft) return;
    
    // Draw E-line (Pn to Pog') as extended dotted yellow line
    drawExtendedLine(ctx, Pn, Pog_soft, scale, '#FFFF00', 2, [5, 5]);
    
    // Draw perpendicular from Li to E-line as solid green
    drawPerpendicularLine(ctx, Li, Pn, Pog_soft, scale, '#00FF00', false);
  },
  "Ls-E": (ctx, landmarks, scale) => {
    const { Ls, Pn, "Pog`": Pog_soft } = landmarks;
    if (!Ls || !Pn || !Pog_soft) return;
    
    // Draw E-line (Pn to Pog') as extended dotted yellow line
    drawExtendedLine(ctx, Pn, Pog_soft, scale, '#FFFF00', 2, [5, 5]);
    
    // Draw perpendicular from Ls to E-line as solid green
    drawPerpendicularLine(ctx, Ls, Pn, Pog_soft, scale, '#00FF00', false);
  },
  "N-Sn-Pg": (ctx, landmarks, scale) => {
    const { N, Sn, "Pog`": Pog_soft } = landmarks;
    if (!N || !Sn || !Pog_soft) return;
    
    // Yellow lines for reference, green angle arc
    drawLine(ctx, N, Sn, scale, '#FFFF00', 2);
    drawLine(ctx, Sn, Pog_soft, scale, '#FFFF00', 2);
    drawAngleArc(ctx, N, Sn, Pog_soft, scale, '#00FF00');
  },
  UL_E: (ctx, landmarks, scale) => {
    const { Ls, Pn, "Pog`": Pog_soft } = landmarks;
    if (!Ls || !Pn || !Pog_soft) return;
    drawLine(ctx, Pn, Pog_soft, scale, '#06FFA5', 2);
    drawPerpendicularLine(ctx, Ls, Pn, Pog_soft, scale, '#06D6A0');
  },
  LL_E: (ctx, landmarks, scale) => {
    const { Li, Pn, "Pog`": Pog_soft } = landmarks;
    if (!Li || !Pn || !Pog_soft) return;
    drawLine(ctx, Pn, Pog_soft, scale, '#EF476F', 2);
    drawPerpendicularLine(ctx, Li, Pn, Pog_soft, scale, '#F78C6B');
  }
};
