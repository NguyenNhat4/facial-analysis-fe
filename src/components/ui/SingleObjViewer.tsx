import { useEffect, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import * as THREE from "three";

interface SingleObjViewerProps {
  objUrl: string;
  mtlUrl?: string | null;
  name: string;
  upperJawOffset: number;
  initialUpperJawPosition: number;
}

function SingleObjViewer({
  objUrl,
  mtlUrl,
  name,
  upperJawOffset,
  initialUpperJawPosition,
}: SingleObjViewerProps) {
  const materials = mtlUrl ? useLoader(MTLLoader, mtlUrl) : null;
  const obj = useLoader(OBJLoader, objUrl, (loader) => {
    if (materials && !Array.isArray(materials)) {
      materials.preload();
      loader.setMaterials(materials);
    }
  });
  const objRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (Array.isArray(obj)) return;

    const box = new THREE.Box3().setFromObject(obj);
    const center = box.getCenter(new THREE.Vector3());
    obj.position.sub(center);

    if (name?.includes("upper_jaw")) {
      obj.position.y = initialUpperJawPosition + upperJawOffset;
    }
  }, [obj, name, upperJawOffset, initialUpperJawPosition]);

  return <primitive ref={objRef} object={obj} />;
}

export default SingleObjViewer;
