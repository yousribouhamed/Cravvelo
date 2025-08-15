export function timeSince(createdAt: Date): string {
  const now = new Date();
  const createdDate = new Date(createdAt);
  const seconds = Math.floor((now.getTime() - createdDate.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000); // seconds in a year
  if (interval > 1) {
    return `منذ ${interval} سنوات`;
  } else if (interval === 1) {
    return "منذ سنة واحدة";
  }

  interval = Math.floor(seconds / 2592000); // seconds in a month
  if (interval > 1) {
    return `منذ ${interval} أشهر`;
  } else if (interval === 1) {
    return "منذ شهر واحد";
  }

  interval = Math.floor(seconds / 604800); // seconds in a week
  if (interval > 1) {
    return `منذ ${interval} أسابيع`;
  } else if (interval === 1) {
    return "منذ أسبوع واحد";
  }

  interval = Math.floor(seconds / 86400); // seconds in a day
  if (interval > 1) {
    return `منذ ${interval} أيام`;
  } else if (interval === 1) {
    return "منذ يوم واحد";
  }

  interval = Math.floor(seconds / 3600); // seconds in an hour
  if (interval > 1) {
    return `منذ ${interval} ساعات`;
  } else if (interval === 1) {
    return "منذ ساعة واحدة";
  }

  interval = Math.floor(seconds / 60); // seconds in a minute
  if (interval > 1) {
    return `منذ ${interval} دقائق`;
  } else if (interval === 1) {
    return "منذ دقيقة واحدة";
  }

  if (seconds < 10) {
    return "الآن";
  }

  return `منذ ${seconds} ثواني`;
}
