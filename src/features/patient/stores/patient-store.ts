import { create } from "zustand";

export interface PatientData {
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
  name: "NHẬT NGUYỄN",
  firstName: "NGUYỄN",
  lastName: "NHẬT",
  email: "635107103@st.utc2.edu.v",
  sex: "male",
  dateOfBirth: "01/01/1990",
  consultationDate: "07/07/2025",
  phone: "0909090909909",
  address: "Click to edit",
  chiefComplaint: "Click to edit",
  diagnose: "Click to edit",
  note: "Click to edit",
};

export const usePatientStore = create<PatientState>((set) => ({
  patientData: initialPatientData,
  setPatientData: (data) => set((state) => ({
    patientData: typeof data === 'function' ? data(state.patientData) : { ...state.patientData, ...data }
  })),
}));
