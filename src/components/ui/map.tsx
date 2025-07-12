import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Map() {
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
        {/* <LocationMarkers activeMarkerType={activeMarkerType} /> */}
      </MapContainer>
    </div>
  );
}
