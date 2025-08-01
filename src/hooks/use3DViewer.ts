import { useState, useEffect, useRef } from "react";
import { toothData, type ModelData } from "../data/toothData";

export const use3DViewer = () => {
  const [models, setModels] = useState<ModelData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showLabels, setShowLabels] = useState<boolean>(false);
  const [showSegments, setShowSegments] = useState<boolean>(false);
  const [showAxes, setShowAxes] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(0);
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [axesLoading, setAxesLoading] = useState<boolean>(false);
  const [upperJawOffset, setUpperJawOffset] = useState<number>(0);
  const [initialUpperJawPosition, setInitialUpperJawPosition] =
    useState<number>(0);

  // New 3D function states
  const [showCrossSection, setShowCrossSection] = useState<boolean>(false);
  const [crossSectionAxis, setCrossSectionAxis] = useState<"x" | "y" | "z">(
    "y"
  );
  const [crossSectionPosition, setCrossSectionPosition] = useState<number>(0);
  const [lightingIntensity, setLightingIntensity] = useState<number>(1);
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);
  const [xrayMode, setXrayMode] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraControlsRef = useRef<any>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const objFiles = files.filter((f: File) => f.name.endsWith(".obj"));
    const mtlFiles = files.filter((f: File) => f.name.endsWith(".mtl"));
    const stlFiles = files.filter((f: File) => f.name.endsWith(".stl"));

    if (objFiles.length === 0 && stlFiles.length === 0) {
      alert("Please upload at least one .obj or .stl file.");
      return;
    }

    setLoading(true);

    const objModels: ModelData[] = objFiles.map((objFile: File) => {
      const baseName = objFile.name.replace(/\.obj$/, "");
      const matchingMtl = mtlFiles.find((f: File) =>
        f.name.startsWith(baseName)
      );
      return {
        type: "obj",
        objUrl: URL.createObjectURL(objFile),
        mtlUrl: matchingMtl ? URL.createObjectURL(matchingMtl) : null,
        key: objFile.name,
        name: objFile.name.toLowerCase(),
      };
    });

    const stlModels: ModelData[] = stlFiles.map((stlFile: File) => ({
      type: "stl",
      stlUrl: URL.createObjectURL(stlFile),
      key: stlFile.name,
      name: stlFile.name.toLowerCase(),
    }));

    setTimeout(() => {
      setModels([...objModels, ...stlModels]);
      setInitialUpperJawPosition(
        objModels.some((m) => m.name.includes("upper_jaw")) ? 12 : 12.5
      );
      setUpperJawOffset(0);
      setLoading(false);
    }, 1500);
  };

  const handleToggleLabels = () => {
    if (models.length === 0 || isProcessing) return;
    setIsProcessing(true);
    setTimeout(() => {
      setShowLabels((prev) => !prev);
      setIsProcessing(false);
    }, 1000);
  };

  const handleToggleSegments = () => {
    if (models.length === 0 || isProcessing) return;

    if (showSegments) {
      setShowSegments(false);
      setVisibleCount(0);
      setSelectedTooth(null);
    } else {
      setIsProcessing(true);
      setShowSegments(true);
      setVisibleCount(0);
    }
  };

  const handleToggleAxes = () => {
    if (models.length === 0 || isProcessing || axesLoading) return;
    setAxesLoading(true);
    setTimeout(() => {
      setShowAxes((prev) => !prev);
      setAxesLoading(false);
    }, 1200);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (models.length === 0) return;
    setUpperJawOffset(parseFloat(e.target.value));
  };

  // New 3D function handlers
  const handleCrossSection = () => {
    if (models.length === 0) return;
    setShowCrossSection(!showCrossSection);
  };

  const handleWireframeToggle = () => {
    if (models.length === 0) return;
    setWireframeMode(!wireframeMode);
  };

  const handleXrayToggle = () => {
    if (models.length === 0) return;
    setXrayMode(!xrayMode);
  };

  const handleCameraPreset = (preset: string) => {
    if (models.length === 0 || !cameraControlsRef.current) return;
    const camera = cameraControlsRef.current.object;
    switch (preset) {
      case "front":
        camera.position.set(0, 0, 80);
        break;
      case "side":
        camera.position.set(80, 0, 0);
        break;
      case "top":
        camera.position.set(0, 80, 0);
        break;
      case "occlusal":
        camera.position.set(0, 40, 40);
        break;
    }
    camera.lookAt(0, 0, 0);
    cameraControlsRef.current.update();
  };

  const triggerFileUpload = () => {
    if (!loading && !isProcessing && !axesLoading) {
      fileInputRef.current?.click();
    }
  };

  const resetAllSettings = () => {
    setUpperJawOffset(0);
    setLightingIntensity(1);
    setCrossSectionPosition(0);
  };

  useEffect(() => {
    let interval: number | undefined;
    if (showSegments && !loading) {
      interval = setInterval(() => {
        setVisibleCount((count) => {
          if (count < toothData.length) {
            return count + 2;
          } else {
            setIsProcessing(false);
            if (interval) clearInterval(interval);
            return count;
          }
        });
      }, 300);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showSegments, loading]);

  useEffect(() => {
    if (!showSegments) setIsProcessing(false);
  }, [showSegments]);

  const isAnyLoading = loading || axesLoading;

  return {
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
  };
};
