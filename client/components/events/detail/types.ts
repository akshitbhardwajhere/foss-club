export interface Speaker {
  id?: string;
  name: string;
  role: string;
  org: string;
  imageUrl?: string;
  github?: string;
  linkedin?: string;
  bio: string;
}

export interface EventDetail {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl?: string;
  documentUrl?: string;
  isDateTentative?: boolean;
  category?: string;
  speakers?: Speaker[];
}

export interface EventStatusState {
  isToday: boolean;
  isPast: boolean;
  isLive: boolean;
}
