export interface GalleryEvent {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface GalleryImageItem {
  id: string;
  url: string;
  description: string;
  order: number;
}
