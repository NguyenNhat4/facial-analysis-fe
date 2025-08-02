import { Html } from "@react-three/drei";
import * as THREE from "three";

interface ToothData {
  label: string;
  position: [number, number, number];
  jaw: "upper" | "lower";
}

interface ToothSegmentBoxesProps {
  visibleCount: number;
  selectedTooth: number | null;
  setSelectedTooth: (tooth: number | null) => void;
  upperJawOffset: number;
  toothData: ToothData[];
}

function ToothSegmentBoxes({
  visibleCount,
  selectedTooth,
  setSelectedTooth,
  upperJawOffset,
  toothData,
}: ToothSegmentBoxesProps) {
  const colors = toothData.map(
    (_, i) => new THREE.Color(`hsl(${(i * 137.5) % 360}, 70%, 70%)`)
  );
  return (
    <>
      {toothData.slice(0, visibleCount).map((tooth, i) => {
        const isSelected = selectedTooth === i;

        // Calculate position with upper jaw offset applied
        const basePosition: [number, number, number] = [
          tooth.position[0],
          tooth.position[1] - 2,
          tooth.position[2] - 1.5,
        ];

        if (tooth.jaw === "upper") {
          basePosition[1] += upperJawOffset;
        }

        return (
          <mesh
            key={`seg-${i}`}
            position={basePosition}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedTooth(isSelected ? null : i);
            }}
          >
            <boxGeometry args={[6, 7, 5]} />
            <meshStandardMaterial
              color={isSelected ? "#ff0000" : colors[i]}
              opacity={0.8}
              transparent
            />
            {isSelected && (
              <Html position={[0, 5, 0]} center>
                <div
                  style={{
                    background: "linear-gradient(135deg, #ffffff, #f8fafc)",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: "1px solid rgba(203, 213, 225, 0.6)",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#1e293b",
                    boxShadow:
                      "0 8px 24px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(8px)",
                    letterSpacing: "0.025em",
                    minWidth: "80px",
                    textAlign: "center",
                  }}
                >
                  Răng {tooth.label}
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      marginTop: "4px",
                      fontWeight: "500",
                    }}
                  >
                    {tooth.jaw === "upper" ? "Hàm Trên" : "Hàm Dưới"}
                  </div>
                </div>
              </Html>
            )}
          </mesh>
        );
      })}
    </>
  );
}

export default ToothSegmentBoxes;
