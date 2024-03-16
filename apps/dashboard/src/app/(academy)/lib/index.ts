import { jwtVerify, SignJWT } from "jose";

interface UserJwtPayload {
  jti: string;
  iat: number;
}

export function getJwtSecritKey() {
  const secret = process.env.JWT_SECRET_KEY;

  if (!secret || secret.length === 0) {
    throw new Error("there is no secret key");
  }

  return secret;
}

export async function verifyToken({ token }: { token: string }) {
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(getJwtSecritKey())
    );

    return verified.payload as UserJwtPayload;
  } catch (err) {
    throw new Error("your token has expired");
  }
}

export function isArrayOfFile(files: unknown): files is File[] {
  const isArray = Array.isArray(files);
  if (!isArray) return false;
  return files.every((file) => file instanceof File);
}

export function getSubDomainValue({ value }: { value: string }) {
  const subdomain_value =
    process.env.NODE_ENV === "development"
      ? "abdullah.cravvelo.com"
      : decodeURIComponent(value);

  return subdomain_value;
  // return "abdullah.cravvelo.com";
}

export function formatVideoDuration(durationInSeconds: number): string {
  // Convert seconds to hours and minutes
  const hours: number = Math.floor(durationInSeconds / 3600);
  const minutes: number = Math.floor((durationInSeconds % 3600) / 60);

  // Define Arabic words for hours and minutes
  const arabicHours: string = "ساعة";
  const arabicMinutes: string = "دقيقة";

  // Create formatted string
  let formattedTime: string = "";

  if (hours > 0) {
    formattedTime += `${hours} ${arabicHours} و`;
  }

  formattedTime += `${minutes} ${arabicMinutes}`;

  return formattedTime;
}

export function calculateDiscountPercentage(
  price: number,
  compareAtPrice: number
): number {
  // Calculate the discount amount
  const discountAmount: number = compareAtPrice - price;

  // Calculate the discount percentage
  const discountPercentage: number = (discountAmount / compareAtPrice) * 100;

  return discountPercentage;
}

export function formatDateTime(dateTime: Date): string {
  // Extract components of the date
  const month: number = dateTime.getMonth() + 1;
  const day: number = dateTime.getDate();
  const year: number = dateTime.getFullYear();
  const hours: number = dateTime.getHours();
  const minutes: number = dateTime.getMinutes();
  const seconds: number = dateTime.getSeconds();
  const amPm: string = hours >= 12 ? "pm" : "am";

  // Format the date components
  const formattedDate: string = `${month.toString().padStart(2, "0")}/${day
    .toString()
    .padStart(2, "0")}/${year}`;
  const formattedTime: string = `${(hours % 12)
    .toString()
    .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")} ${amPm}`;

  // Combine date and time
  const formattedDateTime: string = `${formattedDate} - ${formattedTime}`;

  return formattedDateTime;
}

export function calculateAverageRating(ratings: number[]): number {
  // Check if the array is empty
  if (ratings.length === 0) {
    return 0.0;
  }

  // Calculate the sum of all ratings
  const sum: number = ratings.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  // Calculate the average rating
  const average: number = sum / ratings.length;

  // Return the average rating with one decimal place
  return parseFloat(average.toFixed(1));
}

export function calculatePositiveReviewPercentage(ratings: number[]): number {
  // Filter ratings that are 4 or above (positive reviews)
  const positiveRatings: number[] = ratings.filter((rating) => rating >= 4);

  // Calculate the percentage of positive reviews
  const positivePercentage: number =
    (positiveRatings.length / ratings.length) * 100;

  // Return the positive percentage with two decimal places
  return parseFloat(positivePercentage.toFixed(2));
}

export function calculateRatingPercentage(
  ratings: number[],
  targetRating: number
): number {
  // Count occurrences of the target rating
  const targetRatingCount: number = ratings.filter(
    (rating) => rating === targetRating
  ).length;

  // Calculate the percentage of the target rating
  const ratingPercentage: number = (targetRatingCount / ratings.length) * 100;

  // Return the percentage with two decimal places
  return parseFloat(ratingPercentage.toFixed(2));
}
