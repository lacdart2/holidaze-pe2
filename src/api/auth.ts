import { apiFetch } from "./client";

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    venueManager?: boolean;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    data: {
        name: string;
        email: string;
        accessToken: string;
        venueManager: boolean;
    };
}

export async function register(data: RegisterData): Promise<AuthResponse> {
    return apiFetch<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function login(data: LoginData): Promise<AuthResponse> {
    return apiFetch<AuthResponse>("/auth/login?_holidaze=true", {
        method: "POST",
        body: JSON.stringify(data),
    });
}