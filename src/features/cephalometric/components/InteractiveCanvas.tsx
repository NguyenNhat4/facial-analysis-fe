import React, { useEffect, useRef, useState } from "react";
import { useCephStore } from "../stores/ceph-store";
import { drawMeasurementGuides } from "../utils/canvas-drawing";
import { MEASUREMENTS_CONFIG } from "../../../core/diagnostic/measurements-config";
import { useZoomPan } from "../hooks/useZoomPan";
import { cn } from "../../../lib/utils";

export function InteractiveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);

  const loadedImageSrc = useCephStore((state) => state.loadedImageSrc);
  const landmarksObj = useCephStore((state) => state.landmarksObj);
  const showLandmarkNames = useCephStore((state) => state.showLandmarkNames);
  const hoveredMeasurement = useCephStore((state) => state.hoveredMeasurement);
  const updateLandmark = useCephStore((state) => state.updateLandmark);

  const [scale, setScale] = useState(1);
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

  // Load image when src changes
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

  // Non-passive wheel event listener
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel]);

  // Redraw canvas
  useEffect(() => {
    drawCanvas();
  }, [loadedImage, landmarksObj, showLandmarkNames, hoveredMeasurement, draggedLandmark, hoveredLandmark, zoom, offset]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !loadedImage) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Calculate base scale to fit canvas
    const maxWidth = 800;
    const maxHeight = 900;
    const currentScale = Math.min(maxWidth / loadedImage.width, maxHeight / loadedImage.height);
    setScale(currentScale);

    // We keep the internal resolution high but display it fitting the container initially
    canvas.width = loadedImage.width * currentScale;
    canvas.height = loadedImage.height * currentScale;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();

    // Apply pan offset globally to context
    ctx.translate(offset.x, offset.y);

    // Draw image with zoom scaling applied only to the image
    ctx.save();
    ctx.scale(zoom, zoom);
    ctx.drawImage(loadedImage, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    const renderScale = currentScale * zoom;

    // Draw all landmarks
    if (landmarksObj) {
      Object.entries(landmarksObj).forEach(([symbol, pos]) => {
        drawLandmark(ctx, pos.x * renderScale, pos.y * renderScale, symbol, draggedLandmark === symbol, hoveredLandmark === symbol);
      });
    }

    // Draw measurement guide if hovering
    if (hoveredMeasurement && drawMeasurementGuides[hoveredMeasurement]) {
      if (landmarksObj) {

        // Find required landmarks for highlight from MEASUREMENTS_CONFIG
        const config = MEASUREMENTS_CONFIG[hoveredMeasurement];
        if (config) {
           config.landmarks.forEach((symbol: string) => {
             if (landmarksObj && landmarksObj[symbol]) {
               const pos = landmarksObj[symbol];
               drawLandmark(ctx, pos.x * renderScale, pos.y * renderScale, symbol, true);
             }
           });
        }
        
        // Draw guide lines
        drawMeasurementGuides[hoveredMeasurement](ctx, landmarksObj, renderScale);
      }
    }

    ctx.restore();
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
      // Dragged / Held landmark - transparent and smaller to show x-ray underneath
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(255, 69, 0, 0.8)";
      ctx.fill();

      // Subtle targeting crosshair
      ctx.strokeStyle = "rgba(255, 215, 0, 0.6)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - 15, y);
      ctx.lineTo(x + 15, y);
      ctx.moveTo(x, y - 15);
      ctx.lineTo(x, y + 15);
      ctx.stroke();

      // Draw label with subtle shadow instead of blocking box
      ctx.font = "bold 14px Arial";
      ctx.shadowColor = "black";
      ctx.shadowBlur = 4;
      ctx.fillStyle = "#FFD700";
      ctx.fillText(symbol, x + 8, y - 8);
      ctx.shadowBlur = 0; // reset
    } else if (hovered) {
      // Hovered landmark - ring focus effect
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.strokeStyle = "#FFD700";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Always show label when hovered, with semi-transparent background
      ctx.font = "bold 14px Arial";
      const textMetrics = ctx.measureText(symbol);
      const textWidth = textMetrics.width;
      const textHeight = 14;

      ctx.fillStyle = "rgba(33, 150, 243, 0.4)";
      ctx.fillRect(x + 8, y - textHeight - 3, textWidth + 6, textHeight + 6);

      ctx.fillStyle = "white";
      ctx.fillText(symbol, x + 11, y - 2);
    } else {
      // Normal landmark
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
      ctx.fill();

      // Show label if toggle is on
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
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Find if clicked near a landmark, accounting for zoom and pan
    const hitRadius = 10;
    let clickedLandmark = false;
    for (const [symbol, pos] of Object.entries(landmarksObj)) {
      // position on canvas coordinates
      const lx = (pos.x * scale * zoom) + offset.x;
      const ly = (pos.y * scale * zoom) + offset.y;

      if (Math.hypot(x - lx, y - ly) <= hitRadius) {
        setDraggedLandmark(symbol);
        canvas.setPointerCapture(e.pointerId);
        clickedLandmark = true;
        break;
      }
    }

    if (!clickedLandmark) {
      startPan(x, y);
      canvas.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !loadedImage || !landmarksObj) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isPanning) {
      updatePan(x, y);
      return;
    }

    if (!draggedLandmark) {
      // Hover effect logic
      const hitRadius = 10;
      let foundHover = false;
      for (const [symbol, pos] of Object.entries(landmarksObj)) {
        // Find if hover near a landmark, accounting for zoom and pan
        const lx = (pos.x * scale * zoom) + offset.x;
        const ly = (pos.y * scale * zoom) + offset.y;
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

    // Convert screen coordinates back to image coordinates
    const imgX = Math.max(0, Math.min(loadedImage.width, (x - offset.x) / (scale * zoom)));
    const imgY = Math.max(0, Math.min(loadedImage.height, (y - offset.y) / (scale * zoom)));

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

      {/* Zoom Controls */}
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
