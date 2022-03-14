import { useEffect, useState } from "react";
import { DateTime } from "luxon";

/**
 * Returns a time relative to now, continuously refreshing on refresh rate
 * @param time An ISO string representing the time
 * @param refreshRate The time in ms between refreshing
 */
export const useRelativeTime = (
  time: string,
  refreshRate = 60000,
  base?: DateTime
) => {
  const relativeTime = DateTime.fromISO(time);
  const [timeFromNow, setTimeFromNow] = useState(
    relativeTime.toRelative({ base })
  );

  useEffect(() => {
    // Create a refresh loop
    const intervalId = setInterval(
      () => setTimeFromNow(relativeTime.toRelative({ base })),
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
