import { FieldTab } from "../types";

export const mainFieldTabs: FieldTab[] = [
  {
    title: "Thông tin cơ bản",
    icon: "👤",
    sections: [
      {
        title: "Thông tin bệnh nhân",
        fields: [
          {
            name: "gender",
            label: "Giới",
            type: "select",
            options: [
              { value: 1, label: "Nam" },
              { value: 2, label: "Nữ" },
            ],
            help: "Giới tính",
          },
          {
            name: "age",
            label: "Tuổi",
            type: "number",
            min: 10,
            max: 100,
            help: "Tuổi năm sinh",
          },
        ],
      },
    ],
  },
  {
    title: "Đo đạc răng miệng",
    icon: "🦷",
    sections: [
      {
        title: "Đo đạc răng cơ bản",
        fields: [
          {
            name: "c_u",
            label: "C – U (mm)",
            type: "number",
            step: 0.1,
            help: "Độ dư/thiếu khoảng hàm trên",
          },
          {
            name: "c_l",
            label: "C – L (mm)",
            type: "number",
            step: 0.1,
            help: "Độ dư/thiếu khoảng hàm dưới",
          },
          {
            name: "t_u",
            label: "T – U (mm)",
            type: "number",
            step: 0.1,
            help: "Thiếu khoảng hàm trên",
          },
          {
            name: "t_l",
            label: "T – L (mm)",
            type: "number",
            step: 0.1,
            help: "Thiếu khoảng hàm dưới",
          },
          {
            name: "ob",
            label: "OB (mm)",
            type: "number",
            step: 0.1,
            help: "Cắn chìa dọc",
          },
          {
            name: "oj",
            label: "OJ (mm)",
            type: "number",
            step: 0.1,
            help: "Cắn chìa ngang",
          },
        ],
      },
      {
        title: "Phân loại Angle & Đường cong Spee",
        fields: [
          {
            name: "angle_r",
            label: "Angle – R",
            type: "select",
            options: [
              { value: 1, label: "Class I" },
              { value: 2, label: "Class II" },
              { value: 3, label: "Class III" },
            ],
            help: "Phân loại cắn khớp theo Angle bên phải",
          },
          {
            name: "angle_l",
            label: "Angle – L",
            type: "select",
            options: [
              { value: 1, label: "Class I" },
              { value: 2, label: "Class II" },
              { value: 3, label: "Class III" },
            ],
            help: "Phân loại cắn khớp theo Angle bên trái",
          },
          {
            name: "spee_r",
            label: "Spee_R (mm)",
            type: "number",
            step: 0.1,
            help: "Chiều sâu đường cong Spee bên phải",
          },
          {
            name: "spee_l",
            label: "Spee - L (mm)",
            type: "number",
            step: 0.1,
            help: "Chiều sâu đường cong Spee bên trái",
          },
        ],
      },
    ],
  },
  {
    title: "Phân tích X-quang",
    icon: "📸",
    sections: [
      {
        title: "Góc đo cephalometric cơ bản",
        fields: [
          {
            name: "sna",
            label: "SNA (°)",
            type: "number",
            step: 0.1,
            help: "Góc đánh giá vị trí tiền sau xương hàm trên so với nền sọ",
          },
          {
            name: "snb",
            label: "SNB (°)",
            type: "number",
            step: 0.1,
            help: "Góc đánh giá vị trí tiền sau xương hàm dưới so với nền sọ",
          },
          {
            name: "anb",
            label: "ANB (°)",
            type: "number",
            step: 0.1,
            help: "Góc đánh giá mối quan hệ xương giữa hàm trên và hàm dưới",
          },
          {
            name: "wits",
            label: "Wits (mm)",
            type: "number",
            step: 0.1,
            help: "Đánh giá mối quan hệ giữa hàm trên và hàm dưới tại mặt phẳng khớp cắn",
          },
        ],
      },
    ],
  },
];
