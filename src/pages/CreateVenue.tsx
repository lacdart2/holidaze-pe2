import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus, Loader2, X, Star } from "lucide-react";
import toast from "react-hot-toast";
import { createVenue } from "../api/venues";
import { useAuthStore } from "../store/authStore";
import { venueSchema } from "../utils/validation";

interface VenueImage {
    url: string;
    alt: string;
}

export default function CreateVenue() {
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [maxGuests, setMaxGuests] = useState("");
    const [newImageUrl, setNewImageUrl] = useState("");
    const [images, setImages] = useState<VenueImage[]>([]);
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [wifi, setWifi] = useState(false);
    const [parking, setParking] = useState(false);
    const [breakfast, setBreakfast] = useState(false);
    const [pets, setPets] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [rating, setRating] = useState("");

    if (!user || !user.venueManager) {
        navigate("/");
        return null;
    }

    function handleAddImage() {
        const trimmedUrl = newImageUrl.trim();

        if (!trimmedUrl) {
            toast.error("Please add an image URL");
            return;
        }

        if (images.length >= 8) {
            toast.error("You can add maximum 8 images");
            return;
        }

        try {
            new URL(trimmedUrl);
        } catch {
            toast.error("Please add a valid image URL");
            return;
        }

        setImages((current) => [
            ...current,
            {
                url: trimmedUrl,
                alt: name || "Holidaze venue image",
            },
        ]);
        setNewImageUrl("");
        setErrors((current) => ({ ...current, imageUrl: "" }));
    }

    function handleRemoveImage(url: string) {
        setImages((current) => current.filter((image) => image.url !== url));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setErrors({});

        const result = venueSchema.safeParse({
            name,
            description,
            price,
            maxGuests,
            imageUrl: images[0]?.url || "",
            city,
            country,
        });

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.issues.forEach((err) => {
                if (err.path[0]) fieldErrors[String(err.path[0])] = err.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setLoading(true);

        try {
            await createVenue({
                name,
                description,
                price: Number(price),
                maxGuests: Number(maxGuests),
                media: images.map((image) => ({
                    url: image.url,
                    alt: image.alt || name,
                })),
                location: { city, country },
                meta: { wifi, parking, breakfast, pets },
                rating: rating ? Number(rating) : undefined,
            });

            toast.success("Venue created!");
            navigate("/manager");
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Something went wrong";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-[#FAFAF9] px-4 py-6 sm:px-6 sm:py-10">
            <div className="mx-auto max-w-3xl">
                <div className="mb-8">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">
                        Hosting
                    </p>
                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
                        Create Venue
                    </h1>
                    <p className="mt-2 text-sm font-medium text-stone-500">
                        Add a new accommodation with images, price, location and amenities.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgba(28,25,23,0.08)] sm:p-8"
                >
                    <div className="grid gap-5">
                        <div className="grid gap-1.5">
                            <label className="text-sm font-bold text-stone-700">
                                Venue name
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Cozy Mountain Cabin"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] outline-none transition-all duration-200 placeholder:text-stone-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                                required
                            />
                            {errors.name && <p className="text-xs font-medium text-red-600">{errors.name}</p>}
                        </div>

                        <div className="grid gap-1.5">
                            <label className="text-sm font-bold text-stone-700">
                                Description
                            </label>
                            <textarea
                                placeholder="Describe your venue..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="h-32 resize-none rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] outline-none transition-all duration-200 placeholder:text-stone-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                                required
                            />
                            {errors.description && (
                                <p className="text-xs font-medium text-red-600">{errors.description}</p>
                            )}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-1.5">
                                <label className="text-sm font-bold text-stone-700">
                                    Price per night (NOK)
                                </label>
                                <input
                                    type="number"
                                    placeholder="e.g. 800"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] outline-none transition-all duration-200 placeholder:text-stone-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                                    min="1"
                                    required
                                />
                                {errors.price && <p className="text-xs font-medium text-red-600">{errors.price}</p>}
                            </div>

                            <div className="grid gap-1.5">
                                <label className="text-sm font-bold text-stone-700">
                                    Max guests
                                </label>
                                <input
                                    type="number"
                                    placeholder="e.g. 4"
                                    value={maxGuests}
                                    onChange={(e) => setMaxGuests(e.target.value)}
                                    className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] outline-none transition-all duration-200 placeholder:text-stone-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                                    min="1"
                                    required
                                />
                                {errors.maxGuests && (
                                    <p className="text-xs font-medium text-red-600">{errors.maxGuests}</p>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-1.5">
                            <label className="text-sm font-bold text-stone-700">
                                Rating
                            </label>
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(String(star))}
                                        className="cursor-pointer transition-transform duration-150 hover:scale-110"
                                    >
                                        <Star
                                            size={28}
                                            className={
                                                star <= Number(rating)
                                                    ? "fill-orange-500 text-orange-500"
                                                    : "fill-stone-200 text-stone-200"
                                            }
                                        />
                                    </button>
                                ))}
                                {rating && (
                                    <span className="ml-2 text-sm font-bold text-stone-600">
                                        {rating}/5
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-3 rounded-2xl bg-orange-50/60 p-4">
                            <div>
                                <label className="text-sm font-bold text-stone-700">
                                    Venue images
                                </label>
                                <p className="mt-1 text-xs font-medium text-stone-500">
                                    Add up to 8 images. The first image is used as the cover.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <input
                                    type="url"
                                    placeholder="https://example.com/image.jpg"
                                    value={newImageUrl}
                                    onChange={(e) => setNewImageUrl(e.target.value)}
                                    className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] outline-none transition-all duration-200 placeholder:text-stone-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddImage}
                                    disabled={images.length >= 8}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap shrink-0"
                                >
                                    <ImagePlus size={17} />
                                    Add image
                                </button>
                            </div>

                            {errors.imageUrl && (
                                <p className="text-xs font-medium text-red-600">{errors.imageUrl}</p>
                            )}

                            {images.length > 0 && (
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {images.map((image, index) => (
                                        <div
                                            key={image.url}
                                            className="relative overflow-hidden rounded-2xl bg-white shadow-[0_4px_14px_rgba(28,25,23,0.08)]"
                                        >
                                            <img
                                                src={image.url}
                                                alt={image.alt}
                                                className="h-36 w-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src =
                                                        "https://placehold.co/500x300/FFF7ED/EA580C?text=Invalid+image";
                                                }}
                                            />

                                            {index === 0 && (
                                                <span className="absolute left-3 top-3 rounded-full bg-orange-600 px-3 py-1 text-xs font-bold text-white">
                                                    Cover image
                                                </span>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(image.url)}
                                                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-stone-800 shadow-sm transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
                                                aria-label="Remove image"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-1.5">
                                <label className="text-sm font-bold text-stone-700">City</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Oslo"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] outline-none transition-all duration-200 placeholder:text-stone-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                                />
                            </div>

                            <div className="grid gap-1.5">
                                <label className="text-sm font-bold text-stone-700">Country</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Norway"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] outline-none transition-all duration-200 placeholder:text-stone-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                                />
                            </div>
                        </div>

                        <div>
                            <p className="mb-3 text-sm font-bold text-stone-700">Amenities</p>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {[
                                    ["Wifi", wifi, setWifi],
                                    ["Parking", parking, setParking],
                                    ["Breakfast", breakfast, setBreakfast],
                                    ["Pets allowed", pets, setPets],
                                ].map(([label, checked, setter]) => (
                                    <label
                                        key={String(label)}
                                        className="flex cursor-pointer items-center gap-3 rounded-xl bg-orange-50/60 px-4 py-3 text-sm font-bold text-stone-700"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={Boolean(checked)}
                                            onChange={(e) =>
                                                (setter as React.Dispatch<React.SetStateAction<boolean>>)(
                                                    e.target.checked
                                                )
                                            }
                                            className="custom-check"
                                        />
                                        {label as string}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mt-2 grid gap-3 sm:grid-cols-2">
                            <button
                                type="button"
                                onClick={() => navigate("/manager")}
                                className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-stone-800 shadow-[0_4px_14px_rgba(28,25,23,0.08)] transition-colors duration-200 hover:bg-orange-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(234,88,12,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {loading && <Loader2 size={16} className="animate-spin" />}
                                {loading ? "Creating..." : "Create Venue"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
}