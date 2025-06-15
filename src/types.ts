
export interface SlideDeck {
  id: string;
  title: string;
  content: string;
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
  style: {
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    textAlign: 'left' | 'center' | 'right' | 'justify';
  };
}
