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

    /*  return (
         <div className="flex flex-col bg-white border rounded-xl overflow-hidden transition-shadow duration-200 hover:shadow-md">
             <img
                 src={image}
                 alt={venue.media?.[0]?.alt || venue.name}
                 onError={(e) => {
                     e.currentTarget.src = "https://placehold.co/400x200?text=No+Image";
                 }}
                 className="w-full h-48 object-cover"
             />
             <div className="flex flex-col gap-2 p-4">
                 <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">{venue.name}</h3>
                 <p className="text-gray-500 text-sm">{city}{country ? `, ${country}` : ""}</p>
                 <p className="font-bold text-orange-600">NOK {venue.price} / night</p>
 
                 <Link
                     to={`/venues/${venue.id}`}
                     className="flex justify-center bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200 cursor-pointer mt-2"
                 >
                     View Details
                 </Link>
             </div>
         </div>
     ); */
    return (
        <Link
            to={`/venues/${venue.id}`}
            className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(28,25,23,0.08)] hover:shadow-[0_8px_24px_rgba(28,25,23,0.12)] hover:-translate-y-1 transition-all duration-200 cursor-pointer"
        >
            <img
                src={image}
                alt={venue.media?.[0]?.alt || venue.name}
                onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/400x200?text=No+Image";
                }}
                className="w-full h-48 object-cover"
            />
            <div className="flex flex-col gap-1 p-4">
                <h3 className="font-semibold text-stone-900 text-base line-clamp-1">{venue.name}</h3>
                <p className="text-stone-500 text-sm">{city}{country ? `, ${country}` : ""}</p>
                <p className="font-bold text-orange-600 mt-1">NOK {venue.price} <span className="text-stone-400 font-normal text-xs">/ night</span></p>
            </div>
        </Link>
    );
}