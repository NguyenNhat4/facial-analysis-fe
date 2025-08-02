// Component imports
import LoadingOverlay from "./ui/LoadingOverlay";
import HeaderBar from "./ui/HeaderBar";
import ControlPanel from "./ui/ControlPanel";
import Scene3D from "./ui/Scene3D";

// Hook imports
import { use3DViewer } from "../hooks/use3DViewer";

export default function ThreeDViewer() {
  const {
    // State
    models,
    loading,
    showLabels,
    showSegments,
    showAxes,
    visibleCount,
    selectedTooth,
    isProcessing,
    axesLoading,
    upperJawOffset,
    initialUpperJawPosition,
    showCrossSection,
    crossSectionAxis,
    crossSectionPosition,
    lightingIntensity,
    wireframeMode,
    xrayMode,
    isAnyLoading,

    // Refs
    fileInputRef,
    cameraControlsRef,

    // Handlers
    handleFileUpload,
    handleToggleLabels,
    handleToggleSegments,
    handleToggleAxes,
    handleSliderChange,
    handleCrossSection,
    handleWireframeToggle,
    handleXrayToggle,
    handleCameraPreset,
    triggerFileUpload,
    resetAllSettings,

    // Setters
    setSelectedTooth,
    setCrossSectionAxis,
    setCrossSectionPosition,
    setLightingIntensity,
  } = use3DViewer();

  return (
    <>
      <HeaderBar
        isProcessing={isProcessing}
        loading={loading}
        axesLoading={axesLoading}
        models={models}
        showLabels={showLabels}
        showSegments={showSegments}
        showAxes={showAxes}
        showCrossSection={showCrossSection}
        wireframeMode={wireframeMode}
        xrayMode={xrayMode}
        fileInputRef={fileInputRef}
        triggerFileUpload={triggerFileUpload}
        handleFileUpload={handleFileUpload}
        handleToggleLabels={handleToggleLabels}
        handleToggleSegments={handleToggleSegments}
        handleToggleAxes={handleToggleAxes}
        handleCrossSection={handleCrossSection}
        handleWireframeToggle={handleWireframeToggle}
        handleXrayToggle={handleXrayToggle}
        handleCameraPreset={handleCameraPreset}
      />

      <ControlPanel
        models={models}
        isAnyLoading={isAnyLoading}
        upperJawOffset={upperJawOffset}
        lightingIntensity={lightingIntensity}
        showCrossSection={showCrossSection}
        crossSectionAxis={crossSectionAxis}
        crossSectionPosition={crossSectionPosition}
        loading={loading}
        isProcessing={isProcessing}
        axesLoading={axesLoading}
        handleSliderChange={handleSliderChange}
        setLightingIntensity={setLightingIntensity}
        setCrossSectionAxis={setCrossSectionAxis}
        setCrossSectionPosition={setCrossSectionPosition}
        resetAllSettings={resetAllSettings}
        handleCameraPreset={handleCameraPreset}
      />

      {isAnyLoading && <LoadingOverlay />}

      <Scene3D
        isAnyLoading={isAnyLoading}
        models={models}
        lightingIntensity={lightingIntensity}
        cameraControlsRef={cameraControlsRef}
        upperJawOffset={upperJawOffset}
        initialUpperJawPosition={initialUpperJawPosition}
        wireframeMode={wireframeMode}
        xrayMode={xrayMode}
        showLabels={showLabels}
        showSegments={showSegments}
        visibleCount={visibleCount}
        selectedTooth={selectedTooth}
        setSelectedTooth={setSelectedTooth}
        showAxes={showAxes}
        showCrossSection={showCrossSection}
        crossSectionPosition={crossSectionPosition}
        crossSectionAxis={crossSectionAxis}
      />
    </>
  );
}
