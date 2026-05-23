import { Star } from "lucide-react";

interface StarRatingProps {
    rating: number;
    size?: number;
    showNumber?: boolean;
}

export default function StarRating({
    rating,
    size = 14,
    showNumber = true,
}: StarRatingProps) {
    const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));
    const roundedRating = Math.round(safeRating);

    return (
        <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={size}
                        className={
                            star <= roundedRating
                                ? "fill-orange-500 text-orange-500"
                                : "fill-stone-200 text-stone-200"
                        }
                    />
                ))}
            </div>

            {showNumber && (
                <span className="ml-1 text-sm font-bold text-stone-900">
                    {safeRating.toFixed(1)}
                </span>
            )}
        </div>
    );
}