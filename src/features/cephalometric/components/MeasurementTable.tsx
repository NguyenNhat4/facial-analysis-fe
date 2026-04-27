import React, { useMemo } from "react";
import { useCephStore } from "../stores/ceph-store";
import { usePatientStore } from "../../patient/stores/patient-store";
import { Ruler } from "lucide-react";
import { evaluatePatientDataFromMeasurements } from "../utils/evaluation-utils";

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

  const evaluationByIndexName = useMemo(() => {
    const evaluations = evaluatePatientDataFromMeasurements(measurements);
    return evaluations.reduce<Record<string, (typeof evaluations)[number]>>((accumulator, current) => {
      accumulator[current.indexName] = current;
      return accumulator;
    }, {});
  }, [measurements]);

  const getStatusLabel = (status: "LOW" | "NORMAL" | "HIGH") => {
    if (status === "LOW") return "Thấp";
    if (status === "HIGH") return "Cao";
    return "Bình thường";
  };

  const getStatusClass = (status: "LOW" | "NORMAL" | "HIGH") => {
    if (status === "LOW") {
      return "bg-orange-100 text-orange-700 border-orange-300";
    }
    if (status === "HIGH") {
      return "bg-red-100 text-red-700 border-red-300";
    }
    return "bg-emerald-100 text-emerald-700 border-emerald-300";
  };

  return (
    <div className="table-section bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center text-gray-800">
          <Ruler className="w-6 h-6 mr-2 text-purple-600" />
          Bảng phân tích 
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
              <th className="px-4w py-3 font-semibold text-center">Giá trị</th>
              <th className="px-4 py-3 font-semibold text-center">Đơn vị</th>
              <th className="px-4 py-3 font-semibold text-center">S.D.</th>
              <th className="px-4 py-3 font-semibold text-center">Giá trị hài hòa</th>
              <th className="px-4 py-3 font-semibold text-center">Trạng thái</th>
              <th className="px-4  py-3 font-semibold">Đánh giá</th>
            </tr>
          </thead>  
          <tbody>
            {Object.entries(measurements).map(([key, measurement]) => {
              const sdValue = (measurement.value - measurement.mean) / measurement.sd;
              const isError = measurement.classification === 'error';
              const rangeStr = `[${(measurement.mean - measurement.sd).toFixed(2)}, ${(measurement.mean + measurement.sd).toFixed(2)}]`;
              const evaluation = evaluationByIndexName[measurement.name];
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
                <td className="px-4 py-3 text-center">
                  {isError || !evaluation ? (
                    "-"
                  ) : (
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusClass(evaluation.status)}`}>
                      {getStatusLabel(evaluation.status)}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {isError || !evaluation ? '-' : evaluation.message}
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
}
