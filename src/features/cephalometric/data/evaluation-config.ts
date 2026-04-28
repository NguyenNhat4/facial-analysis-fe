export type IndexCategory = "Skeletal" | "Dental" | "SoftTissue";
export type EvaluationStatus = "LOW" | "NORMAL" | "HIGH";

export interface IndexConfig {
  name: string;
  category: IndexCategory;
  min: number;
  max: number;
  unit: string;
  evaluations: {
    low: string;
    normal: string;
    high: string;
  };
}

export const CEPHALOMETRIC_EVALUATION_CONFIG: Record<string, IndexConfig> = {
  SNA: {
    name: "SNA",
    category: "Skeletal",
    min: 79.91,
    max: 88.75,
    unit: "°",
    evaluations: {
      low: "Xương hàm trên lùi (kém phát triển, gây móm hàm trên).",
      normal: "Xương hàm trên bình thường, hài hòa.",
      high: "Xương hàm trên nhô ra trước (quá phát, gây hô hàm trên).",
    },
  },
  SNB: {
    name: "SNB",
    category: "Skeletal",
    min: 76.62,
    max: 85.34,
    unit: "°",
    evaluations: {
      low: "Xương hàm dưới lùi (lẹm cằm, cằm ngắn).",
      normal: "Xương hàm dưới bình thường, hài hòa.",
      high: "Xương hàm dưới nhô ra trước (móm do hàm dưới dài).",
    },
  },
  ANB: {
    name: "ANB",
    category: "Skeletal",
    min: 1.12,
    max: 5.56,
    unit: "°",
    evaluations: {
      low: "Tương quan Hạng III (Móm xương). Xương hàm dưới nhô hơn xương hàm trên.",
      normal: "Tương quan Hạng I (Bình thường, hài hòa).",
      high: "Tương quan Hạng II (Hô xương). Xương hàm trên nhô hơn hàm dưới.",
    },
  },
  Z: {
    name: "Z",
    category: "SoftTissue",
    min: 67.33,
    max: 80.79,
    unit: "°",
    evaluations: {
      low: "Góc Z thấp hơn chuẩn, gợi ý cằm hoặc môi dưới lùi hơn.",
      normal: "Góc Z hài hòa theo chuẩn tham chiếu.",
      high: "Góc Z cao hơn chuẩn, gợi ý cằm hoặc môi dưới nhô hơn.",
    },
  },
  "I-NA": {
    name: "I-NA",
    category: "Dental",
    min: 2.81,
    max: 7.33,
    unit: "mm",
    evaluations: {
      low: "Răng cửa trên cụp vào trong.",
      normal: "Trục răng cửa trên bình thường.",
      high: "Răng cửa trên chìa ra trước (hô răng).",
    },
  },
  "i-NB": {
    name: "i-NB",
    category: "Dental",
    min: 4.07,
    max: 8.43,
    unit: "mm",
    evaluations: {
      low: "Răng cửa dưới cụp vào trong.",
      normal: "Trục răng cửa dưới bình thường.",
      high: "Răng cửa dưới chìa ra ngoài.",
    },
  },
  "i/MP": {
    name: "i/MP",
    category: "Dental",
    min: 89.93,
    max: 103.65,
    unit: "°",
    evaluations: {
      low: "Răng cửa dưới ngả quá nhiều vào trong (cụp).",
      normal: "Răng cửa dưới có độ nghiêng chuẩn.",
      high: "Răng cửa dưới ngả ra ngoài nhiều (chìa).",
    },
  },
  FMIA: {
    name: "FMIA",
    category: "Dental",
    min: 50.36,
    max: 65.74,
    unit: "°",
    evaluations: {
      low: "Răng cửa dưới ngả ra trước hơn so với mặt phẳng Frankfort.",
      normal: "Trục răng cửa dưới hài hòa với mặt phẳng Frankfort.",
      high: "Răng cửa dưới ngả vào trong hơn so với mặt phẳng Frankfort.",
    },
  },
  "I/i": {
    name: "I/i",
    category: "Dental",
    min: 110.19,
    max: 128.87,
    unit: "°",
    evaluations: {
      low: "Góc hẹp, hai răng cửa đang cùng chìa ra trước (hô hai hàm).",
      normal: "Tương quan trục hai răng cửa hài hòa.",
      high: "Góc mở rộng, răng cửa hai hàm bị cụp vào trong hoặc mặt đứng.",
    },
  },
  "Sn-Ls-Li-Pg`": {
    name: "Sn-Ls-Li-Pg’",
    category: "SoftTissue",
    min: 130.50,
    max: 151.52,
    unit: "°",
    evaluations: {
      low: "Hai môi lùi hoặc khép hơn so với chuẩn.",
      normal: "Hai môi hài hòa theo chuẩn tham chiếu.",
      high: "Hai môi căng hoặc nhô hơn so với chuẩn.",
    },
  },
  "N-Me": {
    name: "N-Me",
    category: "SoftTissue",
    min: 107.8,
    max: 122.4,
    unit: "mm",
    evaluations: {
      low: "Mặt ngắn (khuôn mặt có xu hướng vuông/tròn).",
      normal: "Tầng mặt có chiều cao hài hòa.",
      high: "Mặt dài.",
    },
  },
  "Li-E": {
    name: "Li-E",
    category: "SoftTissue",
    min: -0.6,
    max: 4.14,
    unit: "mm",
    evaluations: {
      low: "Môi dưới lùi nhiều phía sau đường E (móm, hoặc do mũi/cằm quá cao).",
      normal: "Môi dưới hài hòa với mặt nghiêng.",
      high: "Môi dưới nhô ra trước đường E (hô môi).",
    },
  },
  "Ls-E": {
    name: "Ls-E",
    category: "SoftTissue",
    min: -1.9,
    max: 2.78,
    unit: "mm",
    evaluations: {
      low: "Môi trên lùi nhiều phía sau đường E (móm môi trên).",
      normal: "Môi trên hài hòa với mặt nghiêng.",
      high: "Môi trên nhô ra trước đường E (hô môi trên).",
    },
  },
};
