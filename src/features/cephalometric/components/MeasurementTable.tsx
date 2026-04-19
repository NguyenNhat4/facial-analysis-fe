import React from "react";
import { useCephStore } from "../stores/ceph-store";
import { usePatientStore } from "../../patient/stores/patient-store";
import { Ruler } from "lucide-react";

export function MeasurementTable() {
  const measurements = useCephStore((state) => state.measurements);
  const hoveredMeasurement = useCephStore((state) => state.hoveredMeasurement);
  const setHoveredMeasurement = useCephStore((state) => state.setHoveredMeasurement);
  
  const patientSex = usePatientStore((state) => state.patientData.sex);
  const setPatientData = usePatientStore((state) => state.setPatientData);

  const getSdColorClass = (sdValue: number) => {
    if (Math.abs(sdValue) > 1) {
      return "text-red-600";
    }
    return "text-gray-900";
  };

  return (
    <div className="table-section bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center text-gray-800">
          <Ruler className="w-6 h-6 mr-2 text-purple-600" />
          Bảng Các Chỉ Số
        </h2>
        <div className="flex items-center bg-gray-100 rounded-full p-1 mt-3 sm:mt-0 shadow-sm border border-gray-200">
          <button
            onClick={() => setPatientData({ sex: "male" })}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              patientSex === "male"
                ? "bg-blue-500 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            👨 Nam
          </button>
          <button
            onClick={() => setPatientData({ sex: "female" })}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              patientSex === "female"
                ? "bg-pink-500 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            👩 Nữ
          </button>
        </div>
      </div>
      <div className="table-container overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 font-semibold">Chỉ số</th>
              <th className="px-4 py-3 font-semibold text-center">Giá trị</th>
              <th className="px-4 py-3 font-semibold text-center">Đơn vị</th>
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
                <td className="px-4 py-3 text-center text-gray-500">{isError ? '-' : measurement.unit}</td>
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
