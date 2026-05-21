import { apiFetch } from "./client";

export interface CreateBookingData {
    dateFrom: string;
    dateTo: string;
    guests: number;
    venueId: string;
}

export interface BookingResponse {
    data: {
        id: string;
        dateFrom: string;
        dateTo: string;
        guests: number;
        venue?: {
            id: string;
            name: string;
            media: { url: string; alt: string }[];
        };
    };
}

export interface BookingsResponse {
    data: BookingResponse["data"][];
}

export async function createBooking(
    data: CreateBookingData
): Promise<BookingResponse> {
    return apiFetch<BookingResponse>("/holidaze/bookings", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function getBookingById(id: string): Promise<BookingResponse> {
    return apiFetch<BookingResponse>(`/holidaze/bookings/${id}?_venue=true`);
}