import { useState } from "react";
import { usePatientStore } from "../stores/patient-store";

export function usePatientData() {
  const { patientData, setPatientData } = usePatientStore();

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
