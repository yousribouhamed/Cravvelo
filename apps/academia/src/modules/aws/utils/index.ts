export function getKeyFromUrl(url: string): string {
  const bucketName = process.env.S3_BUCKET_NAME;
  const region = process.env.AWS_REGION || "us-east-1";
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
