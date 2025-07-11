export function getCurrentDate(): string {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export async function sendGenerateRequest({
  accountId,
  certificate,
  courseName,
  name,
  studentId,
  studentName,
}: {
  accountId: string;
  certificate: string;
  courseName: string;
  name: string;
  studentId: string;
  studentName: string;
}) {
  try {
    const response = await fetch(
      "https://cravvelo-puppeteer.onrender.com/scrape",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountId,
          certificate,
          courseName,
          name,
          studentId,
          studentName,
        }),
      }
    );

    const data = await response.json();

    return data;
  } catch (err) {
    console.error(err);
  }
}
