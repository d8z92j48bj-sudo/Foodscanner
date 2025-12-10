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

export interface SavedRecipe {
  id: string;
  dateSaved: number;
  product: ProductData;
  aiData: GeminiEnhancement;
  note?: string;
}

export interface RecipeIngredient {
  id: string; // unique instance id for the list
  productName: string;
  calories100g: number;
  amountGrams: number;
}

export interface CustomRecipe {
  id: string;
  name: string;
  dateCreated: number;
  ingredients: RecipeIngredient[];
  totalCalories: number;
  instructions?: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING_PRODUCT = 'LOADING_PRODUCT',
  LOADING_AI = 'LOADING_AI',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}