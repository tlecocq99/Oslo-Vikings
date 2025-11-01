export interface StaffMember {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  image?: string;
  imageAlt?: string;
  teams: string[];
}
