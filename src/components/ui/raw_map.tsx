"use client";

import {
    MapContainer,
    TileLayer,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

type MapProps = {
    children?: React.ReactNode;
}

export default function Map({ children }: MapProps) {
    return (
        <div className="h-full rounded-lg overflow-hidden border border-gray-300">
            <MapContainer
                center={[-0.1807, -78.4678]} // Quito, Ecuador coordinates
                zoom={11}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {children}
            </MapContainer>
        </div>
    );
}
