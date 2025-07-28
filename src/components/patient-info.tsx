import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import type { Patient } from "@shared/schema";

interface PatientInfoProps {
  patient: Patient;
}

export function PatientInfo({ patient }: PatientInfoProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "analyzed":
        return "status-badge-success";
      case "pending":
        return "status-badge-warning";
      default:
        return "status-badge-danger";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "analyzed":
        return "Đã phân tích";
      case "pending":
        return "Đang xử lý";
      default:
        return "Chờ xử lý";
    }
  };

  return (
    <Card className="bg-clinical-50 border-clinical-200">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold text-clinical-900 mb-4 flex items-center">
          <User className="text-primary mr-2" size={20} />
          Thông tin Bệnh nhân
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-clinical-200">
            <span className="text-clinical-600 font-medium">Tên bệnh nhân:</span>
            <span className="text-clinical-900 font-semibold">{patient.name}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-clinical-200">
            <span className="text-clinical-600 font-medium">ID Bệnh nhân:</span>
            <span className="text-clinical-900 font-mono">{patient.id}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-clinical-200">
            <span className="text-clinical-600 font-medium">Ngày khám:</span>
            <span className="text-clinical-900">{patient.examinationDate}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-clinical-600 font-medium">Trạng thái:</span>
            <span className={getStatusColor(patient.status)}>
              {getStatusText(patient.status)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
