export type CustomMarkers = {
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

export type LocationDetail = {
  lat: number;
  lng: number;
  mainStreet: string;
  secondaryStreet?: string;
  neighborhood: string;
  referencePoints?: string;
};

export interface StudentProfileResponse {
  isNewStudent: boolean;
  price: number | null;
}

export type Student = {
  name: string;
  surname: string;
  documentType: string;
  documentNumber: string;
  grade: string;
  email: string;
  parentPhone: string;
  secondaryPhone?: string;
  housePhone?: string;
  additionalInfo?: string;
  isNewStudent: boolean;
  locations: {
    morning?: LocationDetail;
    afternoon?: LocationDetail;
  };
  billingInfo: BillingInfo;
  price: string | number | null;
  status?: string;
  contractKey?: string | null;
  signatureType?: string | null;
  createdAt: string;
  routes?: RouteAttr[];
  schoolYear?: string;
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

export type RouteAttr = {
  id?: string;
  name: string;
  period: "morning" | "afternoon";
  color: string;
};

export type Marker = {
  id?: string;
  lat: number;
  lng: number;
  color: string;
  popupContent: React.ReactNode;
};
