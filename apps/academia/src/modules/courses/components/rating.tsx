"use client";

import React, { useState } from "react";
import { Star, Plus, X } from "lucide-react";

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

// Mock data
const mockComments: Comment[] = [
  {
    id: "1",
    rating: 5,
    content:
      "دورة ممتازة جداً، الشرح واضح والأمثلة مفيدة. أنصح بها بشدة لكل من يريد تعلم هذا الموضوع.",
    studentName: "أحمد محمد",
    studentImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    createdAt: new Date("2024-01-15T10:30:00Z"),
  },
  {
    id: "2",
    rating: 4,
    content:
      "دورة جيدة ومفيدة، لكن أتمنى لو كان هناك المزيد من التمارين العملية.",
    studentName: "فاطمة علي",
    studentImage:
      "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
    createdAt: new Date("2024-01-12T14:20:00Z"),
  },
  {
    id: "3",
    rating: 5,
    content: "المحتوى شامل والمدرب محترف. تعلمت الكثير من هذه الدورة.",
    studentName: "محمد حسن",
    studentImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    createdAt: new Date("2024-01-08T09:15:00Z"),
  },
  {
    id: "4",
    rating: 3,
    content: "دورة مقبولة لكن يمكن تحسينها بإضافة المزيد من الأمثلة الحديثة.",
    studentName: "سارة أحمد",
    studentImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    createdAt: new Date("2024-01-05T16:45:00Z"),
  },
  {
    id: "5",
    rating: 5,
    content: "أفضل دورة تعلمتها هذا العام. شكراً للمدرب على الجهد المبذول.",
    studentName: "خالد يوسف",
    studentImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    createdAt: new Date("2024-01-03T11:30:00Z"),
  },
];

const Ratings: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState<Review>({
    rating: 5,
    content: "",
    studentName: "طالب جديد",
  });

  // Calculate average rating
  const averageRating =
    mockComments.length > 0
      ? (
          mockComments.reduce((sum, comment) => sum + comment.rating, 0) /
          mockComments.length
        ).toFixed(1)
      : "0";

  // Calculate rating percentages
  const calculateRatingPercentage = (
    ratings: number[],
    targetRating: number
  ) => {
    if (ratings.length === 0) return 0;
    const count = ratings.filter((rating) => rating === targetRating).length;
    return (count / ratings.length) * 100;
  };

  // Format date time in Arabic
  const formatDateTime = (date: Date): string => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "اليوم";
    if (diffInDays === 1) return "أمس";
    if (diffInDays < 7) return `منذ ${diffInDays} أيام`;
    if (diffInDays < 30) return `منذ ${Math.floor(diffInDays / 7)} أسابيع`;
    return `منذ ${Math.floor(diffInDays / 30)} شهور`;
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
                : isDarkMode
                ? "text-gray-600"
                : "text-gray-300"
            }`}
            onClick={!readOnly ? () => onRatingChange?.(star) : undefined}
          />
        ))}
      </div>
    );
  };

  // Avatar component
  const Avatar: React.FC<AvatarProps> = ({ src, alt, fallback }) => (
    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
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
          className={`w-full h-full flex items-center justify-center text-sm font-medium ${
            isDarkMode
              ? "text-gray-300 bg-gray-700"
              : "text-gray-600 bg-gray-200"
          }`}
        >
          {fallback}
        </div>
      )}
    </div>
  );

  // Progress bar component
  const Progress: React.FC<ProgressProps> = ({ value, className }) => (
    <div
      className={`bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${className}`}
    >
      <div
        className="h-full bg-orange-500 transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );

  // Add review modal
  const AddReviewModal: React.FC = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        } rounded-xl p-6 w-full max-w-md`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">إضافة تقييم جديد</h3>
          <button
            onClick={() => setShowAddReview(false)}
            className={`p-2 rounded-full hover:${
              isDarkMode ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">التقييم</label>
            <StarRating
              rating={newReview.rating}
              readOnly={false}
              onRatingChange={(rating) =>
                setNewReview({ ...newReview, rating })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">التعليق</label>
            <textarea
              value={newReview.content}
              onChange={(e) =>
                setNewReview({ ...newReview, content: e.target.value })
              }
              className={`w-full p-3 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-black"
              } focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
              rows={4}
              placeholder="اكتب تقييمك هنا..."
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                // Here you would normally call the API
                console.log("Adding review:", newReview);
                setShowAddReview(false);
                setNewReview({ ...newReview, content: "" });
              }}
              className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
            >
              إرسال التقييم
            </button>
            <button
              onClick={() => setShowAddReview(false)}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                isDarkMode
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const averageRatings = [5, 4, 3, 2, 1];
  const allRatings = mockComments.map((c) => c.rating);

  return (
    <div
      className={`transition-colors duration-200 ${isDarkMode ? "dark" : ""}`}
    >
      {/* Dark mode toggle */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            isDarkMode
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-gray-200 text-black hover:bg-gray-300"
          }`}
        >
          {isDarkMode ? "🌞 الوضع النهاري" : "🌙 الوضع الليلي"}
        </button>
      </div>

      <div
        className={`w-full flex flex-col min-h-[400px] h-fit border rounded-xl transition-colors ${
          isDarkMode
            ? "bg-gray-800 border-gray-700 text-white"
            : "bg-white border-gray-200 text-black"
        }`}
      >
        <div className="w-full h-[400px] md:h-[250px] grid grid-cols-1 md:grid-cols-2">
          {/* Left side - Rating breakdown */}
          <div className="w-full h-full flex flex-col p-4">
            {averageRatings.map((rating, index) => (
              <div
                key={`rating-${rating}-${index}`}
                className="w-full h-[40px] flex justify-center md:justify-start items-center gap-x-3"
              >
                <Progress
                  value={calculateRatingPercentage(allRatings, rating)}
                  className="w-[200px] md:w-[300px] h-2"
                />
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                <span
                  className={`text-lg ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {rating}
                </span>
              </div>
            ))}
          </div>

          {/* Right side - Average rating display */}
          <div className="w-full h-full flex flex-col justify-center items-center">
            <div className="flex gap-x-4 items-center mb-4">
              <Star className="w-14 h-14 fill-orange-500 text-orange-500" />
              <span
                className={`font-bold text-6xl md:text-8xl ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                {averageRating}
              </span>
            </div>

            <div
              className={`w-[300px] h-[50px] rounded-full flex items-center justify-center gap-x-2 ${
                isDarkMode ? "bg-gray-700" : "bg-black"
              }`}
            >
              <span className="text-white text-lg">تقييمات</span>
              <span className="text-white text-lg">{mockComments.length}</span>
              <div className="flex w-[100px] justify-end items-center -space-x-2">
                {mockComments.length > 3 && (
                  <div
                    className={`h-8 w-8 rounded-full ring-2 flex items-center justify-center ring-white ${
                      isDarkMode
                        ? "bg-gray-600 text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    <span className="text-sm font-bold">
                      +{mockComments.length - 3}
                    </span>
                  </div>
                )}
                {mockComments.slice(0, 3).map((comment, index) => (
                  <img
                    key={index}
                    width={32}
                    height={32}
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                    src={comment.studentImage}
                    alt="Student avatar"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Header section */}
        <div className="h-[70px] w-full flex justify-between items-center px-4">
          <button
            onClick={() => setShowAddReview(true)}
            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            إضافة تقييم
          </button>
          <span
            className={`font-bold text-2xl ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            جميع التقييمات ({mockComments.length})
          </span>
        </div>

        {/* Reviews list */}
        <div className="min-h-[50px] h-fit flex flex-col justify-start items-start gap-y-4 w-full pb-4">
          {mockComments.map((comment) => (
            <div
              key={comment.id}
              className="flex items-start h-fit min-h-[100px] justify-start gap-x-3 px-6 w-full"
            >
              <Avatar
                src={comment.studentImage}
                alt={comment.studentName}
                fallback={comment.studentName.charAt(0)}
              />
              <div className="w-full flex flex-col justify-start items-start">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                  <p
                    className={`font-bold text-lg ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    {comment.studentName}
                  </p>
                  <div className="flex items-center gap-x-4">
                    <StarRating rating={comment.rating} />
                    <span
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {formatDateTime(comment.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="w-full">
                  <p
                    className={`text-lg leading-relaxed ${
                      isDarkMode ? "text-gray-300" : "text-gray-800"
                    }`}
                  >
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add review modal */}
      {showAddReview && <AddReviewModal />}
    </div>
  );
};

export default Ratings;
