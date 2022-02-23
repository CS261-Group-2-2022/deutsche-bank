import { CalendarIcon } from "@heroicons/react/solid";
import { DateTime } from "luxon";
import { useRelativeTime } from "../utils/time";

type DateTextProps = {
  date: string;
};

export default function DateTextProps({ date }: DateTextProps) {
  const relativeTime = useRelativeTime(date);

  return (
    <p
      className="flex text-gray-600 items-center underline underline-offset-1 decoration-dotted"
      title={DateTime.fromISO(date).toFormat("EEEE, MMMM Do yyyy, h:mm:ss a")}
    >
      <CalendarIcon className="mr-1 h-5 w-5" />
      {relativeTime?.toString()}
    </p>
  );
}
