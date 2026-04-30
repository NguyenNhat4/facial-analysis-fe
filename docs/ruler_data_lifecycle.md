# Cephalometric Ruler Data Lifecycle

This document describes the flow of data and the lifecycle of the dynamic scaling ruler feature implemented in the `ui-tooth-ai` project.

## 1. Global State Architecture (`ceph-store.ts`)
The core source of truth for the ruler is maintained in the global Zustand store (`useCephStore`). The state consists of:
- `rulerVisible` (boolean): Controls rendering visibility on the canvas.
- `rulerLengthMm` (number): The physical representation of the ruler's length (default 10mm). Editable by the user via the UI.
- `rulerStart` & `rulerEnd` (`Point`): The anchor points of the ruler in the *original image's coordinate space*.
- `pixelsPerMm` (number): The active calibration ratio used by the measurement algorithms.

## 2. Initial Setup and Anchor Positioning
When an image is processed by the AI backend (or JSON data is loaded), the `setLandmarksData` action is triggered. 
To minimize user effort:
1. The store inspects the incoming landmarks for the **Porion (`Po`)** point.
2. If `Po` exists, the ruler's `rulerStart` is automatically placed exactly on the `Po` coordinate.
3. `rulerEnd` is placed 100 pixels directly below `Po` (at `y + 100`).
4. `pixelsPerMm` is initialized as `100 / rulerLengthMm`.
If `Po` is missing or a new image is loaded without landmarks, the ruler defaults safely to the top-left corner `(50, 50)`.

## 3. UI Interactions & Event Capturing (`InteractiveCanvas.tsx`)
The canvas captures mouse/touch interactions to manipulate the ruler:
- **Toggle & Input Field:** The user toggles `rulerVisible` and can adjust the `rulerLengthMm` value. Updating the value immediately triggers a recalculation of `pixelsPerMm`.
- **Pointer Down (`handlePointerDown`):** If the ruler is visible, the canvas checks if the click falls within a 1.5x hit radius of either `rulerStart` or `rulerEnd` (projected into screen coordinates). If matched, the canvas captures the pointer and sets the `draggedRulerPoint` state ("start" or "end"), short-circuiting the normal panning and landmark-dragging logic.
- **Pointer Move (`handlePointerMove`):** As the pointer moves, screen coordinates are reverse-projected back to the original image coordinate space and pushed to the store via `updateRulerPoint`.

## 4. The Recalculation Cycle
Every time `updateRulerPoint` or `setRulerLengthMm` is fired, the data flows downward:
1. **Distance Calculation:** The store computes the pixel distance between `rulerStart` and `rulerEnd` using `Math.hypot`.
2. **Scale Factor Derivation:** `newPixelsPerMm = distanceInPixels / rulerLengthMm`. 
3. **Trigger Core Updates:** The store updates the scale factor and immediately fires `get().recalculateMeasurements()`.
4. **Diagnostic Calculations (`calculations.ts` & `measurements-config.ts`):** The new `pixelsPerMm` is injected into the measurement configuration engine. Distance-based metrics (like `N-Me`, `I-NA`, `i-NB`) recalculate their values by taking their pixel distances and dividing them by the newly provided `pixelsPerMm`.

## 5. Rendering
Finally, the updated values flow back up to the UI. The React component re-renders:
- The canvas updates the cyan physical line drawn between `rulerStart` and `rulerEnd` and displays the dynamically updating label (e.g., `15 mm`).
- The right-hand analysis panel re-renders the Cephalometric analysis table, instantly reflecting the precisely calibrated millimeter values.
