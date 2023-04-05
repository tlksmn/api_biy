import { StateE } from './state.enum';

export type AddressT = {
  streetName: string;
  streetNumber: string;
  town: string;
  direct: string;
  building: string;
  apartment: string;
  formattedAddress: string;
  city: string;
  location: string;
};

export type PickPointApiT = {
  name: string;
  displayName: string;
  cityName: string;
  address: AddressT;
  phoneNumber: number;
  workingHours: string;
  available: boolean;
  status: StateE;
  wareHouse: boolean;
  city: string;
  geoPoint: string;
};

type PriceT = {
  price?: number;
};

export type ICityInfo = {
  id: string;
  name: string;
  priceRow?: PriceT;
  pickupPoints: PickPointApiT[];
  geoPoint: string;
  boundingBox: string;
  boundingRegion: string;
  priceToDoor: number;
  timeToDoor: number;
  priceToPP: number;
  timeToPP: number;
  regional: boolean;
  kaspiDelivery: boolean;
  virtual: boolean;
};

type PrimaryImageT = {
  small: string;
  medium: string;
  large: string;
};

export type MasterProductT = {
  sku: string;
  name: string;
  brand: string;
  brandRestricted: boolean;
  primaryImage: PrimaryImageT;
  productUrl: string;
  priceMin?: number;
  priceMax?: number;
  actualPrice?: number;
  localizedActualPrice?: number;
  quantity?: number;
  weight?: number;
  unitFixedType?: string;
  expireDate?: number;
  offerStatus?: string;
  masterProduct?: string;
  cityInfo?: string;
  avgProcessingTime?: number;
  description?: string;
  category?: string;
  contentCategoryPath?: string;
  contentCategoriesPaths?: string;
  nextGen: number;
  entryId: number;
};

export type ResponseProductT = {
  sku: string;
  name: string;
  brand: string;
  brandRestricted: boolean;
  primaryImage: string;
  productUrl: string;
  priceMin: number;
  priceMax: number;
  actualPrice: number;
  localizedActualPrice: number;
  quantity: number;
  weight: number;
  unitFixedType: string;
  expireDate: number;
  offerStatus: StateE;
  masterProduct: MasterProductT;
  cityInfo: ICityInfo[];
  avgProcessingTime?: number;
  description?: string;
  category?: string;
  contentCategoryPath?: string;
  contentCategoriesPaths?: string;
  nextGen: number;
  entryId: number;
};

export type ResponseAPI = {
  offers: ResponseProductT[];
  totalCount: number;
};
