import React, { useEffect, useRef, useState } from "react";
import { useCephStore } from "../stores/ceph-store";
import { drawMeasurementGuides } from "../utils/canvas-drawing";
import { MEASUREMENTS_CONFIG } from "../../../core/diagnostic/measurements-config";

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

  // Zoom and Pan state
  const [zoomScale, setZoomScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const lastPanPoint = useRef({ x: 0, y: 0 });

  // Expose zoom controls to parent or use inside if needed
  // For now we will add a UI control overlay directly inside this component to meet the requirement.

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

  // Redraw canvas
  useEffect(() => {
    drawCanvas();
  }, [loadedImage, landmarksObj, showLandmarkNames, hoveredMeasurement, draggedLandmark, hoveredLandmark, zoomScale, panOffset]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !loadedImage) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Calculate scale to fit canvas
    const maxWidth = 800;
    const maxHeight = 900;
    const currentScale = Math.min(maxWidth / loadedImage.width, maxHeight / loadedImage.height);
    setScale(currentScale);

    const scale = currentScale;

    canvas.width = loadedImage.width * scale;
    canvas.height = loadedImage.height * scale;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context state before applying transformations
    ctx.save();

    // Apply pan and zoom
    ctx.translate(panOffset.x, panOffset.y);
    ctx.scale(zoomScale, zoomScale);

    // Draw image
    ctx.drawImage(loadedImage, 0, 0, canvas.width, canvas.height);

    // Draw all landmarks (small dots)
    if (landmarksObj) {
      Object.entries(landmarksObj).forEach(([symbol, pos]) => {
        // We pass the unscaled canvas coordinates, the ctx is scaled,
        // but we want the landmarks to stay small regardless of zoom.
        // Actually, let's let context scale them, or draw them inverse-scaled.
        // To keep the landmark size consistent regardless of zoom:
        drawLandmark(
          ctx,
          pos.x * scale,
          pos.y * scale,
          symbol,
          draggedLandmark === symbol,
          hoveredLandmark === symbol,
          zoomScale
        );
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
               drawLandmark(ctx, pos.x * scale, pos.y * scale, symbol, true, false, zoomScale);
             }
           });
        }

        // Draw guide lines (need to be aware of scale if they draw text or fixed-width lines)
        ctx.save();
        ctx.lineWidth = 1 / zoomScale; // keep lines thin
        drawMeasurementGuides[hoveredMeasurement](ctx, landmarksObj, scale);
        ctx.restore();
      }
    }

    // Restore context
    ctx.restore();
  };

  const drawLandmark = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    symbol: string,
    highlighted: boolean,
    hovered: boolean = false,
    currentZoom: number = 1
  ) => {
    ctx.save();

    // Reverse the scale for this specific drawing so the size remains constant
    ctx.translate(x, y);
    ctx.scale(1 / currentZoom, 1 / currentZoom);
    ctx.translate(-x, -y);

    if (highlighted) {
      // Highlighted landmark
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fillStyle = "#FFD700";
      ctx.fill();
      ctx.strokeStyle = "#FF4500";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw label with background
      ctx.font = "bold 16px Arial";
      const textMetrics = ctx.measureText(symbol);
      const textWidth = textMetrics.width;
      const textHeight = 16;

      ctx.fillStyle = "rgba(255, 69, 0, 0.9)";
      ctx.fillRect(x + 12, y - textHeight - 4, textWidth + 8, textHeight + 8);

      ctx.fillStyle = "white";
      ctx.fillText(symbol, x + 16, y - 2);
    } else if (hovered) {
      // Hovered landmark
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = "#FFD700";
      ctx.fill();
      ctx.strokeStyle = "#FF4500";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Always show label when hovered
      ctx.font = "bold 14px Arial";
      const textMetrics = ctx.measureText(symbol);
      const textWidth = textMetrics.width;
      const textHeight = 14;

      ctx.fillStyle = "rgba(33, 150, 243, 0.9)";
      ctx.fillRect(x + 10, y - textHeight - 3, textWidth + 6, textHeight + 6);

      ctx.fillStyle = "white";
      ctx.fillText(symbol, x + 13, y - 2);
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

  const getTransformedCoordinates = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Apply inverse transform
    const transformedX = (x - panOffset.x) / zoomScale;
    const transformedY = (y - panOffset.y) / zoomScale;

    return { x: transformedX, y: transformedY };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !landmarksObj) return;
    const canvas = canvasRef.current;

    // Get transformed coordinates relative to the original unzoomed canvas
    const { x: tX, y: tY } = getTransformedCoordinates(e.clientX, e.clientY);

    // Find if clicked near a landmark
    const hitRadius = 10 / zoomScale; // Adjust hit radius based on zoom
    let foundLandmark = false;
    for (const [symbol, pos] of Object.entries(landmarksObj)) {
      const lx = pos.x * scale;
      const ly = pos.y * scale;
      if (Math.hypot(tX - lx, tY - ly) <= hitRadius) {
        setDraggedLandmark(symbol);
        foundLandmark = true;
        canvas.setPointerCapture(e.pointerId);
        break;
      }
    }

    if (!foundLandmark) {
      // Start panning
      setIsPanning(true);
      lastPanPoint.current = { x: e.clientX, y: e.clientY };
      canvas.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !loadedImage || !landmarksObj) return;

    if (isPanning) {
      const dx = e.clientX - lastPanPoint.current.x;
      const dy = e.clientY - lastPanPoint.current.y;

      setPanOffset(prev => ({
        x: prev.x + dx,
        y: prev.y + dy
      }));

      lastPanPoint.current = { x: e.clientX, y: e.clientY };
      return;
    }

    const { x: tX, y: tY } = getTransformedCoordinates(e.clientX, e.clientY);

    if (!draggedLandmark) {
      // Hover effect logic
      const hitRadius = 10 / zoomScale;
      let foundHover = false;
      for (const [symbol, pos] of Object.entries(landmarksObj)) {
        const lx = pos.x * scale;
        const ly = pos.y * scale;
        if (Math.hypot(tX - lx, tY - ly) <= hitRadius) {
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

    // Convert canvas coordinates back to image coordinates
    const imgX = Math.max(0, Math.min(loadedImage.width, tX / scale));
    const imgY = Math.max(0, Math.min(loadedImage.height, tY / scale));

    updateLandmark(draggedLandmark, imgX, imgY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (draggedLandmark || isPanning) {
      if (canvasRef.current) {
        canvasRef.current.releasePointerCapture(e.pointerId);
      }
      setDraggedLandmark(null);
      setIsPanning(false);
    }
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setHoveredLandmark(null);
    if (isPanning || draggedLandmark) {
        handlePointerUp(e);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent page scroll

    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const zoomSensitivity = 0.001;
    const delta = -e.deltaY * zoomSensitivity;
    let newScale = zoomScale * Math.exp(delta);

    // Clamp zoom scale
    newScale = Math.max(1, Math.min(newScale, 10));

    // Calculate new pan offset to keep mouse position fixed
    const scaleRatio = newScale / zoomScale;

    const newPanX = x - (x - panOffset.x) * scaleRatio;
    const newPanY = y - (y - panOffset.y) * scaleRatio;

    // Optional: if zoomed all the way out, reset pan
    if (newScale === 1) {
        setPanOffset({ x: 0, y: 0 });
    } else {
        setPanOffset({ x: newPanX, y: newPanY });
    }

    setZoomScale(newScale);
  };

  const handleZoomIn = () => {
    setZoomScale(prev => Math.min(prev * 1.2, 10));
  };

  const handleZoomOut = () => {
    setZoomScale(prev => {
        const newScale = Math.max(prev / 1.2, 1);
        if (newScale === 1) {
            setPanOffset({ x: 0, y: 0 });
        }
        return newScale;
    });
  };

  const handleResetZoom = () => {
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full h-[900px] bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center border-2 border-slate-700">
      {/* Zoom Controls Overlay */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10 bg-black/50 p-2 rounded-lg">
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded cursor-pointer transition-colors"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={handleResetZoom}
          className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded cursor-pointer transition-colors text-xs font-bold"
          title="Reset Zoom"
        >
          1x
        </button>
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded cursor-pointer transition-colors"
          title="Zoom Out"
        >
          -
        </button>
      </div>

       <canvas
        ref={canvasRef}
        className={`max-w-full max-h-full object-contain touch-none ${isPanning ? 'cursor-grab active:cursor-grabbing' : 'cursor-crosshair'}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onWheel={handleWheel}
      />
    </div>
  );
}
