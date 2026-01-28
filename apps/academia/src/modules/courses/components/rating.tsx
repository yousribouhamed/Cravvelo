"use client";

import React, { useState } from "react";
import { Star, Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { getCourseRatings, createCourseRating } from "@/modules/courses/actions/ratings";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Types
interface Comment {
  id: string;
  rating: number;
  content: string;
  studentName: string;
  studentImage: string;
  createdAt: Date;
}

interface Review {
  rating: number;
  content: string;
  studentName: string;
}

interface StarRatingProps {
  rating: number;
  readOnly?: boolean;
  onRatingChange?: (rating: number) => void;
}

interface AvatarProps {
  src?: string;
  alt: string;
  fallback: string;
}

interface ProgressProps {
  value: number;
  className?: string;
}

type InitialComment = {
  id: string;
  content: string;
  rating: number;
  createdAt: string | Date;
  Student?: {
    full_name: string;
    photo_url: string | null;
  };
};

interface RatingsProps {
  courseId: string;
  initialComments?: InitialComment[];
  allowComment?: boolean;
  allowRating?: boolean;
}

const Ratings: React.FC<RatingsProps> = ({
  courseId,
  initialComments = [],
  allowComment = true,
  allowRating = true,
}) => {
  const t = useTranslations("courses.reviews");
  const qc = useQueryClient();
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState<Review>({
    rating: 5,
    content: "",
    studentName: "",
  });

  const queryOptions: UseQueryOptions<any, Error> = {
    queryKey: ["courseRatings", courseId] as const,
    queryFn: async () => {
      const res = await getCourseRatings({ courseId, limit: 10, sortBy: "newest" });
      if (!res.success || !res.data) throw new Error(res.message || "Failed to load reviews");
      return res.data;
    },
  };

  if (initialComments.length > 0) {
    queryOptions.initialData = {
      ratings: initialComments.map((c) => ({
        id: c.id,
        content: c.content,
        rating: c.rating,
        createdAt: c.createdAt,
        Student: c.Student,
      })),
      pagination: {
        total: initialComments.length,
        limit: initialComments.length,
        offset: 0,
        hasMore: false,
        totalPages: 1,
        currentPage: 1,
      },
      statistics: {
        averageRating:
          initialComments.reduce((sum, c) => sum + (c.rating || 0), 0) /
          (initialComments.length || 1),
        totalRatings: initialComments.length,
        highestRating: 5,
        lowestRating: 1,
        distribution: [5, 4, 3, 2, 1].map((r) => ({
          rating: r,
          count: initialComments.filter((c) => c.rating === r).length,
          percentage:
            initialComments.length > 0
              ? (initialComments.filter((c) => c.rating === r).length /
                  initialComments.length) *
                100
              : 0,
        })),
      },
    };
  }

  const ratingsQuery = useQuery(queryOptions);

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await createCourseRating({
        courseId,
        rating: newReview.rating,
        content: newReview.content,
      });
      if (!res.success) throw new Error(res.message || "Failed to submit review");
      return res;
    },
    onSuccess: async (res) => {
      toast.success(res.message || t("submitted"));
      setShowAddReview(false);
      setNewReview((prev) => ({ ...prev, content: "" }));
      // Invalidate and refetch the ratings query to refresh the reviews list
      await qc.refetchQueries({ queryKey: ["courseRatings", courseId] });
    },
    onError: (err: any) => {
      toast.error(err?.message || t("submitError"));
    },
  });

  const ratingsData = ratingsQuery.data;
  const comments: Comment[] =
    ratingsData?.ratings?.map((r: any) => ({
      id: r.id,
      rating: r.rating,
      content: r.content,
      studentName: r.Student?.full_name || t("anonymous"),
      studentImage: r.Student?.photo_url || "",
      createdAt: new Date(r.createdAt),
    })) || [];

  // Calculate average rating
  const averageRating = (ratingsData?.statistics?.averageRating || 0).toFixed(1);

  // Calculate rating percentages
  const calculateRatingPercentage = (
    ratings: number[],
    targetRating: number
  ) => {
    if (ratings.length === 0) return 0;
    const count = ratings.filter((rating) => rating === targetRating).length;
    return (count / ratings.length) * 100;
  };

  // Format date time localized (simple relative time)
  const formatDateTime = (date: Date): string => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return t("time.today");
    if (diffInDays === 1) return t("time.yesterday");
    if (diffInDays < 7) return t("time.daysAgo", { count: diffInDays });
    if (diffInDays < 30) return t("time.weeksAgo", { count: Math.floor(diffInDays / 7) });
    return t("time.monthsAgo", { count: Math.floor(diffInDays / 30) });
  };

  // Star component
  const StarRating: React.FC<StarRatingProps> = ({
    rating,
    readOnly = true,
    onRatingChange,
  }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 cursor-pointer ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground/40"
            }`}
            onClick={!readOnly ? () => onRatingChange?.(star) : undefined}
          />
        ))}
      </div>
    );
  };

  // Avatar component
  const Avatar: React.FC<AvatarProps> = ({ src, alt, fallback }) => (
    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center text-sm font-medium text-muted-foreground bg-muted"
        >
          {fallback}
        </div>
      )}
    </div>
  );

  // Progress bar component
  const Progress: React.FC<ProgressProps> = ({ value, className }) => (
    <div className={`bg-muted rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-primary transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );

  const averageRatings = [5, 4, 3, 2, 1];
  const allRatings = comments.map((c) => c.rating);

  return (
    <div className="transition-colors duration-200">
      <div className="w-full flex flex-col min-h-[400px] h-fit border rounded-xl transition-colors bg-card text-card-foreground border-border">
        <div className="w-full h-[400px] md:h-[250px] grid grid-cols-1 md:grid-cols-2">
          {/* Left side - Rating breakdown */}
          <div className="w-full h-full flex flex-col p-4">
            {averageRatings.map((rating, index) => (
              <div
                key={`rating-${rating}-${index}`}
                className="w-full h-[40px] flex justify-center md:justify-start rtl:md:justify-end items-center gap-x-3"
              >
                <Progress
                  value={calculateRatingPercentage(allRatings, rating)}
                  className="w-[200px] md:w-[300px] h-2"
                />
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                <span
                  className="text-lg text-muted-foreground"
                >
                  {rating}
                </span>
              </div>
            ))}
          </div>

          {/* Right side - Average rating display */}
          <div className="w-full h-full flex flex-col justify-center items-center">
            <div className="flex gap-x-4 items-center mb-4">
              <Star className="w-14 h-14 fill-primary text-primary" />
              <span
                className="font-bold text-6xl md:text-8xl text-foreground"
              >
                {averageRating}
              </span>
            </div>

            <div
              className="w-[300px] h-[50px] rounded-full flex items-center justify-center gap-x-2 rtl:gap-x-reverse bg-primary"
            >
              <span className="text-primary-foreground text-lg">{t("reviews")}</span>
              <span className="text-primary-foreground text-lg">
                {ratingsData?.statistics?.totalRatings ?? comments.length}
              </span>
              <div className="flex w-[100px] justify-end rtl:justify-start items-center -space-x-2 rtl:space-x-reverse">
                {comments.length > 3 && (
                  <div
                    className="h-8 w-8 rounded-full ring-2 flex items-center justify-center ring-background bg-background text-foreground"
                  >
                    <span className="text-sm font-bold">
                      +{comments.length - 3}
                    </span>
                  </div>
                )}
                {comments.slice(0, 3).map((comment, index) => (
                  <img
                    key={index}
                    width={32}
                    height={32}
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                    src={comment.studentImage || undefined}
                    alt="Student avatar"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Header section */}
        <div className="h-[70px] w-full flex justify-between items-center px-4 rtl:flex-row-reverse">
          {allowComment && allowRating && (
            <button
              onClick={() => setShowAddReview(true)}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t("addButton")}
            </button>
          )}
          <span
            className="font-bold text-2xl text-foreground text-start rtl:text-end"
          >
            {t("allReviews", { count: ratingsData?.statistics?.totalRatings ?? comments.length })}
          </span>
        </div>

        {/* Reviews list */}
        <div className="min-h-[50px] h-fit flex flex-col justify-start items-start gap-y-4 w-full pb-4">
          {ratingsQuery.isLoading ? (
            <div className="px-6 py-8 text-muted-foreground text-start rtl:text-end">{t("loading")}</div>
          ) : comments.length === 0 ? (
            <div className="px-6 py-8 text-muted-foreground text-start rtl:text-end">{t("empty")}</div>
          ) : (
            comments.map((comment) => (
            <div
              key={comment.id}
              className="flex items-start h-fit min-h-[100px] justify-start rtl:justify-end gap-x-3 rtl:gap-x-reverse px-6 w-full"
            >
              <Avatar
                src={comment.studentImage}
                alt={comment.studentName}
                fallback={comment.studentName.charAt(0)}
              />
              <div className="w-full flex flex-col justify-start items-start rtl:items-end">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2 rtl:flex-row-reverse">
                  <p
                    className="font-bold text-lg text-foreground text-start rtl:text-end"
                  >
                    {comment.studentName}
                  </p>
                  <div className="flex items-center gap-x-4 rtl:gap-x-reverse">
                    <StarRating rating={comment.rating} />
                    <span
                      className="text-sm text-muted-foreground"
                    >
                      {formatDateTime(comment.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="w-full">
                  <p
                    className="text-lg leading-relaxed text-foreground text-start rtl:text-end"
                  >
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))
          )}
        </div>
      </div>

      {/* Add review modal */}
      <Dialog open={showAddReview} onOpenChange={setShowAddReview}>
        <DialogContent className="rtl:text-right" showCloseButton={true}>
          <DialogHeader>
            <DialogTitle className="text-start rtl:text-end">{t("addTitle")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-start rtl:text-end">{t("ratingLabel")}</label>
              <StarRating
                rating={newReview.rating}
                readOnly={false}
                onRatingChange={(rating) =>
                  setNewReview({ ...newReview, rating })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-start rtl:text-end">{t("commentLabel")}</label>
              <Textarea
                value={newReview.content}
                onChange={(e) =>
                  setNewReview({ ...newReview, content: e.target.value })
                }
                className="min-h-[120px] resize-none"
                rows={4}
                placeholder={t("commentPlaceholder")}
                autoFocus
              />
            </div>
          </div>

          <DialogFooter className="flex-row gap-3 rtl:flex-row-reverse sm:justify-end">
            <Button
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending || !newReview.content.trim() || !allowComment || !allowRating}
              className="flex-1 sm:flex-initial"
            >
              {createMutation.isPending ? t("submitting") : t("submit")}
            </Button>
            <Button
              onClick={() => setShowAddReview(false)}
              variant="outline"
              className="flex-1 sm:flex-initial"
            >
              {t("cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Ratings;
