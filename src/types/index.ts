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
