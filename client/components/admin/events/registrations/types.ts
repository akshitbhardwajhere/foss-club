export interface Registrant {
  id: string;
  name: string;
  email: string;
  institute: string;
  enrollmentNo: string | null;
  branch: string;
  isIndividual: boolean;
  teamName: string | null;
  teamMembers: string[];
  areaOfInterest: string;
  createdAt: string;
}
