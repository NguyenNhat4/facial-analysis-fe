import { useEffect, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { STLLoader } from "three/addons/loaders/STLLoader.js";
import * as THREE from "three";

interface SingleStlViewerProps {
  stlUrl: string;
  name: string;
  upperJawOffset: number;
  initialUpperJawPosition: number;
  wireframeMode?: boolean;
  xrayMode?: boolean;
}

function SingleStlViewer({
  stlUrl,
  name,
  upperJawOffset,
  initialUpperJawPosition,
  wireframeMode = false,
  xrayMode = false,
}: SingleStlViewerProps) {
  const geometry = useLoader(STLLoader, stlUrl);
  const material = new THREE.MeshStandardMaterial({
    color: "#fefefe",
    metalness: 0.0,
    roughness: 0.4,
  });

  const geometryToUse = Array.isArray(geometry) ? geometry[0] : geometry;
  const mesh = new THREE.Mesh(geometryToUse, material);
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(mesh);
    const center = box.getCenter(new THREE.Vector3());
    mesh.position.sub(center);

    if (name?.includes("upper_jaw")) {
      mesh.position.y = initialUpperJawPosition + upperJawOffset;
    }
  }, [mesh, name, upperJawOffset, initialUpperJawPosition]);

  // Update material based on viewing modes
  useEffect(() => {
    if (meshRef.current) {
      const currentMaterial = meshRef.current
        .material as THREE.MeshStandardMaterial;
      currentMaterial.wireframe = wireframeMode;
      currentMaterial.transparent = xrayMode;
      currentMaterial.opacity = xrayMode ? 0.3 : 1.0;
      currentMaterial.color.setHex(xrayMode ? 0x00ff00 : 0xfefefe);
    }
  }, [wireframeMode, xrayMode]);

  return <primitive ref={meshRef} object={mesh} />;
}

export default SingleStlViewer;
