import type { PatientData } from "@/stores/patient-store";

type PatientSummary = Pick<
  PatientData,
  "patientId" | "name" | "phone" | "consultationDate" | "note"
>;

export const patientSummaries: PatientSummary[] = [
  {
    patientId: "DEMO-2025-001",
    name: "NHAT NGUYEN",
    phone: "090909090909",
    consultationDate: "07/07/2025",
    note: "",
  },
  {
    patientId: "DEMO-2023-010",
    name: "Viceph sample patient",
    phone: "0981XXXXX",
    consultationDate: "26/04/2023",
    note: "",
  },
];

export const patientDetails: PatientData[] = [
  {
    patientId: "DEMO-2025-001",
    name: "NHAT NGUYEN",
    firstName: "NGUYEN",
    lastName: "NHAT",
    email: "nhat.nguyen@example.com",
    sex: "male",
    dateOfBirth: "01/01/1990",
    consultationDate: "07/07/2025",
    phone: "090909090909",
    address: "",
    chiefComplaint: "",
    diagnose: "",
    note: "",
  },
  {
    patientId: "DEMO-2023-010",
    name: "Viceph sample patient",
    firstName: "Viceph",
    lastName: "Sample",
    email: "sample@example.com",
    sex: "female",
    dateOfBirth: "15/05/1992",
    consultationDate: "26/04/2023",
    phone: "0981XXXXX",
    address: "",
    chiefComplaint: "",
    diagnose: "",
    note: "",
  },
];

export const getPatientById = (patientId: string): PatientData | undefined =>
  patientDetails.find((patient) => patient.patientId === patientId);
