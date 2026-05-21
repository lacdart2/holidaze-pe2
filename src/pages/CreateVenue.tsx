import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createVenue } from "../api/venues";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

export default function CreateVenue() {
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [maxGuests, setMaxGuests] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [wifi, setWifi] = useState(false);
    const [parking, setParking] = useState(false);
    const [breakfast, setBreakfast] = useState(false);
    const [pets, setPets] = useState(false);

    if (!user || !user.venueManager) {
        navigate("/");
        return null;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            await createVenue({
                name,
                description,
                price: Number(price),
                maxGuests: Number(maxGuests),
                media: imageUrl ? [{ url: imageUrl, alt: name }] : [],
                location: { city, country },
                meta: { wifi, parking, breakfast, pets },
            });

            toast.success("Venue created!");
            navigate("/manager");
        } catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto px-6 py-10">
            <h1 className="font-bold text-3xl text-gray-900 mb-8">Create Venue</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-700">Venue name</label>
                    <input
                        type="text"
                        placeholder="e.g. Cozy Mountain Cabin"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border rounded-lg px-4 py-3 text-sm outline-none focus:border-orange-500"
                        required
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-700">Description</label>
                    <textarea
                        placeholder="Describe your venue..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border rounded-lg px-4 py-3 text-sm outline-none focus:border-orange-500 resize-none h-28"
                        required
                    />
                </div>

                <div className="flex gap-4">
                    <div className="flex flex-col gap-1 flex-1">
                        <label className="text-sm text-gray-700">Price per night (NOK)</label>
                        <input
                            type="number"
                            placeholder="e.g. 800"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="border rounded-lg px-4 py-3 text-sm outline-none focus:border-orange-500"
                            min="1"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1 flex-1">
                        <label className="text-sm text-gray-700">Max guests</label>
                        <input
                            type="number"
                            placeholder="e.g. 4"
                            value={maxGuests}
                            onChange={(e) => setMaxGuests(e.target.value)}
                            className="border rounded-lg px-4 py-3 text-sm outline-none focus:border-orange-500"
                            min="1"
                            required
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-700">Image URL</label>
                    <input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="border rounded-lg px-4 py-3 text-sm outline-none focus:border-orange-500"
                    />
                </div>

                <div className="flex gap-4">
                    <div className="flex flex-col gap-1 flex-1">
                        <label className="text-sm text-gray-700">City</label>
                        <input
                            type="text"
                            placeholder="e.g. Oslo"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="border rounded-lg px-4 py-3 text-sm outline-none focus:border-orange-500"
                        />
                    </div>

                    <div className="flex flex-col gap-1 flex-1">
                        <label className="text-sm text-gray-700">Country</label>
                        <input
                            type="text"
                            placeholder="e.g. Norway"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="border rounded-lg px-4 py-3 text-sm outline-none focus:border-orange-500"
                        />
                    </div>
                </div>

                <div>
                    <p className="text-sm text-gray-700 mb-3">Amenities</p>
                    <div className="flex gap-6 flex-wrap">
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input type="checkbox" checked={wifi} onChange={(e) => setWifi(e.target.checked)} />
                            Wifi
                        </label>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input type="checkbox" checked={parking} onChange={(e) => setParking(e.target.checked)} />
                            Parking
                        </label>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input type="checkbox" checked={breakfast} onChange={(e) => setBreakfast(e.target.checked)} />
                            Breakfast
                        </label>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input type="checkbox" checked={pets} onChange={(e) => setPets(e.target.checked)} />
                            Pets allowed
                        </label>
                    </div>
                </div>

                <div className="flex gap-3 mt-2">
                    <button
                        type="button"
                        onClick={() => navigate("/manager")}
                        className="flex-1 border py-3 rounded-lg hover:bg-gray-50 cursor-pointer text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 flex justify-center bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 cursor-pointer font-medium"
                    >
                        {loading ? "Creating..." : "Create Venue"}
                    </button>
                </div>

            </form>
        </div>
    );
}