import { useState } from "react";

export function usePatientData() {
  const [patientData, setPatientData] = useState({
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
    treatmentPlan: "Click to edit",
  });

  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");

  const handleEditStart = (field: string, currentValue: string) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const handleEditSave = (field: string) => {
    setPatientData((prev) => ({
      ...prev,
      [field]: tempValue,
    }));
    setEditingField(null);
    setTempValue("");
  };

  const handleEditCancel = () => {
    setEditingField(null);
    setTempValue("");
  };

  return {
    patientData,
    editingField,
    tempValue,
    setTempValue,
    handleEditStart,
    handleEditSave,
    handleEditCancel,
  };
}
