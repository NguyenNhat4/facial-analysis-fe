import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import AdvancedLighting from "./AdvancedLighting";
import SingleObjViewer from "./SingleObjViewer";
import SingleStlViewer from "./SingleStlViewer";
import ToothNumberLabels from "./ToothNumberLabels";
import ToothSegmentBoxes from "./ToothSegmentBoxes";
import ToothAxisArrows from "./ToothAxisArrows";
import CrossSection from "./CrossSection";
import { toothData } from "../../data/toothData";

interface Scene3DProps {
  isAnyLoading: boolean;
  models: any[];
  lightingIntensity: number;
  cameraControlsRef: React.RefObject<any>;
  upperJawOffset: number;
  initialUpperJawPosition: number;
  wireframeMode: boolean;
  xrayMode: boolean;
  showLabels: boolean;
  showSegments: boolean;
  visibleCount: number;
  selectedTooth: number | null;
  setSelectedTooth: (tooth: number | null) => void;
  showAxes: boolean;
  showCrossSection: boolean;
  crossSectionPosition: number;
  crossSectionAxis: "x" | "y" | "z";
}

export default function Scene3D({
  isAnyLoading,
  models,
  lightingIntensity,
  cameraControlsRef,
  upperJawOffset,
  initialUpperJawPosition,
  wireframeMode,
  xrayMode,
  showLabels,
  showSegments,
  visibleCount,
  selectedTooth,
  setSelectedTooth,
  showAxes,
  showCrossSection,
  crossSectionPosition,
  crossSectionAxis,
}: Scene3DProps) {
  return (
    <Canvas
      style={{
        width: "100vw",
        height: "100vh",
        background:
          "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%)",
      }}
      camera={{ position: [0, 0, 80], fov: 70 }}
      shadows
    >
      <AdvancedLighting intensity={lightingIntensity} />
      <OrbitControls ref={cameraControlsRef} />

      {!isAnyLoading &&
        models.map((model) =>
          model.type === "obj" && model.objUrl ? (
            <SingleObjViewer
              key={model.key}
              objUrl={model.objUrl}
              mtlUrl={model.mtlUrl}
              name={model.name}
              upperJawOffset={upperJawOffset}
              initialUpperJawPosition={initialUpperJawPosition}
            />
          ) : model.type === "stl" && model.stlUrl ? (
            <SingleStlViewer
              key={model.key}
              stlUrl={model.stlUrl}
              name={model.name}
              upperJawOffset={upperJawOffset}
              initialUpperJawPosition={10}
              wireframeMode={wireframeMode}
              xrayMode={xrayMode}
            />
          ) : null
        )}

      {!isAnyLoading && models.length > 0 && (
        <>
          <axesHelper args={[100]} />
          <gridHelper args={[200, 20]} />
          <ToothNumberLabels
            showLabels={showLabels}
            upperJawOffset={upperJawOffset}
            toothData={toothData}
          />
          {showSegments && (
            <ToothSegmentBoxes
              visibleCount={visibleCount}
              selectedTooth={selectedTooth}
              setSelectedTooth={setSelectedTooth}
              upperJawOffset={upperJawOffset}
              toothData={toothData}
            />
          )}
          {showAxes && (
            <ToothAxisArrows
              show={true}
              upperJawOffset={upperJawOffset}
              toothData={toothData}
            />
          )}
          {showCrossSection && (
            <CrossSection
              show={showCrossSection}
              position={crossSectionPosition}
              axis={crossSectionAxis}
            />
          )}
        </>
      )}
    </Canvas>
  );
}
