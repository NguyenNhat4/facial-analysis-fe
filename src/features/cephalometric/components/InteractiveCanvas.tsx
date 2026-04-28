import React, { useEffect, useRef, useState } from "react";
import { useCephStore } from "../stores/ceph-store";
import { drawMeasurementGuides } from "../utils/canvas-drawing";
import { MEASUREMENTS_CONFIG } from "../../../core/diagnostic/measurements-config";
import { useZoomPan } from "../hooks/useZoomPan";
import { cn } from "../../../lib/utils";

export function InteractiveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);
  const baseScaleRef = useRef(1);

  const loadedImageSrc = useCephStore((state) => state.loadedImageSrc);
  const landmarksObj = useCephStore((state) => state.landmarksObj);
  const showLandmarkNames = useCephStore((state) => state.showLandmarkNames);
  const hoveredMeasurement = useCephStore((state) => state.hoveredMeasurement);
  const updateLandmark = useCephStore((state) => state.updateLandmark);

  const [draggedLandmark, setDraggedLandmark] = useState<string | null>(null);
  const [hoveredLandmark, setHoveredLandmark] = useState<string | null>(null);

  const {
    zoom,
    offset,
    isPanning,
    handleWheel,
    startPan,
    updatePan,
    endPan,
    resetZoomPan,
    stepZoomIn,
    stepZoomOut,
  } = useZoomPan();

  useEffect(() => {
    if (!loadedImageSrc) {
      setLoadedImage(null);
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setLoadedImage(img);
    };
    img.src = loadedImageSrc;
  }, [loadedImageSrc]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel]);

  useEffect(() => {
    drawCanvas();
  }, [loadedImage, landmarksObj, showLandmarkNames, hoveredMeasurement, draggedLandmark, hoveredLandmark, zoom, offset]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !loadedImage) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const maxWidth = 800;
    const maxHeight = 900;
    const currentScale = Math.min(maxWidth / loadedImage.width, maxHeight / loadedImage.height);
    baseScaleRef.current = currentScale;

    canvas.width = loadedImage.width * currentScale;
    canvas.height = loadedImage.height * currentScale;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(offset.x, offset.y);

    ctx.save();
    ctx.scale(zoom, zoom);
    ctx.drawImage(loadedImage, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    const renderScale = currentScale * zoom;

    if (landmarksObj) {
      Object.entries(landmarksObj).forEach(([symbol, pos]) => {
        drawLandmark(ctx, pos.x * renderScale, pos.y * renderScale, symbol, draggedLandmark === symbol, hoveredLandmark === symbol);
      });
    }

    if (hoveredMeasurement && drawMeasurementGuides[hoveredMeasurement]) {
      if (landmarksObj) {
        const config = MEASUREMENTS_CONFIG[hoveredMeasurement];
        if (config) {
          config.landmarks.forEach((symbol: string) => {
            if (landmarksObj[symbol]) {
              const pos = landmarksObj[symbol];
              drawLandmark(ctx, pos.x * renderScale, pos.y * renderScale, symbol, true);
            }
          });
        }

        drawMeasurementGuides[hoveredMeasurement](ctx, landmarksObj, renderScale);
      }
    }

    ctx.restore();
  };

  const getCanvasPointer = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
      hitRadius: 10 * Math.max(scaleX, scaleY),
    };
  };

  const drawLandmark = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    symbol: string,
    highlighted: boolean,
    hovered: boolean = false
  ) => {
    ctx.save();

    if (highlighted) {
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(255, 69, 0, 0.8)";
      ctx.fill();

      ctx.strokeStyle = "rgba(255, 215, 0, 0.6)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - 15, y);
      ctx.lineTo(x + 15, y);
      ctx.moveTo(x, y - 15);
      ctx.lineTo(x, y + 15);
      ctx.stroke();

      ctx.font = "bold 14px Arial";
      ctx.shadowColor = "black";
      ctx.shadowBlur = 4;
      ctx.fillStyle = "#FFD700";
      ctx.fillText(symbol, x + 8, y - 8);
      ctx.shadowBlur = 0;
    } else if (hovered) {
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.strokeStyle = "#FFD700";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = "bold 14px Arial";
      const textMetrics = ctx.measureText(symbol);
      const textWidth = textMetrics.width;
      const textHeight = 14;

      ctx.fillStyle = "rgba(33, 150, 243, 0.4)";
      ctx.fillRect(x + 8, y - textHeight - 3, textWidth + 6, textHeight + 6);

      ctx.fillStyle = "white";
      ctx.fillText(symbol, x + 11, y - 2);
    } else {
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
      ctx.fill();

      if (showLandmarkNames) {
        ctx.font = "bold 12px Arial";
        const textMetrics = ctx.measureText(symbol);
        const textWidth = textMetrics.width;
        const textHeight = 12;

        ctx.fillStyle = "rgba(33, 150, 243, 0.85)";
        ctx.fillRect(x + 8, y - textHeight - 2, textWidth + 6, textHeight + 4);

        ctx.fillStyle = "white";
        ctx.fillText(symbol, x + 11, y - 2);
      }
    }

    ctx.restore();
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !landmarksObj) return;

    const pointer = getCanvasPointer(e.clientX, e.clientY);
    if (!pointer) return;

    const { x, y, hitRadius } = pointer;
    const imageScale = baseScaleRef.current * zoom;

    let clickedLandmark = false;
    for (const [symbol, pos] of Object.entries(landmarksObj)) {
      const lx = pos.x * imageScale + offset.x;
      const ly = pos.y * imageScale + offset.y;

      if (Math.hypot(x - lx, y - ly) <= hitRadius) {
        setDraggedLandmark(symbol);
        canvasRef.current.setPointerCapture(e.pointerId);
        clickedLandmark = true;
        break;
      }
    }

    if (!clickedLandmark) {
      startPan(x, y);
      canvasRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !loadedImage || !landmarksObj) return;

    const pointer = getCanvasPointer(e.clientX, e.clientY);
    if (!pointer) return;

    const { x, y, hitRadius } = pointer;

    if (isPanning) {
      updatePan(x, y);
      return;
    }

    const imageScale = baseScaleRef.current * zoom;

    if (!draggedLandmark) {
      let foundHover = false;
      for (const [symbol, pos] of Object.entries(landmarksObj)) {
        const lx = pos.x * imageScale + offset.x;
        const ly = pos.y * imageScale + offset.y;

        if (Math.hypot(x - lx, y - ly) <= hitRadius) {
          if (hoveredLandmark !== symbol) {
            setHoveredLandmark(symbol);
          }
          foundHover = true;
          break;
        }
      }

      if (!foundHover && hoveredLandmark !== null) {
        setHoveredLandmark(null);
      }
      return;
    }

    if (imageScale <= 0) return;

    const imgX = Math.max(0, Math.min(loadedImage.width, (x - offset.x) / imageScale));
    const imgY = Math.max(0, Math.min(loadedImage.height, (y - offset.y) / imageScale));

    updateLandmark(draggedLandmark, imgX, imgY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (canvasRef.current) {
      canvasRef.current.releasePointerCapture(e.pointerId);
    }
    if (draggedLandmark) {
      setDraggedLandmark(null);
    }
    if (isPanning) {
      endPan();
    }
  };

  const handlePointerLeave = () => {
    setHoveredLandmark(null);
    if (isPanning) {
      endPan();
    }
  };

  return (
    <div className="canvas-container relative w-full h-[900px] bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center border-2 border-slate-700">
      <canvas
        ref={canvasRef}
        className={cn(
          "max-w-full max-h-full cursor-crosshair touch-none",
          isPanning ? "cursor-grabbing" : ""
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerLeave}
      />

      <div className="absolute top-4 right-4 flex flex-col gap-2 bg-slate-800/80 p-2 rounded-lg backdrop-blur-sm border border-slate-700">
        <button
          onClick={stepZoomIn}
          className="w-8 h-8 flex items-center justify-center bg-slate-700 hover:bg-slate-600 text-white rounded cursor-pointer transition-colors"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={stepZoomOut}
          className="w-8 h-8 flex items-center justify-center bg-slate-700 hover:bg-slate-600 text-white rounded cursor-pointer transition-colors"
          title="Zoom Out"
        >
          -
        </button>
        <button
          onClick={resetZoomPan}
          className="w-8 h-8 flex items-center justify-center bg-slate-700 hover:bg-slate-600 text-white rounded cursor-pointer transition-colors text-xs"
          title="Reset Zoom"
        >
          1x
        </button>
      </div>
    </div>
  );
}
