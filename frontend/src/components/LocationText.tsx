import { LocationMarkerIcon } from "@heroicons/react/solid";

type LocationTextProps = {
  location: string;
  link?: string;
};

export default function LocationText({ location, link }: LocationTextProps) {
  return (
    <p className="flex text-gray-600 items-center">
      <LocationMarkerIcon className="mr-1 h-5 w-5" />
      {link ? (
        <a
          href={link}
          className="text-blue-600 underline underline-offset-1 visited:text-purple-600"
        >
          {location}
        </a>
      ) : (
        location
      )}
    </p>
  );
}
