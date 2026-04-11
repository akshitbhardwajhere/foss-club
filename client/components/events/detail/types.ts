export interface EventDetail {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl?: string;
  documentUrl?: string;
  isDateTentative?: boolean;
}

export interface EventStatusState {
  isToday: boolean;
  isPast: boolean;
  isLive: boolean;
}
