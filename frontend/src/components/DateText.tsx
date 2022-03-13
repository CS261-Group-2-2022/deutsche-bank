import { CalendarIcon } from "@heroicons/react/solid";
import { DateTime } from "luxon";
import { useRelativeTime } from "../utils/time";

type DateTextProps = {
  date: string;
  base?: DateTime;
};

export default function DateTextProps({ date, base }: DateTextProps) {
  const relativeTime = useRelativeTime(date, undefined, base);

  return (
    <p
      className="flex text-gray-600 items-center"
      title={DateTime.fromISO(date).toFormat("DDDD, ttt")}
    >
      <CalendarIcon className="mr-1 h-5 w-5" />
      {relativeTime?.toString()}
    </p>
  );
}
