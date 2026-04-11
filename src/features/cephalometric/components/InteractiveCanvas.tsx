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
  }, [loadedImage, landmarksObj, showLandmarkNames, hoveredMeasurement, draggedLandmark, hoveredLandmark]);

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

    // Draw image
    ctx.drawImage(loadedImage, 0, 0, canvas.width, canvas.height);

    // Draw all landmarks (small dots)
    if (landmarksObj) {
      Object.entries(landmarksObj).forEach(([symbol, pos]) => {
        const isHighlighted = draggedLandmark === symbol || hoveredLandmark === symbol;
        drawLandmark(ctx, pos.x * scale, pos.y * scale, symbol, isHighlighted);
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
               drawLandmark(ctx, pos.x * scale, pos.y * scale, symbol, true);
             }
           });
        }

        // Draw guide lines
        drawMeasurementGuides[hoveredMeasurement](ctx, landmarksObj, scale);
      }
    }
  };

  const drawLandmark = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    symbol: string,
    highlighted: boolean
  ) => {
    ctx.save();

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

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Find if clicked near a landmark
    const hitRadius = 10;
    for (const [symbol, pos] of Object.entries(landmarksObj)) {
      const lx = pos.x * scale;
      const ly = pos.y * scale;
      if (Math.hypot(x - lx, y - ly) <= hitRadius) {
        setDraggedLandmark(symbol);
        canvas.setPointerCapture(e.pointerId);
        break;
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !loadedImage || !landmarksObj) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (draggedLandmark) {
      // Convert canvas coordinates back to image coordinates
      const imgX = Math.max(0, Math.min(loadedImage.width, x / scale));
      const imgY = Math.max(0, Math.min(loadedImage.height, y / scale));

      updateLandmark(draggedLandmark, imgX, imgY);
    } else {
      // Handle hovering logic
      const hitRadius = 10;
      let foundHover = null;
      for (const [symbol, pos] of Object.entries(landmarksObj)) {
        const lx = pos.x * scale;
        const ly = pos.y * scale;
        if (Math.hypot(x - lx, y - ly) <= hitRadius) {
          foundHover = symbol;
          break;
        }
      }

      if (hoveredLandmark !== foundHover) {
        setHoveredLandmark(foundHover);
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (draggedLandmark) {
      if (canvasRef.current) {
        canvasRef.current.releasePointerCapture(e.pointerId);
      }
      setDraggedLandmark(null);
    }
  };

  return (
    <div className="canvas-container w-full h-[900px] bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center border-2 border-slate-700">
       <canvas
        ref={canvasRef}
        className={`max-w-full max-h-full object-contain touch-none ${hoveredLandmark || draggedLandmark ? 'cursor-pointer' : 'cursor-crosshair'}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
    </div>
  );
}
