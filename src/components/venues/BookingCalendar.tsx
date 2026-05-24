import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useMemo } from "react";
import { getBlockedCheckInDates, getBlockedCheckOutDates } from "../../utils/bookingDates";

interface Booking {
    dateFrom: string;
    dateTo: string;
}

interface Props {
    bookings: Booking[];
    dateFrom: Date | null;
    dateTo: Date | null;
    onChangeDateFrom: (date: Date | null) => void;
    onChangeDateTo: (date: Date | null) => void;
}

export default function BookingCalendar({ bookings, dateFrom, dateTo, onChangeDateFrom, onChangeDateTo }: Props) {
    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const blockedCheckIn = useMemo(() => getBlockedCheckInDates(bookings), [bookings]);
    const blockedCheckOut = useMemo(() => getBlockedCheckOutDates(bookings), [bookings]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <DatePicker
                    selected={dateFrom}
                    onChange={(date: Date | null) => {
                        onChangeDateFrom(date);
                        onChangeDateTo(null);
                    }}
                    excludeDates={blockedCheckIn}
                    minDate={today}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select check-in date"
                    className="w-full border rounded-lg px-4 py-3 text-sm outline-none focus:border-orange-500 cursor-pointer"
                    calendarClassName="!font-sans"
                />
            </div>

            <div className="flex flex-col gap-1">
                <DatePicker
                    selected={dateTo}
                    onChange={onChangeDateTo}
                    excludeDates={blockedCheckOut}
                    minDate={dateFrom ? new Date(dateFrom.getTime() + 86400000) : today}
                    openToDate={dateFrom ? new Date(dateFrom.getTime() + 86400000) : today}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select check-out date"
                    className="w-full border rounded-lg px-4 py-3 text-sm outline-none focus:border-orange-500 cursor-pointer"
                    calendarClassName="!font-sans"
                />
            </div>
        </div>
    );
}