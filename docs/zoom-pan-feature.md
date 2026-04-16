# Understanding the Zoom and Pan Feature in React

This document explains the zoom and pan functionality added to the `InteractiveCanvas` component in our application. It's written with React beginners in mind, breaking down the concepts and code used to achieve this interactive behavior.

## Core Concepts

To make an image zoomable and draggable (pannable) inside a canvas, we need to keep track of two main things:
1.  **Zoom Scale:** How much the image is magnified (e.g., `1` is normal size, `2` is twice as large).
2.  **Pan Offset:** How far the image has been dragged from its original position (an `X` and `Y` distance).

In React, when data changes and needs to update the user interface (re-render the component), we use **State**.

## 1. State Management (`useState` and `useRef`)

We use React hooks to manage the data for zooming and panning:

```typescript
// State for Zoom and Pan
const [zoomScale, setZoomScale] = useState(1);
const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
const [isPanning, setIsPanning] = useState(false);
```

*   **`useState`**: This hook tells React, "Hey, keep track of this value. If it changes, re-draw the component so the user sees the update." We use it for `zoomScale` and `panOffset` because changing them means the canvas needs to be redrawn immediately.
*   **`isPanning`**: A boolean (true/false) state that tells us if the user is currently holding down the mouse button and dragging the background.

```typescript
// Ref for tracking the last mouse position during a pan
const lastPanPoint = useRef({ x: 0, y: 0 });
```

*   **`useRef`**: This hook is like a "box" that holds a value. Unlike `useState`, changing a `useRef` value **does not** cause the component to re-render. We use it for `lastPanPoint` to remember exactly where the mouse was *just a moment ago* while dragging, so we can calculate how far it moved. If we used `useState` for this, React would try to re-render the canvas for every single pixel the mouse moved, making the application slow and choppy.

## 2. Drawing on the Canvas

The HTML5 `<canvas>` element allows us to draw graphics using JavaScript. When the state changes (like when `zoomScale` changes), React triggers our `useEffect` hook, which calls `drawCanvas()`.

Here is the magic part where we apply the zoom and pan:

```typescript
// Inside drawCanvas()

// 1. Save the current state of the canvas context
ctx.save();

// 2. Move the origin (0,0) of the canvas by the pan offset
ctx.translate(panOffset.x, panOffset.y);

// 3. Scale everything drawn after this point by the zoom scale
ctx.scale(zoomScale, zoomScale);

// 4. Draw the image
ctx.drawImage(loadedImage, 0, 0, canvas.width, canvas.height);

// ... (draw landmarks) ...

// 5. Restore the canvas context to its original state
ctx.restore();
```

*   **`ctx.save()` and `ctx.restore()`**: Think of the canvas context (`ctx`) like a pen. `ctx.translate` moves the pen, and `ctx.scale` makes the pen draw thicker/larger. If we don't save the state before changing it and restore it afterward, every time we redraw, the pen would get moved *again* and scaled *again*, causing the image to fly off the screen.

### Keeping Landmarks the Same Size

A tricky problem is that if we scale the canvas by `2x`, a small 5-pixel dot (a landmark) will become a 10-pixel dot. We want the image to zoom, but we want the clickable dots to stay the same size so they don't cover the image.

To fix this, in our `drawLandmark` function, we do a "reverse scale":

```typescript
// Inside drawLandmark()

ctx.save();
// Move to where the landmark should be drawn
ctx.translate(x, y);
// Reverse the main zoom scale! (e.g., if zoomed 2x, scale by 0.5x here)
ctx.scale(1 / currentZoom, 1 / currentZoom);
// Move back
ctx.translate(-x, -y);

// Now draw the circle...
ctx.arc(x, y, 8, 0, 2 * Math.PI);
// ...
```

## 3. Handling Mouse Events

To make the canvas interactive, we listen to mouse events:

### A. Panning (Dragging)

*   **`onPointerDown` (`handlePointerDown`)**: When the user clicks the mouse.
    *   First, we check if they clicked on a landmark. If so, they are dragging a landmark, not panning the image.
    *   If they didn't click a landmark, we set `isPanning` to `true` and save the starting mouse position in `lastPanPoint.current`.
*   **`onPointerMove` (`handlePointerMove`)**: When the user moves the mouse.
    *   If `isPanning` is true, we calculate how far the mouse moved since the last `pointerMove` event (`dx` and `dy`).
    *   We update `panOffset` using `setPanOffset`.
    *   We update `lastPanPoint.current` to the new mouse position.
*   **`onPointerUp` (`handlePointerUp`)**: When the user releases the mouse button, we set `isPanning` to `false`.

### B. Zooming with the Mouse Wheel

*   **`onWheel` (`handleWheel`)**: When the user scrolls the mouse wheel.
    *   We read `e.deltaY` to see if they scrolled up or down.
    *   We calculate a `newScale`.
    *   **The tricky math:** We don't just want to zoom in on the top-left corner. We want to zoom in *exactly where the mouse cursor is*. To do this, we also have to adjust the `panOffset` simultaneously so that the pixel under the mouse cursor stays in the exact same place on the screen.

## 4. Coordinate Transformations

Because the image can be zoomed and moved, the `X` and `Y` coordinates of the mouse on the screen are no longer the same as the `X` and `Y` coordinates on the actual image.

If the image is zoomed in 2x, moving the mouse 100 pixels on the screen only moves 50 pixels across the actual image.

We created a helper function to translate screen coordinates to image coordinates:

```typescript
const getTransformedCoordinates = (clientX: number, clientY: number) => {
    // 1. Get mouse position relative to the top-left of the canvas element
    const rect = canvasRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // 2. Apply inverse transform: subtract the pan, then divide by the zoom
    const transformedX = (x - panOffset.x) / zoomScale;
    const transformedY = (y - panOffset.y) / zoomScale;

    return { x: transformedX, y: transformedY };
};
```

We use this function everywhere we need to know exactly what part of the image the user is pointing at, such as when clicking to select a landmark or hovering over one.

## Summary

By combining React state (`useState`), performance optimization (`useRef`), Canvas transformations (`translate`, `scale`), and careful math to map screen pixels to image pixels, we created a smooth and intuitive zoom and pan experience!