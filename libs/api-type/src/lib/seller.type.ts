import { StateE } from '@full-biy/db';

export type SellerApiT = {
  name: string;
  affiliateId: string;
  hybrisUid: string;
  logoUrl: string;
  accountManager: string;
  orderProcessingManager: {
    name: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
  managerOpeningHours: {
    code: string;
    name: string;
    weekdayOpeningDays: Record<string, WeekdayOpeningDayT>;
  };
  pointOfServiceList: PointOfServiceT[];
  merchantUrl: string;
  merchantAllProductsUrl: string;
  uploadFileTypeEnums: string[];
};

type WeekdayOpeningDayT = {
  closingTime: {
    minute: number;
    hour: number;
    formattedHour: string;
  };
  openingTime: {
    minute: number;
    hour: number;
    formattedHour: string;
  };
  weekDay: string;
  closed: boolean;
};

type AddressT = {
  streetName: string;
  streetNumber: string;
  town: string;
  district: string;
  building: string;
  apartment: string;
  formattedAddress: string;
  city: string;
  location: string;
};

type PointOfServiceT = {
  name: string;
  displayName: string;
  cityName: string;
  address: AddressT;
  phoneNumber: string;
  workingHours: {
    code: string;
    name: string;
    weekdayOpeningDays: Record<string, WeekdayOpeningDayT>;
  };
  available: boolean;
  status: StateE;
  warehouse: boolean;
  city: string;
  geoPoint: string;
};
