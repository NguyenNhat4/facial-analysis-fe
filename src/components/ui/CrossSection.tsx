import * as THREE from "three";

interface CrossSectionProps {
  show: boolean;
  position: number;
  axis: "x" | "y" | "z";
}

function CrossSection({ show, position, axis }: CrossSectionProps) {
  if (!show) return null;

  const planePosition: [number, number, number] =
    axis === "x"
      ? [position, 0, 0]
      : axis === "y"
      ? [0, position, 0]
      : [0, 0, position];

  const planeRotation: [number, number, number] =
    axis === "x"
      ? [0, 0, Math.PI / 2]
      : axis === "y"
      ? [Math.PI / 2, 0, 0]
      : [0, 0, 0];

  return (
    <mesh position={planePosition} rotation={planeRotation}>
      <planeGeometry args={[200, 200]} />
      <meshBasicMaterial
        color="#00ff00"
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default CrossSection;
