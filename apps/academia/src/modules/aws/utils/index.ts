export function getKeyFromUrl(url: string): string {
  const bucketName = process.env.S3_BUCKET_NAME;
  // Prefer the same env used by `S3Client` config; fall back gracefully.
  const region =
    process.env.AWS_BUCKET_REGION || process.env.AWS_REGION || "us-east-1";
  const urlPattern = new RegExp(
    `https://${bucketName}\\.s3\\.${region}\\.amazonaws\\.com/(.+)`
  );
  const match = url.match(urlPattern);

  if (match && match[1]) {
    return match[1];
  } else {
    throw new Error("Invalid S3 URL format");
  }
}
