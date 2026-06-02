import { create } from "zustand";

export interface PatientData {
  patientId: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  sex: string;
  dateOfBirth: string;
  consultationDate: string;
  phone: string;
  address: string;
  chiefComplaint: string;
  diagnose: string;
  note: string;
}

interface PatientState {
  patientData: PatientData;
  setPatientData: (data: Partial<PatientData> | ((prev: PatientData) => PatientData)) => void;
}

const initialPatientData: PatientData = {
  patientId: "",
  name: "",
  firstName: "",
  lastName: "",
  email: "",
  sex: "",
  dateOfBirth: "",
  consultationDate: "",
  phone: "",
  address: "",
  chiefComplaint: "",
  diagnose: "",
  note: "",
};

export const usePatientStore = create<PatientState>((set) => ({
  patientData: initialPatientData,
  setPatientData: (data) => set((state) => ({
    patientData: typeof data === 'function' ? data(state.patientData) : { ...state.patientData, ...data }
  })),
}));
