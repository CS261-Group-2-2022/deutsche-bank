import { CalendarIcon } from "@heroicons/react/solid";

type DateTextProps = {
  date: string;
};

export default function DateTextProps({ date }: DateTextProps) {
  return (
    <p className="flex text-gray-600 items-center">
      <CalendarIcon className="mr-1 h-5 w-5" />
      {date}
    </p>
  );
}
