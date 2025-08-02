import * as THREE from "three";

interface ToothData {
  label: string;
  position: [number, number, number];
  jaw: "upper" | "lower";
}

interface ToothAxisArrowsProps {
  show: boolean;
  upperJawOffset: number;
  toothData: ToothData[];
}

function ToothAxisArrows({
  show,
  upperJawOffset,
  toothData,
}: ToothAxisArrowsProps) {
  if (!show) return null;

  return (
    <>
      {toothData.map((tooth, i) => {
        // Calculate base position with upper jaw offset applied
        const basePos = [...tooth.position];
        if (tooth.jaw === "upper") {
          basePos[1] += upperJawOffset;
        }

        const base = new THREE.Vector3(...basePos);
        const len = 4;
        const headLen = 1;
        const headWidth = 0.8;

        return (
          <group key={`axis-${i}`}>
            <arrowHelper
              args={[
                new THREE.Vector3(1, 0, 0),
                base,
                len,
                "#ff0000",
                headLen,
                headWidth,
              ]}
            />
            <arrowHelper
              args={[
                new THREE.Vector3(0, 1, 0),
                base,
                len,
                "#00ff00",
                headLen,
                headWidth,
              ]}
            />
            <arrowHelper
              args={[
                new THREE.Vector3(0, 0, 1),
                base,
                len,
                "#0000ff",
                headLen,
                headWidth,
              ]}
            />
          </group>
        );
      })}
    </>
  );
}

export default ToothAxisArrows;
