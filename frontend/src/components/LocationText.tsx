import { LocationMarkerIcon } from "@heroicons/react/solid";

type LocationTextProps = {
  location: string;
};

export default function LocationText({ location }: LocationTextProps) {
  return (
    <p className="flex text-gray-600 items-center">
      <LocationMarkerIcon className="mr-1 h-5 w-5" />
      {location}
    </p>
  );
}
