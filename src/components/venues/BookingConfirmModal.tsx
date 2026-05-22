import { CalendarCheck, CircleCheck, ArrowLeft, LayoutDashboard } from "lucide-react";

interface Props {
    venueName: string;
    venueImage: string;
    venueLocation: string;
    dateFrom: Date;
    dateTo: Date;
    guests: number;
    pricePerNight: number;
    confirmed: boolean;
    loading: boolean;
    userName: string;
    onConfirm: () => void;
    onCancel: () => void;
    onGoToDashboard: () => void;
    onBackToVenue: () => void;
}

function formatDate(date: Date) {
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function getNights(from: Date, to: Date) {
    return Math.round((to.getTime() - from.getTime()) / 86400000);
}

export default function BookingConfirmModal({
    venueName, venueImage, venueLocation, dateFrom, dateTo,
    guests, pricePerNight, confirmed, loading,
    onConfirm, onCancel, onGoToDashboard, onBackToVenue, userName
}: Props) {
    const nights = getNights(dateFrom, dateTo);
    const total = nights * pricePerNight;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) onCancel();
            }}
        >

            <div className="bg-white rounded-2xl w-full max-w-md p-8">

                <div className="flex flex-col items-center gap-2 mb-6">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${confirmed ? "bg-green-50" : "bg-orange-50"}`}>
                        {confirmed
                            ? <CircleCheck size={28} className="text-green-600" />
                            : <CalendarCheck size={24} className="text-orange-600" />
                        }
                    </div>
                    <h2 className="font-semibold text-xl text-gray-900">
                        {confirmed ? "Booking confirmed!" : "Confirm your booking"}
                    </h2>
                    <p className="text-sm text-gray-500 text-center">
                        {confirmed
                            ? `Thank you ${userName}, your stay is booked.`
                            : "Please review your details before confirming"
                        }
                    </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-200">
                        <img
                            src={venueImage}
                            alt={venueName}
                            className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => { e.currentTarget.src = "https://placehold.co/48x48?text=?"; }}
                        />
                        <div>
                            <p className="font-medium text-gray-900 text-sm">{venueName}</p>
                            <p className="text-xs text-gray-500">{venueLocation}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3 pb-3 border-b border-gray-200">
                        <div>
                            <p className="text-xs text-gray-400 mb-0.5">Check-in</p>
                            <p className="text-sm font-medium text-gray-900">{formatDate(dateFrom)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 mb-0.5">Check-out</p>
                            <p className="text-sm font-medium text-gray-900">{formatDate(dateTo)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 mb-0.5">Guests</p>
                            <p className="text-sm font-medium text-gray-900">{guests} {guests === 1 ? "guest" : "guests"}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 mb-0.5">Duration</p>
                            <p className="text-sm font-medium text-gray-900">{nights} {nights === 1 ? "night" : "nights"}</p>
                        </div>
                    </div>

                    <div className="flex justify-between items-center bg-orange-50 rounded-lg px-3 py-2">
                        <p className="text-sm text-orange-800">Total</p>
                        <p className="text-lg font-semibold text-orange-600">NOK {total.toLocaleString()}</p>
                    </div>
                </div>

                {confirmed ? (
                    <div className="flex gap-3">
                        <button
                            onClick={onBackToVenue}
                            className="flex-1 flex items-center justify-center gap-1 border py-3 rounded-xl text-sm hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                        >
                            <ArrowLeft size={14} /> Back to venue
                        </button>
                        <button
                            onClick={onGoToDashboard}
                            className="flex-1 flex items-center justify-center gap-1 bg-orange-600 text-white py-3 rounded-xl text-sm hover:bg-orange-700 cursor-pointer transition-colors duration-200 font-medium"
                        >
                            <LayoutDashboard size={14} /> My bookings
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 border py-3 rounded-xl text-sm hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="flex-2 flex-1 bg-orange-600 text-white py-3 rounded-xl text-sm hover:bg-orange-700 cursor-pointer transition-colors duration-200 font-medium disabled:opacity-50"
                        >
                            {loading ? "Confirming..." : "Confirm Booking"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}