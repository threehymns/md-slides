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

export interface AppSettings {
  showProgressBar: boolean;
  showSlideCounter: boolean;
  showNavigationHint: boolean;
  autoHideControls: boolean;
  showSlideNumbers: boolean;
  style: {
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    textAlign: "left" | "center" | "right" | "justify";
    textColor?: string;
    backgroundColor?: string;
  };
}

export interface SlideInfo {
  html: string;
  background?: string;
  mediaType?: "image" | "video";
}
