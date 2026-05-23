import { Link } from "react-router-dom";
import StarRating from "../common/StarRating";
import type { Venue } from "../../api/venues";
import { Images } from "lucide-react";

interface Props {
    venue: Venue;
}

export default function VenueCard({ venue }: Props) {
    // use first image or fallback
    const image = venue.media?.[0]?.url || "https://placehold.co/400x200?text=No+Image";
    const city = venue.location?.city || "Unknown location";
    const country = venue.location?.country || "";

    return (
        <Link
            to={`/venues/${venue.id}`}
            className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(28,25,23,0.08)] hover:shadow-[0_8px_24px_rgba(28,25,23,0.12)] hover:-translate-y-1 transition-all duration-200 cursor-pointer"
        >
            {/*  hint for more images if there is */}
            <div className="relative">
                <img
                    src={image}
                    alt={venue.media?.[0]?.alt || venue.name}
                    onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/400x200?text=No+Image";
                    }}
                    className="w-full h-48 object-cover"
                />
                {venue.media && venue.media.length > 1 && (
                    <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                        <Images size={11} />
                        {venue.media.length}
                    </span>
                )}
            </div>
            <div className="flex flex-col gap-1 p-4">
                <h3 className="font-semibold text-stone-900 text-base line-clamp-1">{venue.name}</h3>
                <p className="text-stone-500 text-sm">{city}{country ? `, ${country}` : ""}</p>
                <div className="flex items-center justify-between mt-1">
                    <p className="font-bold text-orange-600">NOK {venue.price} <span className="text-stone-400 font-normal text-xs">/ night</span></p>
                    {venue.rating > 0 && <StarRating rating={venue.rating} size={12} />}
                </div>
            </div>
        </Link>
    );
}