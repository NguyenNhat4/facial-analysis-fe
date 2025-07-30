import { useState, useRef } from "react";

interface XrayComparisonProps {
  image1Src: string;
  image2Src: string;
}

interface ZoomState {
  scale: number;
  x: number;
  y: number;
}

export function XrayComparisonComponent({
  image1Src,
  image2Src,
}: XrayComparisonProps) {
  const [zoom, setZoom] = useState<ZoomState>({ scale: 1, x: 0, y: 0 });
  const image1Ref = useRef<HTMLImageElement>(null);
  const image2Ref = useRef<HTMLImageElement>(null);

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const zoomSpeed = 0.1;
    setZoom((prev) => {
      const newScale = Math.max(1, prev.scale - event.deltaY * zoomSpeed);
      return { ...prev, scale: newScale };
    });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.buttons === 1) {
      setZoom((prev) => ({
        ...prev,
        x: prev.x + event.movementX,
        y: prev.y + event.movementY,
      }));
    }
  };

  const renderImage = (
    src: string,
    imageRef: React.RefObject<HTMLImageElement>
  ) => (
    <div
      className="relative w-full h-[400px] bg-clinical-900 rounded-lg overflow-hidden"
      onWheel={handleWheel}
      onMouseMove={handleMouseMove}
    >
      <img
        ref={imageRef}
        src={src}
        alt="Panoramic X-ray"
        className="w-full h-full object-contain opacity-90"
        style={{
          transform: `scale(${zoom.scale}) translate(${zoom.x}px, ${zoom.y}px)`,
          transition: "transform 0.1s",
        }}
      />
    </div>
  );

  return (
    <div>
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-clinical-900">
          So sánh X-quang Panoramic
        </h3>
        <p className="text-clinical-600 mt-2">So sánh hai ảnh X-quang</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderImage(image1Src, image1Ref)}
        {renderImage(image2Src, image2Ref)}
      </div>
    </div>
  );
}
