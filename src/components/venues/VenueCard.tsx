import { Link } from "react-router-dom";
import type { Venue } from "../../api/venues";

interface Props {
    venue: Venue;
}

export default function VenueCard({ venue }: Props) {
    // use first image or fallback
    const image = venue.media?.[0]?.url || "https://placehold.co/400x200?text=No+Image";
    const city = venue.location?.city || "Unknown location";
    const country = venue.location?.country || "";

    return (
        <div className="flex flex-col bg-white border rounded-xl overflow-hidden transition-shadow duration-200 hover:shadow-md">
            {/* image */}
            <img
                src={image}
                alt={venue.media?.[0]?.alt || venue.name}
                onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/400x200?text=No+Image";
                }}
                className="w-full h-48 object-cover"
            />

            {/* content */}
            <div className="flex flex-col gap-2 p-4">
                <h3 className="font-semibold text-gray-900 text-lg">{venue.name}</h3>
                <p className="text-gray-500 text-sm">{city}{country ? `, ${country}` : ""}</p>
                <p className="font-bold text-orange-600">${venue.price} / night</p>

                <Link
                    to={`/venues/${venue.id}`}
                    className="flex justify-center bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200 cursor-pointer mt-2"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
}