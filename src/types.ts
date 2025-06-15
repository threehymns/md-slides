
export interface SlideDeck {
  id: string;
  title: string;
  content: string;
}

export interface Presentation {
  id: string;
  title: string;
  slideDeckIds: string[];
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
