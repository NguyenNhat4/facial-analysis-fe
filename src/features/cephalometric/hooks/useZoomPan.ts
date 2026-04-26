import { useState, useCallback } from 'react';

export interface Point {
  x: number;
  y: number;
}

const MIN_ZOOM = 1.0;
const MAX_ZOOM = 10.0;
const ZOOM_SENSITIVITY = 0.002;

const getCanvasCoordinates = (
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number
): Point | null => {
  const rect = canvas.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return null;

  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
  };
};

export function useZoomPan() {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState<Point | null>(null);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();

      const canvas = e.currentTarget as HTMLCanvasElement;
      const cursor = getCanvasCoordinates(canvas, e.clientX, e.clientY);
      if (!cursor) return;

      const cursorX = cursor.x;
      const cursorY = cursor.y;

      const zoomDelta = -e.deltaY * ZOOM_SENSITIVITY;
      const newZoom = Math.min(Math.max(MIN_ZOOM, zoom * (1 + zoomDelta)), MAX_ZOOM);

      if (newZoom === zoom) return;

      const scaleRatio = newZoom / zoom;
      const newOffsetX = cursorX - (cursorX - offset.x) * scaleRatio;
      const newOffsetY = cursorY - (cursorY - offset.y) * scaleRatio;

      setZoom(newZoom);
      setOffset({ x: newOffsetX, y: newOffsetY });
    },
    [zoom, offset]
  );

  const startPan = useCallback((x: number, y: number) => {
    setIsPanning(true);
    setLastPanPoint({ x, y });
  }, []);

  const updatePan = useCallback(
    (x: number, y: number) => {
      if (!isPanning || !lastPanPoint) return;

      const dx = x - lastPanPoint.x;
      const dy = y - lastPanPoint.y;

      setOffset((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));
      setLastPanPoint({ x, y });
    },
    [isPanning, lastPanPoint]
  );

  const endPan = useCallback(() => {
    setIsPanning(false);
    setLastPanPoint(null);
  }, []);

  const resetZoomPan = useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setIsPanning(false);
    setLastPanPoint(null);
  }, []);

  const stepZoomIn = useCallback(() => {
    setZoom((z) => {
      const newZoom = Math.min(z * 1.2, MAX_ZOOM);
      const ratio = newZoom / z;
      setOffset((prev) => ({
        x: prev.x * ratio,
        y: prev.y * ratio,
      }));
      return newZoom;
    });
  }, []);

  const stepZoomOut = useCallback(() => {
    setZoom((z) => {
      const newZoom = Math.max(z / 1.2, MIN_ZOOM);
      if (newZoom === MIN_ZOOM) {
        setOffset({ x: 0, y: 0 });
      } else {
        const ratio = newZoom / z;
        setOffset((prev) => ({
          x: prev.x * ratio,
          y: prev.y * ratio,
        }));
      }
      return newZoom;
    });
  }, []);

  return {
    zoom,
    offset,
    isPanning,
    setZoom,
    setOffset,
    handleWheel,
    startPan,
    updatePan,
    endPan,
    resetZoomPan,
    stepZoomIn,
    stepZoomOut,
  };
}
