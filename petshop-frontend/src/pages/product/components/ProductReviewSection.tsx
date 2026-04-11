import React, { useState } from "react";
import {
  type ProductDetailData,
  type ReviewDetail,
} from "../../../context/DataContext";
import {
  Star,
  StarHalf,
  MessageSquareText,
  Send,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  UserCircle2,
} from "lucide-react";
import axios from "axios";

interface StarRatingInputProps {
  rating: number;
  setRating: (rating: number) => void;
  size?: number;
  disabled?: boolean;
}
const StarRatingInput: React.FC<StarRatingInputProps> = ({
  rating,
  setRating,
  size = 28,
  disabled = false,
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={`transition-colors ${
            disabled ? "cursor-not-allowed text-gray-200" : "cursor-pointer"
          }
            ${
              star <= (hoverRating || rating) && !disabled
                ? "text-yellow-500 fill-yellow-500"
                : star <= rating && !disabled
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 fill-transparent"
            }`}
          onClick={() => !disabled && setRating(star)}
          onMouseEnter={() => !disabled && setHoverRating(star)}
          onMouseLeave={() => !disabled && setHoverRating(0)}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
};

const ProductStarDisplay: React.FC<{
  rating: number;
  size?: number;
  className?: string;
}> = ({ rating, size = 20, className }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.4 && rating % 1 < 0.9;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  return (
    <div className={`flex items-center text-yellow-400 ${className}`}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`fs-${i}`} size={size} fill="currentColor" strokeWidth={0} />
      ))}
      {hasHalfStar && (
        <StarHalf key="hs" size={size} fill="currentColor" strokeWidth={0} />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star
          key={`es-${i}`}
          size={size}
          className="text-gray-300"
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
};

interface ProductReviewsSectionProps {
  product: ProductDetailData;
  currentUserFullName?: string;
  onReviewSubmitted: (updatedProductData: ProductDetailData) => void;
}

const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  product,
  currentUserFullName,
  onReviewSubmitted,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const API_URL = "http://localhost:3000/api";

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userRating === 0) {
      setError("Please select a star rating.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await axios.post<{
        review: ReviewDetail;
        message: string;
      }>(
        `${API_URL}/products/${product.id}/reviews`,
        { rating: userRating, comment: userComment.trim() || undefined },
        { withCredentials: true }
      );

      setSuccessMessage(
        response.data.message || "Review submitted successfully!"
      );
      const newReview: ReviewDetail = {
        ...response.data.review,
        user: { fullName: currentUserFullName || "You" },
      };

      const updatedReviews = [newReview, ...(product.reviews || [])];
      const totalReviews = updatedReviews.length;
      const sumOfRatings = updatedReviews.reduce((acc, r) => acc + r.rating, 0);
      const averageRating =
        totalReviews > 0
          ? parseFloat((sumOfRatings / totalReviews).toFixed(1))
          : 0;

      onReviewSubmitted({
        ...product,
        reviews: updatedReviews,
        totalReviews,
        averageRating,
        canReview: false,
      });

      setUserRating(0);
      setUserComment("");
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to submit review. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoggedIn = !!currentUserFullName;

  return (
    <div className="p-5 md:py-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left text-xl font-semibold text-gray-800 hover:text-blue-600 focus:outline-none mb-4"
      >
        <span className="text-lg font-medium text-gray-900">
          Customer Reviews ({product.totalReviews})
        </span>
        {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
      </button>

      {isOpen && (
        <div className="mt-2 space-y-8">
          {product.totalReviews > 0 && (
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 p-4 bg-gray-50 rounded-lg border">
              <ProductStarDisplay rating={product.averageRating} size={28} />
              <div className="text-center sm:text-left">
                <p className="text-2xl font-bold text-gray-800">
                  {product.averageRating.toFixed(1)}{" "}
                  <span className="text-lg font-normal text-gray-500">
                    out of 5
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Based on {product.totalReviews} review
                  {product.totalReviews === 1 ? "" : "s"}
                </p>
              </div>
            </div>
          )}

          {isLoggedIn && product.canReview && !successMessage && (
            <div className="p-4 md:p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Write Your Review
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Share your thoughts about {product.name}.
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-md text-sm flex items-start">
                  <AlertTriangle
                    size={20}
                    className="mr-2 flex-shrink-0 mt-0.5"
                  />{" "}
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Rating <span className="text-red-500">*</span>
                  </label>
                  <StarRatingInput
                    rating={userRating}
                    setRating={setUserRating}
                  />
                </div>
                <div>
                  <label
                    htmlFor="comment"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Your Review (Optional)
                  </label>
                  <textarea
                    id="comment"
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    rows={4}
                    className="w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-gray-400"
                    placeholder="What did you like or dislike? How did you use this product?"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || userRating === 0}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Send size={18} className="mr-2" /> Submit Review
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {successMessage && (
            <div className="p-4 bg-green-50 text-green-700 border border-green-200 rounded-md text-sm flex items-center">
              <CheckCircle2 size={20} className="mr-2 flex-shrink-0" />{" "}
              {successMessage}
            </div>
          )}

          {isLoggedIn && !product.canReview && !successMessage && (
            <div className="p-3 text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-md">
              You have already reviewed this product, or are not eligible to
              review it at this time.
            </div>
          )}
          {!isLoggedIn && (
            <div className="p-3 text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded-md">
              Please{" "}
              <a
                href="/login"
                className="font-semibold text-blue-600 hover:underline"
              >
                login
              </a>{" "}
              to write a review.
            </div>
          )}

          <div className="space-y-6">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 pt-0.5">
                      <UserCircle2 size={36} className="text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-sm font-semibold text-gray-800">
                          {review.user.fullName}
                        </p>
                        <time
                          dateTime={review.createdAt}
                          className="text-xs text-gray-500"
                        >
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "long", day: "numeric" }
                          )}
                        </time>
                      </div>
                      <div className="mb-1.5">
                        <ProductStarDisplay rating={review.rating} size={16} />
                      </div>
                      {review.comment && (
                        <p className="text-sm text-gray-700 whitespace-pre-wrap prose prose-sm max-w-none">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-500">
                <MessageSquareText
                  size={48}
                  className="mx-auto mb-3 opacity-60"
                />
                <p className="text-lg">No reviews yet.</p>
                {isLoggedIn && product.canReview && (
                  <p className="text-sm mt-1">
                    Be the first to share your thoughts!
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductReviewsSection;
