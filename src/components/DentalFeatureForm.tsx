import { useState, ChangeEvent, FormEvent } from "react";
import {
  Model,
  Features,
  PredictionType,
  FieldTab,
  PatientTemplate,
} from "../types";

interface DentalFeatureFormProps {
  onPredict: (
    features: Features,
    predictionType: PredictionType,
    selectedTarget?: string | null
  ) => void;
  loading: boolean;
  models: Model[];
}

const DentalFeatureForm: React.FC<DentalFeatureFormProps> = ({
  onPredict,
  loading,
  models,
}) => {
  // Define state variables
  const [features, setFeatures] = useState<Features>({
    gender: 1,
    age: 23,
    tr_me_za_zaza: 1.41,
    za_ag_me_right: 140.6,
    za_ag_me_left: 135.6,
    lower_1_3_ratio: 0.83,
    g_prime_n_prime_preprn: 145.62,
    preli_sm_pog_prime: 133.64,
    cm_sn_ls: 88.92,
    fh_soft_tissue_angle_ab: 72.29,
    c_u: -3.41,
    c_l: -1.5,
    t_u: 49.37,
    t_l: 42.87,
    ob: 1.78,
    oj: 2.3,
    angle_r: 1,
    angle_l: 1,
    spee_r: 3.05,
    spee_l: 2.51,
    sna: 82.6,
    snb: 78.81,
    anb: 3.79,
    wits: 0.51,
    pfh_afh: 69.59,
    fma: 20.95,
    gn_gn_sn: 27.47,
    fa: 0.36,
    fd: 86.98,
    lfh: 42.22,
    u1_na_mm: 5.07,
    l1_nb_mm: 6.06,
    u1_na_deg: 26.01,
    l1_nb_deg: 28.3,
    u1_apog_mm: 7.67,
    l1_apog_mm: 2.8,
    u1_l1_deg: 121.9,
    impa: 101.13,
    ul_e_plane: -2.17,
    ll_e_plane: -0.37,
    ei: 161.89,
    complaint_1: 0,
    complaint_2: 0,
    complaint_3: 0,
    complaint_4: 0,
    complaint_5: 0,
    complaint_6: 0,
    complaint_7: 0,
    complaint_8: 1,
    complaint_9: 0,
  });

  const [predictionType, setPredictionType] =
    useState<PredictionType>("multi-output");
  const [selectedTarget, setSelectedTarget] = useState<string>("");
  const [activeTab, setActiveTab] = useState<number>(0);
  const [showTemplates, setShowTemplates] = useState<boolean>(false);
  const [inputMode, setInputMode] = useState<"guided" | "advanced">("guided");

  // Input change handler
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value, type } = e.target;
    setFeatures((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? value === ""
            ? 0
            : parseFloat(value)
          : parseInt(value),
    }));
  };

  // Get unique targets from models
  const targets: string[] = [...new Set(models.map((model) => model.target))];

  // Predefined patient templates
  const patientTemplates: PatientTemplate[] = [
    {
      name: "Bệnh nhân bình thường",
      description: "Thông số trung bình cho bệnh nhân không có vấn đề lớn",
      data: {
        gender: 1,
        age: 25,
        tr_me_za_zaza: 82.5,
        za_ag_me_right: 135.0,
        za_ag_me_left: 135.0,
        lower_1_3_ratio: 0.8,
        g_prime_n_prime_preprn: 145.0,
        preli_sm_pog_prime: 130.0,
        cm_sn_ls: 85.0,
        fh_soft_tissue_angle_ab: 75.0,
        c_u: 0,
        c_l: 0,
        t_u: 45.0,
        t_l: 40.0,
        ob: 2.0,
        oj: 3.0,
        angle_r: 1,
        angle_l: 1,
        spee_r: 2.0,
        spee_l: 2.0,
        sna: 82.0,
        snb: 80.0,
        anb: 2.0,
        wits: 0.0,
        pfh_afh: 65.0,
        fma: 25.0,
        gn_gn_sn: 30.0,
        fa: 85.0,
        fd: 85.0,
        lfh: 65.0,
        u1_na_mm: 4.0,
        l1_nb_mm: 4.0,
        u1_na_deg: 22.0,
        l1_nb_deg: 25.0,
        u1_apog_mm: 5.0,
        l1_apog_mm: 2.0,
        u1_l1_deg: 130.0,
        impa: 95.0,
        ul_e_plane: -1.0,
        ll_e_plane: 0.0,
        ei: 160.0,
        complaint_1: 0,
        complaint_2: 0,
        complaint_3: 0,
        complaint_4: 0,
        complaint_5: 0,
        complaint_6: 0,
        complaint_7: 0,
        complaint_8: 0,
        complaint_9: 0,
      },
    },
    {
      name: "Bệnh nhân hô răng",
      description: "Thông số cho bệnh nhân có triệu chứng hô răng",
      data: {
        gender: 2,
        age: 28,
        tr_me_za_zaza: 85.0,
        za_ag_me_right: 140.0,
        za_ag_me_left: 140.0,
        lower_1_3_ratio: 0.85,
        g_prime_n_prime_preprn: 150.0,
        preli_sm_pog_prime: 135.0,
        cm_sn_ls: 90.0,
        fh_soft_tissue_angle_ab: 70.0,
        c_u: 3.0,
        c_l: 1.0,
        t_u: 50.0,
        t_l: 45.0,
        ob: 3.0,
        oj: 5.0,
        angle_r: 2,
        angle_l: 2,
        spee_r: 3.0,
        spee_l: 3.0,
        sna: 85.0,
        snb: 78.0,
        anb: 7.0,
        wits: 3.0,
        pfh_afh: 70.0,
        fma: 22.0,
        gn_gn_sn: 28.0,
        fa: 88.0,
        fd: 88.0,
        lfh: 68.0,
        u1_na_mm: 7.0,
        l1_nb_mm: 6.0,
        u1_na_deg: 28.0,
        l1_nb_deg: 30.0,
        u1_apog_mm: 8.0,
        l1_apog_mm: 3.0,
        u1_l1_deg: 115.0,
        impa: 105.0,
        ul_e_plane: 1.0,
        ll_e_plane: 1.5,
        ei: 155.0,
        complaint_1: 1,
        complaint_2: 0,
        complaint_3: 0,
        complaint_4: 0,
        complaint_5: 1,
        complaint_6: 0,
        complaint_7: 0,
        complaint_8: 0,
        complaint_9: 0,
      },
    },
    {
      name: "Bệnh nhân móm",
      description: "Thông số cho bệnh nhân có triệu chứng móm",
      data: {
        gender: 1,
        age: 32,
        tr_me_za_zaza: 80.0,
        za_ag_me_right: 130.0,
        za_ag_me_left: 130.0,
        lower_1_3_ratio: 0.75,
        g_prime_n_prime_preprn: 140.0,
        preli_sm_pog_prime: 125.0,
        cm_sn_ls: 80.0,
        fh_soft_tissue_angle_ab: 80.0,
        c_u: -2.0,
        c_l: -3.0,
        t_u: 40.0,
        t_l: 35.0,
        ob: 1.0,
        oj: 0.0,
        angle_r: 3,
        angle_l: 3,
        spee_r: 1.5,
        spee_l: 1.5,
        sna: 78.0,
        snb: 82.0,
        anb: -4.0,
        wits: -2.0,
        pfh_afh: 60.0,
        fma: 30.0,
        gn_gn_sn: 35.0,
        fa: 82.0,
        fd: 82.0,
        lfh: 62.0,
        u1_na_mm: 2.0,
        l1_nb_mm: 8.0,
        u1_na_deg: 18.0,
        l1_nb_deg: 35.0,
        u1_apog_mm: 3.0,
        l1_apog_mm: 5.0,
        u1_l1_deg: 140.0,
        impa: 85.0,
        ul_e_plane: -3.0,
        ll_e_plane: -2.0,
        ei: 170.0,
        complaint_1: 0,
        complaint_2: 0,
        complaint_3: 1,
        complaint_4: 0,
        complaint_5: 0,
        complaint_6: 0,
        complaint_7: 0,
        complaint_8: 1,
        complaint_9: 0,
      },
    },
    {
      name: "Bệnh nhân cắn hở",
      description: "Thông số cho bệnh nhân có triệu chứng cắn hở",
      data: {
        gender: 2,
        age: 20,
        tr_me_za_zaza: 88.0,
        za_ag_me_right: 145.0,
        za_ag_me_left: 145.0,
        lower_1_3_ratio: 0.9,
        g_prime_n_prime_preprn: 155.0,
        preli_sm_pog_prime: 140.0,
        cm_sn_ls: 95.0,
        fh_soft_tissue_angle_ab: 68.0,
        c_u: 2.0,
        c_l: 2.0,
        t_u: 48.0,
        t_l: 43.0,
        ob: -1.0,
        oj: 4.0,
        angle_r: 1,
        angle_l: 1,
        spee_r: 4.0,
        spee_l: 4.0,
        sna: 84.0,
        snb: 76.0,
        anb: 8.0,
        wits: 4.0,
        pfh_afh: 75.0,
        fma: 35.0,
        gn_gn_sn: 40.0,
        fa: 90.0,
        fd: 90.0,
        lfh: 70.0,
        u1_na_mm: 6.0,
        l1_nb_mm: 5.0,
        u1_na_deg: 25.0,
        l1_nb_deg: 28.0,
        u1_apog_mm: 7.0,
        l1_apog_mm: 2.5,
        u1_l1_deg: 125.0,
        impa: 100.0,
        ul_e_plane: 0.0,
        ll_e_plane: 0.5,
        ei: 158.0,
        complaint_1: 0,
        complaint_2: 1,
        complaint_3: 0,
        complaint_4: 0,
        complaint_5: 1,
        complaint_6: 1,
        complaint_7: 1,
        complaint_8: 0,
        complaint_9: 0,
      },
    },
  ];

  // Apply template
  const applyTemplate = (template: PatientTemplate): void => {
    setFeatures(template.data);
    setShowTemplates(false);
  };

  // Define fieldGroups in a more organized tabbed structure
  const fieldTabs: FieldTab[] = [
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
        {
          title: "Than phiền chính",
          fields: [
            {
              name: "complaint_1",
              label: "Hô nhẹ",
              type: "select",
              options: [
                { value: 0, label: "Không" },
                { value: 1, label: "Có" },
              ],
              help: "Than phiền của BN",
            },
            {
              name: "complaint_2",
              label: "Hô nhiều",
              type: "select",
              options: [
                { value: 0, label: "Không" },
                { value: 1, label: "Có" },
              ],
              help: "Than phiền của BN",
            },
            {
              name: "complaint_3",
              label: "Móm nhẹ",
              type: "select",
              options: [
                { value: 0, label: "Không" },
                { value: 1, label: "Có" },
              ],
              help: "Than phiền của BN",
            },
            {
              name: "complaint_4",
              label: "Móm nặng",
              type: "select",
              options: [
                { value: 0, label: "Không" },
                { value: 1, label: "Có" },
              ],
              help: "Than phiền của BN",
            },
            {
              name: "complaint_5",
              label: "Răng lộn xộn nhiều",
              type: "select",
              options: [
                { value: 0, label: "Không" },
                { value: 1, label: "Có" },
              ],
              help: "Than phiền của BN",
            },
            {
              name: "complaint_6",
              label: "Cười lộ nướu nhiều",
              type: "select",
              options: [
                { value: 0, label: "Không" },
                { value: 1, label: "Có" },
              ],
              help: "Than phiền của BN",
            },
            {
              name: "complaint_7",
              label: "Cắn hở",
              type: "select",
              options: [
                { value: 0, label: "Không" },
                { value: 1, label: "Có" },
              ],
              help: "Than phiền của BN",
            },
            {
              name: "complaint_8",
              label: "Cắn lệch",
              type: "select",
              options: [
                { value: 0, label: "Không" },
                { value: 1, label: "Có" },
              ],
              help: "Than phiền của BN",
            },
            {
              name: "complaint_9",
              label: "Thưa răng",
              type: "select",
              options: [
                { value: 0, label: "Không" },
                { value: 1, label: "Có" },
              ],
              help: "Than phiền của BN",
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
            {
              name: "fma",
              label: "FMA (°)",
              type: "number",
              step: 0.1,
              help: "Góc nghiêng của mặt phẳng hàm dưới",
            },
            {
              name: "fa",
              label: "FA (°)",
              type: "number",
              step: 0.1,
              help: "Góc mặt",
            },
          ],
        },
        {
          title: "Tỷ lệ khuôn mặt",
          fields: [
            {
              name: "pfh_afh",
              label: "PFH/AFH (%)",
              type: "number",
              step: 0.01,
              help: "Tỷ lệ chiều cao mặt sau và trước",
            },
            {
              name: "gn_gn_sn",
              label: "SN - GoGn (°)",
              type: "number",
              step: 0.1,
              help: "Góc giữa mặt phẳng nền sọ trước và mặt phẳng hàm dưới",
            },
            {
              name: "fd",
              label: "FD (°)",
              type: "number",
              step: 0.1,
              help: "Độ sâu mặt",
            },
            {
              name: "lfh",
              label: "LFH (%)",
              type: "number",
              step: 0.1,
              help: "Chiều cao mặt dưới",
            },
          ],
        },
        {
          title: "Phân tích răng",
          fields: [
            {
              name: "u1_na_mm",
              label: "U1 - NA (mm)",
              type: "number",
              step: 0.1,
              help: "Khoảng cách từ răng cửa trên đến đường NA",
            },
            {
              name: "l1_nb_mm",
              label: "L1 - NB (mm)",
              type: "number",
              step: 0.1,
              help: "Khoảng cách từ răng cửa dưới đến đường NB",
            },
            {
              name: "u1_na_deg",
              label: "Góc (U1- NA) (°)",
              type: "number",
              step: 0.1,
              help: "Góc nghiêng của răng cửa trên so với đường NA",
            },
            {
              name: "l1_nb_deg",
              label: "Góc (L1- NB) (°)",
              type: "number",
              step: 0.1,
              help: "Góc nghiêng của răng cửa dưới so với đường NB",
            },
            {
              name: "u1_apog_mm",
              label: "U1- APog (mm)",
              type: "number",
              step: 0.1,
              help: "Khoảng cách từ răng cửa trên đến điểm APog",
            },
            {
              name: "l1_apog_mm",
              label: "L1- APog (mm)",
              type: "number",
              step: 0.1,
              help: "Khoảng cách từ răng cửa dưới đến điểm APog",
            },
            {
              name: "u1_l1_deg",
              label: "Góc (U1 – L1) (°)",
              type: "number",
              step: 0.1,
              help: "Góc giữa trục dài răng cửa trên và răng cửa dưới",
            },
            {
              name: "impa",
              label: "IMPA (°)",
              type: "number",
              step: 0.1,
              help: "Góc giữa trục dài răng cửa dưới và mặt phẳng hàm dưới",
            },
          ],
        },
      ],
    },
    {
      title: "Phân tích nâng cao",
      icon: "⚙️",
      sections: [
        {
          title: "Đo đạc X quang nâng cao",
          fields: [
            {
              name: "tr_me_za_zaza",
              label: "Tr-Me/Za-Za",
              type: "number",
              step: 0.1,
              help: "Tỷ lệ chiều dài mặt và chiều rộng gò má",
            },
            {
              name: "za_ag_me_right",
              label: "Za -> Ag <- Me (bên phải) (°)",
              type: "number",
              step: 0.1,
              help: "Góc gò má - hàm dưới phía bên phải",
            },
            {
              name: "za_ag_me_left",
              label: "Za -> Ag <- Me (bên trái) (°)",
              type: "number",
              step: 0.1,
              help: "Góc gò má - hàm dưới phía bên trái",
            },
            {
              name: "lower_1_3_ratio",
              label: "Tỉ lệ 1/3 dưới",
              type: "number",
              step: 0.01,
              help: "Tỷ lệ 1/3 dưới của khuôn mặt",
            },
            {
              name: "g_prime_n_prime_preprn",
              label: "G' -> N' <- PrePrn (°)",
              type: "number",
              step: 0.1,
              help: "Góc độ lồi của mũi",
            },
            {
              name: "preli_sm_pog_prime",
              label: "PreLi -> Sm <- Pog' (°)",
              type: "number",
              step: 0.1,
              help: "Góc độ lồi của môi",
            },
          ],
        },
        {
          title: "Phân tích mô mềm",
          fields: [
            {
              name: "cm_sn_ls",
              label: "Cm -> Sn <- Ls (°)",
              type: "number",
              step: 0.1,
              help: "Góc độ lồi của môi trên",
            },
            {
              name: "fh_soft_tissue_angle_ab",
              label: "Góc FH mô mềm – A'B' (°)",
              type: "number",
              step: 0.1,
              help: "Góc mô mềm của profile",
            },
            {
              name: "ul_e_plane",
              label: "UL – E Line (mm)",
              type: "number",
              step: 0.1,
              help: "Khoảng cách môi trên đến đường thẩm mỹ E",
            },
            {
              name: "ll_e_plane",
              label: "LL – E Line (mm)",
              type: "number",
              step: 0.1,
              help: "Khoảng cách môi dưới đến đường thẩm mỹ E",
            },
            {
              name: "ei",
              label: "EI (°)",
              type: "number",
              step: 0.1,
              help: "Chỉ số thẩm mỹ",
            },
          ],
        },
      ],
    },
  ];

  // Form submission handler
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onPredict(features, predictionType, selectedTarget);
  };

  // Load sample data
  const loadSampleData = (): void => {
    setFeatures({
      gender: 1,
      age: 28,
      tr_me_za_zaza: 85.5,
      za_ag_me_right: 78.2,
      za_ag_me_left: 79.1,
      lower_1_3_ratio: 0.75,
      g_prime_n_prime_preprn: 12.5,
      preli_sm_pog_prime: 4.2,
      cm_sn_ls: 15.8,
      fh_soft_tissue_angle_ab: 85.0,
      c_u: 25.3,
      c_l: 23.1,
      t_u: 18.5,
      t_l: 16.2,
      ob: 2.5,
      oj: 3.2,
      angle_r: 1,
      angle_l: 1,
      spee_r: 1.8,
      spee_l: 1.9,
      sna: 82.5,
      snb: 78.0,
      anb: 4.5,
      wits: 2.1,
      pfh_afh: 0.68,
      fma: 28.5,
      gn_gn_sn: 32.1,
      fa: 88.2,
      fd: 85.6,
      lfh: 65.8,
      u1_na_mm: 4.2,
      l1_nb_mm: 3.8,
      u1_na_deg: 22.5,
      l1_nb_deg: 25.1,
      u1_apog_mm: 5.2,
      l1_apog_mm: 1.8,
      u1_l1_deg: 132.5,
      impa: 95.2,
      ul_e_plane: -2.1,
      ll_e_plane: -0.8,
      ei: 28.5,
      complaint_1: 1,
      complaint_2: 0,
      complaint_3: 1,
      complaint_4: 0,
      complaint_5: 0,
      complaint_6: 1,
      complaint_7: 0,
      complaint_8: 0,
      complaint_9: 0,
    });
  };

  // Reset form to default values
  const resetForm = (): void => {
    setFeatures({
      gender: 1,
      age: 23,
      tr_me_za_zaza: 1.41,
      za_ag_me_right: 140.6,
      za_ag_me_left: 135.6,
      lower_1_3_ratio: 0.83,
      g_prime_n_prime_preprn: 145.62,
      preli_sm_pog_prime: 133.64,
      cm_sn_ls: 88.92,
      fh_soft_tissue_angle_ab: 72.29,
      c_u: -3.41,
      c_l: -1.5,
      t_u: 49.37,
      t_l: 42.87,
      ob: 1.78,
      oj: 2.3,
      angle_r: 1,
      angle_l: 1,
      spee_r: 3.05,
      spee_l: 2.51,
      sna: 82.6,
      snb: 78.81,
      anb: 3.79,
      wits: 0.51,
      pfh_afh: 69.59,
      fma: 20.95,
      gn_gn_sn: 27.47,
      fa: 0.36,
      fd: 86.98,
      lfh: 42.22,
      u1_na_mm: 5.07,
      l1_nb_mm: 6.06,
      u1_na_deg: 26.01,
      l1_nb_deg: 28.3,
      u1_apog_mm: 7.67,
      l1_apog_mm: 2.8,
      u1_l1_deg: 121.9,
      impa: 101.13,
      ul_e_plane: -2.17,
      ll_e_plane: -0.37,
      ei: 161.89,
      complaint_1: 0,
      complaint_2: 0,
      complaint_3: 0,
      complaint_4: 0,
      complaint_5: 0,
      complaint_6: 0,
      complaint_7: 0,
      complaint_8: 1,
      complaint_9: 0,
    });
  };

  return (
    <div className="space-y-6">
      {/* Input Mode Toggle */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">
              Chế độ nhập liệu
            </h3>
            <div className="flex gap-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="inputMode"
                  value="guided"
                  checked={inputMode === "guided"}
                  onChange={(e) =>
                    setInputMode(e.target.value as "guided" | "advanced")
                  }
                  className="mr-2"
                />
                <span className="text-sm">🎯 Hướng dẫn từng bước</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="inputMode"
                  value="advanced"
                  checked={inputMode === "advanced"}
                  onChange={(e) =>
                    setInputMode(e.target.value as "guided" | "advanced")
                  }
                  className="mr-2"
                />
                <span className="text-sm">⚡ Nhập nhanh (chuyên gia)</span>
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowTemplates(!showTemplates)}
              className="btn btn-secondary text-sm px-4 py-2"
            >
              📋 Mẫu có sẵn
            </button>
            <button
              type="button"
              onClick={loadSampleData}
              className="btn btn-secondary text-sm px-4 py-2"
            >
              📊 Dữ liệu mẫu
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="btn btn-secondary text-sm px-4 py-2"
            >
              🔄 Đặt lại
            </button>
          </div>
        </div>

        {/* Templates Panel */}
        {showTemplates && (
          <div className="mt-4 pt-4 border-t border-blue-200">
            <h4 className="font-medium text-blue-700 mb-3">
              Chọn mẫu bệnh nhân:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {patientTemplates.map((template, index) => (
                <div
                  key={index}
                  className="border border-blue-200 rounded-lg p-3 hover:bg-blue-50 cursor-pointer"
                  onClick={() => applyTemplate(template)}
                >
                  <h5 className="font-medium text-blue-800">{template.name}</h5>
                  <p className="text-sm text-blue-600">
                    {template.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Prediction Type Selection */}
      <div className="bg-gray-50 border rounded-lg p-4">
        <h3 className="font-semibold mb-3 text-gray-800">Loại dự đoán</h3>
        <div className="space-y-3">
          <label className="flex items-start cursor-pointer p-3 border rounded-lg hover:bg-white transition-colors">
            <input
              type="radio"
              name="predictionType"
              value="multi-output"
              checked={predictionType === "multi-output"}
              onChange={(e) =>
                setPredictionType(e.target.value as PredictionType)
              }
              className="mr-3 mt-1"
            />
            <div>
              <span className="font-medium">🎯 Dự đoán đa mục tiêu</span>
              <p className="text-sm text-gray-600">
                Dự đoán tất cả các phương pháp điều trị cùng lúc (khuyến nghị)
              </p>
            </div>
          </label>

          <label className="flex items-start cursor-pointer p-3 border rounded-lg hover:bg-white transition-colors">
            <input
              type="radio"
              name="predictionType"
              value="single-target"
              checked={predictionType === "single-target"}
              onChange={(e) =>
                setPredictionType(e.target.value as PredictionType)
              }
              className="mr-3 mt-1"
            />
            <div>
              <span className="font-medium">🔍 Dự đoán mục tiêu đơn</span>
              <p className="text-sm text-gray-600">
                Chọn một phương pháp điều trị cụ thể để phân tích
              </p>
            </div>
          </label>
        </div>

        {predictionType === "single-target" && (
          <div className="mt-4 p-4 bg-white border rounded-lg">
            <label className="block font-medium mb-2">
              Chọn mục tiêu điều trị:
            </label>
            <select
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value)}
              className="form-select w-full"
              required
            >
              <option value="">-- Chọn phương pháp điều trị --</option>
              {targets.map((target) => (
                <option key={target} value={target}>
                  {target === "extraction" && "🦷 Nhổ răng"}
                  {target === "which_tooth" && "🔍 Răng nào cần nhổ"}
                  {target === "upper_arch_expand" && "⬆️ Nong hàm trên"}
                  {target === "lower_arch_expand" && "⬇️ Nong hàm dưới"}
                  {target === "upper_stripping" && "✂️ Mài răng trên"}
                  {target === "lower_stripping" && "✂️ Mài răng dưới"}
                  {target === "minivis_ht" && "🔩 Mini-vis HT"}
                  {target === "minivis_hd" && "🔩 Mini-vis HD"}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {inputMode === "guided" ? (
          // Guided Step-by-Step Mode
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                {fieldTabs.map((tab, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveTab(index)}
                    className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === index
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{tab.icon}</span>
                      {tab.title}
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Active Tab Content */}
            <div className="space-y-6">
              {fieldTabs[activeTab].sections.map((section, sectionIndex) => (
                <div
                  key={sectionIndex}
                  className="bg-white border rounded-lg p-6"
                >
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                    <span className="bg-blue-500 text-white text-sm px-2 py-1 rounded-full mr-3">
                      {sectionIndex + 1}
                    </span>
                    {section.title}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {section.fields.map((field) => (
                      <div key={field.name} className="form-group">
                        <label htmlFor={field.name} className="form-label">
                          {field.label}
                          {field.help && (
                            <span className="block text-xs text-gray-500 mt-1">
                              💡 {field.help}
                            </span>
                          )}
                        </label>
                        {field.type === "select" ? (
                          <select
                            id={field.name}
                            name={field.name}
                            value={features[field.name]}
                            onChange={handleInputChange}
                            className="form-select"
                          >
                            {field.options!.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            value={features[field.name]}
                            onChange={handleInputChange}
                            min={field.min}
                            max={field.max}
                            step={field.step}
                            className="form-input"
                            placeholder={field.help ? `VD: ${field.help}` : ""}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-4">
              <button
                type="button"
                onClick={() => setActiveTab(Math.max(0, activeTab - 1))}
                disabled={activeTab === 0}
                className="btn btn-secondary px-6 py-2 disabled:opacity-50"
              >
                ← Quay lại
              </button>

              <span className="text-sm text-gray-500">
                Bước {activeTab + 1} / {fieldTabs.length}
              </span>

              {activeTab < fieldTabs.length - 1 ? (
                <button
                  type="button"
                  onClick={() =>
                    setActiveTab(Math.min(fieldTabs.length - 1, activeTab + 1))
                  }
                  className="btn btn-primary px-6 py-2"
                >
                  Tiếp theo →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={
                    loading ||
                    (predictionType === "single-target" && !selectedTarget)
                  }
                  className="btn btn-primary px-8 py-3 text-lg font-semibold"
                >
                  {loading ? (
                    <>
                      <div className="spinner"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    "🤖 Thực hiện dự đoán"
                  )}
                </button>
              )}
            </div>
          </div>
        ) : (
          // Advanced All-in-One Mode
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                ⚡ <strong>Chế độ chuyên gia:</strong> Tất cả các trường được
                hiển thị cùng lúc. Phù hợp cho người dùng có kinh nghiệm.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {fieldTabs.map((tab) =>
                tab.sections.map((section, sectionIndex) => (
                  <div
                    key={`${tab.title}-${sectionIndex}`}
                    className="bg-white border rounded-lg p-4"
                  >
                    <h4 className="font-semibold mb-3 text-gray-800 text-sm flex items-center">
                      <span className="mr-2">{tab.icon}</span>
                      {section.title}
                    </h4>

                    <div className="space-y-3">
                      {section.fields.map((field) => (
                        <div key={field.name} className="form-group">
                          <label
                            htmlFor={field.name}
                            className="form-label text-xs"
                          >
                            {field.label}
                          </label>
                          {field.type === "select" ? (
                            <select
                              id={field.name}
                              name={field.name}
                              value={features[field.name]}
                              onChange={handleInputChange}
                              className="form-select text-xs"
                            >
                              {field.options!.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={field.type}
                              id={field.name}
                              name={field.name}
                              value={features[field.name]}
                              onChange={handleInputChange}
                              min={field.min}
                              max={field.max}
                              step={field.step}
                              className="form-input text-xs"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="text-center pt-6">
              <button
                type="submit"
                disabled={
                  loading ||
                  (predictionType === "single-target" && !selectedTarget)
                }
                className="btn btn-primary px-8 py-3 text-lg font-semibold"
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Đang xử lý...
                  </>
                ) : (
                  "🤖 Thực hiện dự đoán"
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default DentalFeatureForm;
