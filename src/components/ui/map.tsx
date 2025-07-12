import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

type MapProps = {
  markers: { lat: number; lng: number }[];
  onMapClick: (lat: number, lng: number) => void;
};

type LocationMarkersProps = {
  markers: { lat: number; lng: number }[];
};

type OnMapClickProps = {
  onMapClick: (lat: number, lng: number) => void;
};

function LocationMarkers({ markers }: LocationMarkersProps) {
  return (
    <>
      {markers &&
        markers.map((marker, index) => (
          <Marker key={index} position={[marker.lat, marker.lng]}>
            <Popup>
              Marker at: {marker.lat.toFixed(4)}, {marker.lng.toFixed(4)}
            </Popup>
          </Marker>
        ))}
    </>
  );
}

function OnMapClick({ onMapClick }: OnMapClickProps) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function Map({ markers, onMapClick }: MapProps) {
  return (
    <div className="h-[500px] rounded-lg overflow-hidden border border-gray-300">
      <MapContainer
        center={[-0.1807, -78.4678]} // Quito, Ecuador coordinates
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarkers markers={markers} />
        <OnMapClick onMapClick={onMapClick} />
      </MapContainer>
    </div>
  );
}
