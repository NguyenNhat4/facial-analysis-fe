// Common type definitions for the dental AI application

export interface Model {
  target: string;
  model_name: string;
  accuracy?: number;
  f1_score?: number;
  classes: number;
}

export interface Features {
  gender: number;
  age: number;
  tr_me_za_zaza: number;
  za_ag_me_right: number;
  za_ag_me_left: number;
  lower_1_3_ratio: number;
  g_prime_n_prime_preprn: number;
  preli_sm_pog_prime: number;
  cm_sn_ls: number;
  fh_soft_tissue_angle_ab: number;
  c_u: number;
  c_l: number;
  t_u: number;
  t_l: number;
  ob: number;
  oj: number;
  angle_r: number;
  angle_l: number;
  spee_r: number;
  spee_l: number;
  sna: number;
  snb: number;
  anb: number;
  wits: number;
  pfh_afh: number;
  fma: number;
  gn_gn_sn: number;
  fa: number;
  fd: number;
  lfh: number;
  u1_na_mm: number;
  l1_nb_mm: number;
  u1_na_deg: number;
  l1_nb_deg: number;
  u1_apog_mm: number;
  l1_apog_mm: number;
  u1_l1_deg: number;
  impa: number;
  ul_e_plane: number;
  ll_e_plane: number;
  ei: number;
  complaint_1: number;
  complaint_2: number;
  complaint_3: number;
  complaint_4: number;
  complaint_5: number;
  complaint_6: number;
  complaint_7: number;
  complaint_8: number;
  complaint_9: number;
}

export interface PredictionResult {
  prediction: number;
  probability?: number[];
  accuracy?: number;
  f1_score?: number;
  error?: string;
}

export interface MultiOutputPrediction {
  type: "multi-output";
  data: {
    results: {
      [modelName: string]:
        | {
            [target: string]: PredictionResult;
          }
        | { error: string };
    };
  };
}

export interface SingleTargetPrediction {
  type: "single-target";
  data: {
    model_predictions: {
      [modelName: string]: PredictionResult;
    };
  };
  target: string;
}

export type Predictions = MultiOutputPrediction | SingleTargetPrediction | null;

export type PredictionType = "multi-output" | "single-target";
export type InputMode = "guided" | "advanced";
export type TabName = "predict" | "models";

// Form field types
export interface Option {
  value: number | string;
  label: string;
}

export interface Field {
  name: keyof Features;
  label: string;
  type: "number" | "select";
  min?: number;
  max?: number;
  step?: number;
  options?: Option[];
  help: string;
}

export interface Section {
  title: string;
  fields: Field[];
}

export interface FieldTab {
  title: string;
  icon: string;
  sections: Section[];
}

export interface PatientTemplate {
  name: string;
  description: string;
  data: Features;
}
