import React from "react";
import { useCephStore } from "../stores/ceph-store";
import { Ruler } from "lucide-react";

export function MeasurementTable() {
  const measurements = useCephStore((state) => state.measurements);
  const hoveredMeasurement = useCephStore((state) => state.hoveredMeasurement);
  const setHoveredMeasurement = useCephStore((state) => state.setHoveredMeasurement);

  const getSdColorClass = (sdValue: number) => {
    if (Math.abs(sdValue) > 1) {
      return "text-red-600";
    }
    return "text-gray-900";
  };

  return (
    <div className="table-section bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
        <Ruler className="w-6 h-6 mr-2 text-purple-600" />
        Bảng Các Chỉ Số
      </h2>
      <div className="table-container overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 font-semibold">Chỉ số</th>
              <th className="px-4 py-3 font-semibold text-center">Giá trị</th>
              <th className="px-4 py-3 font-semibold text-center">S.D.</th>
              <th className="px-4 py-3 font-semibold text-center">Giá trị hài hòa</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(measurements).map(([key, measurement]) => {
              const sdValue = (measurement.value - measurement.mean) / measurement.sd;
              const isError = measurement.classification === 'error';
              const rangeStr = `[${(measurement.mean - measurement.sd).toFixed(2)}, ${(measurement.mean + measurement.sd).toFixed(2)}]`;
              return (
              <tr
                key={key}
                className={`border-b hover:bg-blue-50 transition-colors cursor-pointer ${hoveredMeasurement === key ? "bg-blue-100" : ""}`}
                onMouseEnter={() => setHoveredMeasurement(key)}
                onMouseLeave={() => setHoveredMeasurement(null)}
              >
                <td className="px-4 py-3 font-medium text-gray-900">{measurement.name}</td>
                <td className="px-4 py-3 text-center">{isError ? '-' : measurement.value.toFixed(2)}</td>
                <td className={`px-4 py-3 text-center font-bold ${getSdColorClass(sdValue)}`}>
                  {isError ? '-' : sdValue.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center text-gray-600">
                  {isError ? '-' : rangeStr}
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
}
