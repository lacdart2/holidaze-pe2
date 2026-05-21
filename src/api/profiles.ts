import { apiFetch } from "./client";
import type { Venue, Booking } from "./venues";

export interface Profile {
    name: string;
    email: string;
    bio: string;
    avatar: {
        url: string;
        alt: string;
    };
    venueManager: boolean;
    _count: {
        venues: number;
        bookings: number;
    };
}

export interface ProfileResponse {
    data: Profile;
}

export async function getProfile(name: string): Promise<ProfileResponse> {
    return apiFetch<ProfileResponse>(`/holidaze/profiles/${name}`);
}

export async function updateAvatar(
    name: string,
    avatarUrl: string
): Promise<ProfileResponse> {
    return apiFetch<ProfileResponse>(`/holidaze/profiles/${name}`, {
        method: "PUT",
        body: JSON.stringify({
            avatar: { url: avatarUrl, alt: "User avatar" },
        }),
    });
}

export async function getProfileBookings(name: string) {
    return apiFetch<{ data: Booking[] }>(
        `/holidaze/profiles/${name}/bookings?_venue=true`
    );
}

export async function getProfileVenues(name: string) {
    return apiFetch<{ data: Venue[] }>(
        `/holidaze/profiles/${name}/venues?_bookings=true`
    );
}