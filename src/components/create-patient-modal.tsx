import React, { useState, useEffect } from "react";
import { useCreatePatient, useUpdatePatient, PatientBackendResponse } from "@/api/patients";

interface CreatePatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientToEdit?: PatientBackendResponse | null;
}

export const CreatePatientModal: React.FC<CreatePatientModalProps> = ({
  isOpen,
  onClose,
  patientToEdit,
}) => {
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [consultationDate, setConsultationDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [note, setNote] = useState("");

  const createPatientMutation = useCreatePatient();
  const updatePatientMutation = useUpdatePatient();

  useEffect(() => {
    if (patientToEdit && isOpen) {
      setFullname(patientToEdit.fullname || "");
      setPhone(patientToEdit.phone || "");
      setDateOfBirth(patientToEdit.date_of_birth ? patientToEdit.date_of_birth.split("T")[0] : "");
      setChiefComplaint(patientToEdit.chief_complaint || "");
      setConsultationDate(patientToEdit.consultation_date ? patientToEdit.consultation_date.split("T")[0] : new Date().toISOString().slice(0, 10));
      setNote(patientToEdit.notes?.[0]?.content || "");
    } else if (!isOpen) {
      setFullname("");
      setPhone("");
      setDateOfBirth("");
      setChiefComplaint("");
      setConsultationDate(new Date().toISOString().slice(0, 10));
      setNote("");
    }
  }, [patientToEdit, isOpen]);

  if (!isOpen) return null;

  const isEditing = !!patientToEdit;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      fullname,
      phone,
      date_of_birth: dateOfBirth ? dateOfBirth + "T00:00:00" : undefined,
      chief_complaint: chiefComplaint || undefined,
      consultation_date: consultationDate + "T00:00:00",
      note,
    };

    if (isEditing) {
      updatePatientMutation.mutate(
        { id: patientToEdit.id, data: payload },
        {
          onSuccess: () => {
            onClose();
          },
          onError: (err) => {
            alert("Error updating patient: " + err.message);
          },
        }
      );
    } else {
      createPatientMutation.mutate(
        payload,
        {
          onSuccess: () => {
            onClose();
          },
          onError: (err) => {
            alert("Error creating patient: " + err.message);
          },
        }
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">{isEditing ? "Edit Patient" : "Create New Patient"}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              required
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              required
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="0901234567"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth (Optional)
            </label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chief Complaint (Optional)
            </label>
            <input
              type="text"
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="E.g., Missing teeth"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Consultation Date
            </label>
            <input
              required
              type="date"
              value={consultationDate}
              onChange={(e) => setConsultationDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Note
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[80px]"
              placeholder="Initial consultation notes..."
            />
          </div>
          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isEditing ? updatePatientMutation.isPending : createPatientMutation.isPending}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
            >
              {(isEditing ? updatePatientMutation.isPending : createPatientMutation.isPending) ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Patient" : "Create Patient")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
