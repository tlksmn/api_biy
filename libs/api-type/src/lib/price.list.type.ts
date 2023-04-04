export type PriceListApiT = {
  deliveryDurationFacetValues: Record<string, number>;
  offers: ProductSellerT[];
  offersCount: number;
  total: number;
};

export type ProductSellerT = {
  availabilityDate: string;
  delivery: string;
  deliveryDuration: string;
  deliverySteps: Record<any, any>;
  deliveryType: string;
  kaspiDelivery: boolean;
  kdDestinationCity: string; //cityId delivery
  kdPickupDate: string;
  kdPoints: string[];
  kdTimeoutDelivery: string;
  kdTimeoutPickup: string;
  locatedInCity: string; // cityId Replacement
  locatedInPoint: string;
  masterCategory: string;
  masterSku: string;
  merchantId: string; // seller id
  merchantName: string; //seller name
  merchantRating: string; //seller rating
  merchantReviewsQuantity: number; // seller reviewer count
  preorder: number;
  price: number;
};
