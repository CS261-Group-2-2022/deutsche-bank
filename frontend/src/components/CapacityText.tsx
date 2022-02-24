import { UserGroupIcon } from "@heroicons/react/solid";

type CapacityTextProps = {
  capacity: number;
  num_users: number;
  link?: string;
};

export default function CapacityText({
  capacity,
  num_users,
}: CapacityTextProps) {
  return (
    <p className="flex text-gray-600 items-center">
      <UserGroupIcon className="mr-1 h-5 w-5" />
      <span>
        {num_users} / {capacity} joined
      </span>
    </p>
  );
}
