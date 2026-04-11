import { Star, StarHalf } from "lucide-react";

export const StarRatingDisplay: React.FC<{
  rating: number;
  totalReviews?: number;
  size?: number;
  showReviewCount?: boolean;
}> = ({ rating, totalReviews, size = 16, showReviewCount = true }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.4 && rating % 1 < 0.9;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      <div className="flex items-center text-yellow-400">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            size={size}
            fill="currentColor"
            strokeWidth={0}
          />
        ))}
        {hasHalfStar && (
          <StarHalf
            key="half"
            size={size}
            fill="currentColor"
            strokeWidth={0}
          />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            size={size}
            className="text-gray-300"
            strokeWidth={1.5}
          />
        ))}
      </div>
      {showReviewCount && totalReviews !== undefined && totalReviews > 0 ? (
        <span className="ml-1.5 text-xs text-gray-500">({totalReviews})</span>
      ) : null}
    </div>
  );
};
