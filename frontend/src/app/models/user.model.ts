export interface User {
  id: number;
  email: string;
  fullName: string;
  institution?: string;
  statut: string;
  bio?: string;
  skills?: { id: number; label: string }[];
}