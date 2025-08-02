import { Text } from "@react-three/drei";

interface ToothData {
  label: string;
  position: [number, number, number];
  jaw: "upper" | "lower";
}

interface ToothNumberLabelsProps {
  showLabels: boolean;
  upperJawOffset: number;
  toothData: ToothData[];
}

function ToothNumberLabels({
  showLabels,
  upperJawOffset,
  toothData,
}: ToothNumberLabelsProps) {
  return (
    <>
      {showLabels &&
        toothData.map((tooth, i) => {
          // Calculate position with upper jaw offset applied
          const position: [number, number, number] = [...tooth.position];
          if (tooth.jaw === "upper") {
            position[1] += upperJawOffset;
          }

          return (
            <Text
              key={`label-${i}`}
              position={position}
              fontSize={2.4}
              color="#dc2626"
              outlineColor="white"
              outlineWidth={0.15}
              anchorX="center"
              anchorY="middle"
            >
              {tooth.label}
            </Text>
          );
        })}
    </>
  );
}

export default ToothNumberLabels;
