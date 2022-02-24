import { useEffect, useState } from "react";
import { DateTime } from "luxon";

/**
 * Returns a time relative to now, continuously refreshing on refresh rate
 * @param time An ISO string representing the time
 * @param refreshRate The time in ms between refreshing
 */
export const useRelativeTime = (time: string, refreshRate = 1000) => {
  const relativeTime = DateTime.fromISO(time);
  const [timeFromNow, setTimeFromNow] = useState(relativeTime.toRelative());

  useEffect(() => {
    // Create a refresh loop
    const intervalId = setInterval(
      () => setTimeFromNow(relativeTime.toRelative()),
      refreshRate
    );

    // Clear refresh loop on cleanup
    return () => clearInterval(intervalId);
  }, [
    refreshRate,
    relativeTime,
    setTimeFromNow,
    setInterval,
    clearInterval,
    DateTime,
  ]);

  return timeFromNow;
};
