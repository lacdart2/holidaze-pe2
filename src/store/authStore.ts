import { create } from "zustand";

// what will be saved about the user
interface User {
    name: string;
    email: string;
    accessToken: string;
    venueManager: boolean;
    avatar?: string;
}

interface AuthStore {
    user: User | null;
    setUser: (user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,

    setUser: (user) => {
        // save to localStorage so user stays logged in
        localStorage.setItem("token", user.accessToken);
        localStorage.setItem("user", JSON.stringify(user));
        set({ user });
    },

    logout: () => {
        // clear everything on logout
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({ user: null });
    },
}));

// load user from localStorage on start
export function loadUserFromStorage(): User | null {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
}