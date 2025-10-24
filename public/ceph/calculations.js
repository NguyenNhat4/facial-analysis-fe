// Cephalometric Calculations Module

/**
 * Calculate angle ABC (angle at point B)
 * @param {Object} A - Point A {x, y}
 * @param {Object} B - Point B {x, y} (vertex)
 * @param {Object} C - Point C {x, y}
 * @returns {number} - Angle in degrees
 */
function calculateAngle(A, B, C) {
  // Vector BA
  const BA = { x: A.x - B.x, y: A.y - B.y };
  // Vector BC
  const BC = { x: C.x - B.x, y: C.y - B.y };

  // Calculate angle using dot product
  const dotProduct = BA.x * BC.x + BA.y * BC.y;
  const magnitudeBA = Math.sqrt(BA.x * BA.x + BA.y * BA.y);
  const magnitudeBC = Math.sqrt(BC.x * BC.x + BC.y * BC.y);

  const cosAngle = dotProduct / (magnitudeBA * magnitudeBC);
  const angleRad = Math.acos(Math.max(-1, Math.min(1, cosAngle))); // Clamp to [-1, 1]

  return angleRad * (180 / Math.PI);
}

/**
 * Calculate angle between two lines
 * Line 1: A-B, Line 2: C-D
 * @param {Object} A - Point A {x, y}
 * @param {Object} B - Point B {x, y}
 * @param {Object} C - Point C {x, y}
 * @param {Object} D - Point D {x, y}
 * @returns {number} - Angle in degrees
 */
function calculateAngleBetweenLines(A, B, C, D) {
  // Direction vector of line AB
  const v1 = { x: B.x - A.x, y: B.y - A.y };
  // Direction vector of line CD
  const v2 = { x: D.x - C.x, y: D.y - C.y };

  // Calculate angle using dot product
  const dotProduct = v1.x * v2.x + v1.y * v2.y;
  const magnitude1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
  const magnitude2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);

  const cosAngle = dotProduct / (magnitude1 * magnitude2);
  const angleRad = Math.acos(Math.max(-1, Math.min(1, cosAngle)));

  return angleRad * (180 / Math.PI);
}

/**
 * Calculate distance between two points
 * @param {Object} A - Point A {x, y}
 * @param {Object} B - Point B {x, y}
 * @returns {number} - Distance in pixels
 */
function calculateDistance(A, B) {
  const dx = B.x - A.x;
  const dy = B.y - A.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate perpendicular distance from point P to line AB
 * @param {Object} P - Point P {x, y}
 * @param {Object} A - Point A {x, y} on the line
 * @param {Object} B - Point B {x, y} on the line
 * @returns {number} - Perpendicular distance
 */
function calculatePointToLineDistance(P, A, B) {
  const lineLength = calculateDistance(A, B);
  if (lineLength === 0) return calculateDistance(P, A);

  // Using cross product to find perpendicular distance
  const numerator = Math.abs(
    (B.y - A.y) * P.x - (B.x - A.x) * P.y + B.x * A.y - B.y * A.x
  );
  return numerator / lineLength;
}

/**
 * Draw a line on canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} start - Start point {x, y}
 * @param {Object} end - End point {x, y}
 * @param {number} scale - Scale factor
 * @param {string} color - Line color
 * @param {number} width - Line width
 * @param {Array} dash - Line dash pattern
 */
function drawLine(ctx, start, end, scale, color = '#FF0000', width = 2, dash = []) {
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
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} A - Point A {x, y}
 * @param {Object} B - Point B {x, y} (vertex)
 * @param {Object} C - Point C {x, y}
 * @param {number} scale - Scale factor
 * @param {string} color - Arc color
 */
function drawAngleArc(ctx, A, B, C, scale, color = '#FF0000') {
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
 * Draw perpendicular line from point to line
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} P - Point P {x, y}
 * @param {Object} A - Point A {x, y} on the line
 * @param {Object} B - Point B {x, y} on the line
 * @param {number} scale - Scale factor
 * @param {string} color - Line color
 */
function drawPerpendicularLine(ctx, P, A, B, scale, color = '#00FF00') {
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

  drawLine(ctx, P, projection, scale, color, 2, [5, 5]);
}

/**
 * Draw measurement line with arrows
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} start - Start point {x, y}
 * @param {Object} end - End point {x, y}
 * @param {number} scale - Scale factor
 */
function drawMeasurementLine(ctx, start, end, scale) {
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
 * Convert landmarks array to object with symbol as key
 * @param {Array} landmarksArray - Array of landmarks from JSON
 * @returns {Object} - Object with symbol as key
 */
function landmarksArrayToObject(landmarksArray) {
  const obj = {};
  landmarksArray.forEach(lm => {
    obj[lm.symbol] = lm.value;
  });
  return obj;
}

/**
 * Calculate all measurements
 * @param {Object} landmarksObj - Landmarks object with symbol as key
 * @returns {Object} - Object containing all measurements
 */
function calculateAllMeasurements(landmarksObj) {
  const results = {};

  for (const [key, config] of Object.entries(MEASUREMENTS_CONFIG)) {
    try {
      const value = config.calculate(landmarksObj, results);
      const classification = getClassification(value, config.normalMean, config.normalSD);
      const significance = getSignificance(value, config.normalMean, config.normalSD);

      results[key] = {
        name: config.name,
        value: value,
        mean: config.normalMean,
        sd: config.normalSD,
        unit: config.unit,
        classification: classification,
        significance: significance,
        interpretation: config.interpretation[classification] || config.interpretation.normal
      };
    } catch (error) {
      console.error(`Error calculating ${key}:`, error);
      results[key] = {
        name: config.name,
        value: 0,
        mean: config.normalMean,
        sd: config.normalSD,
        unit: config.unit,
        classification: 'error',
        significance: '',
        interpretation: 'Error calculating'
      };
    }
  }

  return results;
}

// ===================================================================
// Expose functions to window object for use in React components
// ===================================================================
window.calculateAngle = calculateAngle;
window.calculateAngleBetweenLines = calculateAngleBetweenLines;
window.calculateDistance = calculateDistance;
window.calculatePointToLineDistance = calculatePointToLineDistance;
window.drawLine = drawLine;
window.drawAngleArc = drawAngleArc;
window.drawPerpendicularLine = drawPerpendicularLine;
window.drawMeasurementLine = drawMeasurementLine;
window.landmarksArrayToObject = landmarksArrayToObject;
window.calculateAllMeasurements = calculateAllMeasurements;
