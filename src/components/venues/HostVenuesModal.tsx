import { X, Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { Venue } from "../../api/venues";

interface Props {
    hostName: string;
    venues: Venue[];
    onClose: () => void;
}

export default function HostVenuesModal({ hostName, venues, onClose }: Props) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900">
                        Venues by {hostName} ({venues.length})
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="overflow-y-auto p-5 flex flex-col gap-3">
                    {venues.length === 0 && (
                        <p className="text-gray-500 text-sm text-center py-6">No venues found.</p>
                    )}
                    {venues.map((venue) => (
                        <Link
                            key={venue.id}
                            to={`/venues/${venue.id}`}
                            onClick={onClose}
                            className="flex items-center gap-4 border border-gray-100 rounded-xl p-3 hover:bg-orange-50 hover:border-orange-100 transition-colors duration-200"
                        >
                            <img
                                src={venue.media?.[0]?.url || "https://placehold.co/60x60?text=?"}
                                alt={venue.name}
                                onError={(e) => { e.currentTarget.src = "https://placehold.co/60x60?text=?"; }}
                                className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 text-sm line-clamp-1">{venue.name}</p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {[venue.location?.city, venue.location?.country].filter(Boolean).join(", ") || "Location not specified"}
                                </p>
                                <p className="text-xs text-orange-600 font-medium mt-1">NOK {venue.price} / night</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <Star size={11} className="text-orange-400 fill-orange-400" />
                                    <span className="text-xs text-gray-600">{venue.rating}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}