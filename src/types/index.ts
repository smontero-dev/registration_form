export type Markers = {
  morning: {
    latlng: { lat: number; lng: number };
    color: string;
    popupContent: string;
  } | null;
  afternoon: {
    latlng: { lat: number; lng: number };
    color: string;
    popupContent: string;
  } | null;
  common: {
    latlng: { lat: number; lng: number };
    color: string;
    popupContent: string;
  } | null;
};

export type Student = {
  id: string;
  studentName: string;
  studentSurname: string;
  documentType: string;
  documentNumber: string;
  grade: string;
  email: string;
  parentPhone: string;
  secondaryPhone?: string;
  housePhone?: string;
  additionalInfo?: string;
  isNewStudent: boolean;
  streetInfo: {
    morning: Address;
    afternoon: Address;
  };
  billingInfo: BillingInfo;
  price: string;
  signatureType: string;
  createdAt: string;
  location: {
    morning: Coordinates;
    afternoon: Coordinates;
  };
  routes?: RouteAttr[];
};

export type Address = {
  mainStreet: string;
  secondaryStreet?: string;
  neighborhood: string;
  referencePoints?: string;
};

export type BillingInfo = {
  name: string;
  surname: string;
  documentType: string;
  documentNumber: string;
  phone: string;
  email: string;
  address: string;
};

export type Coordinates = {
  lat: string;
  lng: string;
};

export type RouteAttr = {
  name: string;
  period: 'morning' | 'afternoon';
  color: string;
};
