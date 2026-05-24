import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { divIcon } from "leaflet";

const orangePin = divIcon({
    className: "",
    html: `<div style="
        width:28px;height:28px;
        background:#EA580C;
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        border:3px solid white;
        box-shadow:0 2px 8px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -30],
});

interface Props {
    lat: number;
    lng: number;
    name: string;
}

export default function VenueMap({ lat, lng, name }: Props) {
    return (
        <div className="rounded-2xl overflow-hidden border border-gray-200 h-64 w-full mt-6">
            <MapContainer center={[lat, lng]} zoom={13} scrollWheelZoom={false} className="h-full w-full">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[lat, lng]} icon={orangePin}>
                    <Popup>{name}</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}