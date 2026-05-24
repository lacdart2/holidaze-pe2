import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import type { Venue } from "../../api/venues";
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
    venues: Venue[];
}

export default function VenuesMapSection({ venues }: Props) {
    const mapped = venues.filter(
        v => v.location?.lat && v.location?.lng &&
            Math.abs(v.location.lat) > 1 && Math.abs(v.location.lng) > 1
    );

    if (mapped.length === 0) return null;

    const center: [number, number] = [62.0, 10.0];

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <div className="flex items-end justify-between mb-6">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600 mb-1">Discover</p>
                    <h2 className="text-2xl font-extrabold tracking-tight text-stone-900 sm:text-3xl">Explore venues on the map</h2>
                </div>
                <span className="text-sm text-gray-400">{mapped.length} venues with location</span>
            </div>
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md h-64 sm:h-80 md:h-96 w-full">
                <MapContainer center={center} zoom={4} scrollWheelZoom={false} className="h-full w-full">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {mapped.map(v => (
                        <Marker key={v.id} position={[v.location.lat!, v.location.lng!]} icon={orangePin}>
                            <Popup>
                                <div style={{ width: "200px", fontFamily: "sans-serif" }}>
                                    <img
                                        src={v.media?.[0]?.url || "https://placehold.co/200x100?text=No+Image"}
                                        alt={v.name}
                                        style={{ width: "100%", height: "110px", objectFit: "cover", borderRadius: "8px", marginBottom: "10px" }}
                                    />
                                    <p style={{ fontWeight: "700", fontSize: "14px", color: "#1c1917", marginBottom: "4px" }}>{v.name}</p>
                                    <p style={{ fontWeight: "600", fontSize: "13px", color: "#EA580C", marginBottom: "10px" }}>NOK {v.price} <span style={{ color: "#a8a29e", fontWeight: "400" }}>/ night</span></p>
                                    <Link
                                        to={`/venues/${v.id}`}
                                        style={{
                                            display: "block",
                                            textAlign: "center",
                                            background: "#EA580C",
                                            color: "#ffffff",
                                            fontSize: "12px",
                                            fontWeight: "700",
                                            padding: "8px 12px",
                                            borderRadius: "8px",
                                            textDecoration: "none",
                                        }}
                                    >
                                        View venue →
                                    </Link>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </section>
    );
}