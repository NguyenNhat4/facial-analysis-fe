import React, { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { MedicalFooter, MedicalHeader } from "../features/analysis";
import { patientSummaries, getPatientById } from "@/features/patient/data/patient-mocks";
import { usePatientStore } from "@/features/patient/stores/patient-store";

const PatientListPage = () => {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const { setPatientData } = usePatientStore();

  const filteredPatients = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return patientSummaries;
    return patientSummaries.filter((patient) =>
      [patient.name, patient.phone, patient.patientId]
        .join(" ")
        .toLowerCase()
        .includes(trimmed)
    );
  }, [query]);

  const handleRowClick = (patientId: string) => {
    const patient = getPatientById(patientId);
    if (patient) {
      setPatientData(patient);
    }
    setLocation(`/patients/${patientId}/upload`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <MedicalHeader onNavigation={setLocation} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900">Patient List</h1>
          </div>

          <div className="px-6 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
              type="button"
            >
              Create new patient +
            </button>

            <div className="relative w-full sm:max-w-xs">
              <input
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none"
                placeholder="Search patient"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <span className="pointer-events-none absolute right-3 top-2.5 text-gray-400">
                Search
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                <tr>
                  <th className="px-6 py-3">Full Name</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">Consultation Date</th>
                  <th className="px-6 py-3">Progress</th>
                  <th className="px-6 py-3">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPatients.map((patient) => (
                  <tr
                    key={patient.patientId}
                    className="cursor-pointer hover:bg-blue-50"
                    onClick={() => handleRowClick(patient.patientId)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">
                        {patient.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        #{patient.patientId}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{patient.phone}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {patient.consultationDate}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      Photo upload → Analysis → Treatment → Complete
                    </td>
                    <td className="px-6 py-4 text-gray-600">{patient.note}</td>
                  </tr>
                ))}
                {filteredPatients.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No patients found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PatientListPage;
