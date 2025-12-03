export interface RecruitField {
  label: string;
  value: string;
}

export interface Recruit {
  id: string;
  name: string;
  position?: string;
  fields: RecruitField[];
}
