import { z } from "zod";

export const registerSchema = z
    .object({
        name: z
            .string()
            .min(1, "Name is required")
            .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers and underscores"),
        email: z
            .string()
            .email("Invalid email")
            .endsWith("@stud.noroff.no", "Must be a stud.noroff.no email"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string(),
    })
    .refine((d) => d.password === d.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required"),
});

export const venueSchema = z.object({
    name: z.string().min(1, "Venue name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.coerce.number().min(1, "Price must be at least 1"),
    maxGuests: z.coerce.number().min(1, "At least 1 guest required"),
    imageUrl: z.string().url("Must be a valid URL").or(z.literal("")),
    city: z.string().optional(),
    country: z.string().optional(),
});

export type RegisterFields = z.infer<typeof registerSchema>;
export type LoginFields = z.infer<typeof loginSchema>;
export type VenueFields = z.infer<typeof venueSchema>;