import { ArrowRightIcon, CheckIcon, XIcon } from "@heroicons/react/solid";
import { Link } from "react-router-dom";
import SessionTopicLabel from "../components/SessionTopicLabel";
import Topbar from "../components/Topbar";
import { useUser } from "../utils/authentication";
import { getAreaFromId, useBusinessAreas } from "../utils/business_area";
import { User } from "../utils/endpoints";

type UserPanelProps = {
  user: User;
};

const UserPanel = ({
  user,
  children,
}: React.PropsWithChildren<UserPanelProps>) => {
  const { areas } = useBusinessAreas();

  return (
    <div className="bg-white border rounded-md w-full">
      <div className="flex flex-row items-center px-3 py-1">
        {/* Image */}
        <div className="bg-gray-500 rounded-full aspect-square w-16 h-16"></div>

        {/* Information */}
        <div className="flex-auto ml-2">
          <h3 className="text-gray-800 font-medium text-lg">
            {user.first_name} {user.last_name}
          </h3>
          <h4 className="text-gray-500">
            {getAreaFromId(user.business_area, areas)?.name ?? ""}
          </h4>

          <p className="text-sm">
            {user.interests.length > 0 ? (
              <>
                Interested in:
                <span className="space-x-1 pl-1">
                  {user.interests.map((interest) => (
                    <SessionTopicLabel key={interest} name={interest} />
                  ))}
                </span>
              </>
            ) : (
              "Currently not interested in anything"
            )}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row gap-1">{children}</div>
      </div>
    </div>
  );
};

type PendingRequestsProps = {
  requests: User[];
};

const PendingRequests = ({ requests }: PendingRequestsProps) => {
  return (
    <div>
      <div className="flex">
        <h1 className="font-bold text-xl text-gray-800">
          Pending Mentee Requests
        </h1>
        {/* TODO: Accepting New Mentees Toggle */}
      </div>
      <div className="flex flex-col gap-3">
        {requests.length > 0 ? (
          requests.map((mentee) => (
            <UserPanel key={mentee.id} user={mentee}>
              <button
                type="button"
                className="flex flex-row items-center py-2 px-5 text-xl bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white transition ease-in duration-100 text-center font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
              >
                <CheckIcon className="h-5 w-5 mr-2" />
                Accept
              </button>
              <button
                type="button"
                className="flex flex-row items-center py-2 px-5 text-xl bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white transition ease-in duration-100 text-center font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
              >
                <XIcon className="h-5 w-5 mr-2" />
                Decline
              </button>
            </UserPanel>
          ))
        ) : (
          <h4 className="text-gray-700 m-2">You currently have no requests</h4>
        )}
      </div>
    </div>
  );
};

type CurrentMenteesProps = {
  currentMentees: User[];
};

const CurrentMentees = ({ currentMentees }: CurrentMenteesProps) => {
  return (
    <div>
      <h1 className="font-bold text-xl text-gray-800">Your Mentees</h1>
      <div className="flex flex-col gap-3">
        {currentMentees.length > 0 ? (
          currentMentees.map((mentee) => (
            <UserPanel key={mentee.id} user={mentee}>
              <Link
                to={`/mentoring/${mentee.id}`}
                className="flex flex-row items-center py-2 px-5 text-xl bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
              >
                View Profile
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </UserPanel>
          ))
        ) : (
          <h4 className="text-gray-700 m-2">You currently have no mentees</h4>
        )}
      </div>
    </div>
  );
};

export default function YourMentees() {
  // Display a list of incoming mentee requests, and your current mentees
  const { user } = useUser();

  if (!user) return <></>;

  const currentMentees: User[] = [user, user, user];
  const pendingRequests: User[] = [];

  return (
    <>
      <Topbar />
      <div className="mx-5">
        {/* TODO: Areas of Interest Update */}
        <PendingRequests requests={pendingRequests} />
        <CurrentMentees currentMentees={currentMentees} />
      </div>
    </>
  );
}
