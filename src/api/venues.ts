import { apiFetch } from "./client";

export interface Venue {
    id: string;
    name: string;
    description: string;
    media: { url: string; alt: string }[];
    price: number;
    maxGuests: number;
    rating: number;
    location: {
        city: string;
        country: string;
        lat?: number;
        lng?: number;
        address?: string;
        zip?: string;
        continent?: string;
    };
    meta: {
        wifi: boolean;
        parking: boolean;
        breakfast: boolean;
        pets: boolean;
    };
    bookings?: Booking[];
    _count?: {
        bookings: number;
    };
    owner?: {
        name: string;
        email: string;
        avatar?: { url: string; alt: string };
    };
}

export interface Booking {
    id: string;
    dateFrom: string;
    dateTo: string;
    guests: number;
}

export interface VenueResponse {
    data: Venue;
}

export interface VenuesResponse {
    data: Venue[];
    meta: {
        totalCount: number;
        pageCount: number;
    };
}

export async function getVenues(sort?: string, sortOrder?: string): Promise<VenuesResponse> {
    const params = new URLSearchParams({
        limit: "100",
        _bookings: "true",
    });
    if (sort) params.append("sort", sort);
    if (sortOrder) params.append("sortOrder", sortOrder);
    return apiFetch<VenuesResponse>(`/holidaze/venues?${params}`);
}

export async function getVenueById(id: string): Promise<VenueResponse> {
    return apiFetch<VenueResponse>(`/holidaze/venues/${id}?_bookings=true&_owner=true`);
}

export async function searchVenues(query: string): Promise<VenuesResponse> {
    return apiFetch<VenuesResponse>(`/holidaze/venues/search?q=${query}`);
}

export async function createVenue(data: Partial<Venue>): Promise<VenueResponse> {
    return apiFetch<VenueResponse>("/holidaze/venues", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function updateVenue(id: string, data: Partial<Venue>): Promise<VenueResponse> {
    return apiFetch<VenueResponse>(`/holidaze/venues/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function deleteVenue(id: string): Promise<void> {
    return apiFetch<void>(`/holidaze/venues/${id}`, {
        method: "DELETE",
    });
}