export interface NextEvent {
  id: string;
  title: string;
  date: string;
  imageUrl?: string | null;
  registrationConfig?: unknown;
  isDateTentative?: boolean;
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
