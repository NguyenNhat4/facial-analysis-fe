import React, { useState } from "react";
import { useLocation } from "wouter";
import { MedicalHeader } from "@/components/medical-header";
import { usePatients, useSearchPatients } from "@/api/patients";
import { usePatientStore } from "@/stores/patient-store";
import { CreatePatientModal } from "@/components/create-patient-modal";
import { useDebounce } from "@/hooks/useDebounce";

const PatientListPage = () => {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { setPatientData } = usePatientStore();

  const { data: allPatients, isLoading: isLoadingAll } = usePatients();
  const { data: searchResults, isLoading: isLoadingSearch } = useSearchPatients(debouncedQuery);

  const displayedPatients = debouncedQuery ? searchResults : allPatients;
  const isLoading = debouncedQuery ? isLoadingSearch : isLoadingAll;

  const handleRowClick = (patient: any) => {
    // Map backend patient to frontend PatientData
    setPatientData({
      patientId: patient.id.toString(),
      name: patient.fullname,
      firstName: patient.fullname.split(" ")[0] || "",
      lastName: patient.fullname.split(" ").slice(1).join(" ") || "",
      phone: patient.phone,
      consultationDate: new Date(patient.consultation_date).toLocaleDateString("en-GB"),
      note: patient.notes?.[0]?.content || "",
    });
    setLocation(`/patients/${patient.id}/upload`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <MedicalHeader onNavigation={setLocation} showBackButton={false} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900">Patient List</h1>
          </div>

          <div className="px-6 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
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
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      Loading patients...
                    </td>
                  </tr>
                ) : displayedPatients && displayedPatients.length > 0 ? (
                  displayedPatients.map((patient) => (
                    <tr
                      key={patient.id}
                      className="cursor-pointer hover:bg-blue-50"
                      onClick={() => handleRowClick(patient)}
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">
                          {patient.fullname}
                        </div>
                        <div className="text-xs text-gray-400">
                          #{patient.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{patient.phone}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(patient.consultation_date).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        Photo upload → Analysis → Treatment → Complete
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {patient.notes && patient.notes.length > 0 ? patient.notes[0].content : ""}
                      </td>
                    </tr>
                  ))
                ) : (
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
      <CreatePatientModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
};

export default PatientListPage;
