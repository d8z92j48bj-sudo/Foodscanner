export interface ProductData {
  barcode: string;
  name: string;
  brand: string;
  imageUrl?: string;
  calories100g?: number | string;
  storageTip: string;
  expirationOpened: string;
  expirationClosed: string;
  categories: string;
  ingredientsText?: string;
}

export interface GeminiEnhancement {
  aiStorageTip: string;
  recipeIdea: string;
  funFact: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING_PRODUCT = 'LOADING_PRODUCT',
  LOADING_AI = 'LOADING_AI',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}