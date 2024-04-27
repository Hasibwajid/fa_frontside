export const getTimeDifference = (createdAt) => {
  if (!createdAt) {
    return "Invalid Date";
  }

  const currentTime = new Date();
  const postedTime = new Date(createdAt);
  const timeDifference = currentTime - postedTime;

  // Calculate hours, minutes, and seconds from the time difference
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  // Format the time difference into a human-readable string
  let timeString = "";
  if (hours > 0) timeString += `${hours}h `;
  if (minutes > 0) timeString += `${minutes % 60}m `;
  timeString += `${seconds % 60}s ago`;

  return timeString;
};
