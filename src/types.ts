export interface SlideDeck {
  id: string;
  title: string;
  content: string;
  background?: string;
  mediaType?: "image" | "video";
  createdAt: Date;
  updatedAt: Date;
}

export interface Presentation {
  id: string;
  title: string;
  slideDeckIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

// AppSettings is now defined in @/settings/types.ts
// Ensure all imports are updated to point to the new location:
// import { AppSettings } from '@/settings';

export interface SlideInfo {
  html: string;
  background?: string;
  mediaType?: "image" | "video";
}
