import { Link } from "react-router-dom";
import useSWR from "swr";
import { useUser } from "../utils/authentication";
import {
  FULL_USER_ENDPOINT,
  GroupSession,
  Meeting,
  Mentorship,
  MENTORSHIP_ENDPOINT,
  UserFull,
} from "../utils/endpoints";
import DateTextProps from "./DateText";
import LocationText from "./LocationText";
import UserAvatar from "./UserAvatar";

const MeetingCard = ({ meeting }: { meeting: Meeting }) => {
  const { user } = useUser();

  // TODO: can the backend just serlialize all this stuff so we dont need to do more requests?
  const { data: mentorship } = useSWR<Mentorship>(
    MENTORSHIP_ENDPOINT.replace("{ID}", meeting.mentorship.toString())
  );
  const { data: otherUser } = useSWR<UserFull>(
    mentorship
      ? FULL_USER_ENDPOINT.replace(
          "{ID}",
          mentorship.mentee === user?.id
            ? mentorship.mentor.toString()
            : mentorship.mentee.toString()
        )
      : null
  );

  return (
    <Link
      className="bg-gray-100 rounded-xl border-gray-300 border p-2 text-center"
      to="/mentoring/me?tab=meetings"
    >
      <div className="flex items-center space-x-4">
        <UserAvatar user={user} size={14} />

        <div className="flex-auto flex-col">
          <h1 className="font-bold flex">
            Meeting with {otherUser?.first_name} {otherUser?.last_name}
          </h1>
          <LocationText location={meeting.location} />
          <DateTextProps date={meeting.time} />
        </div>
      </div>
    </Link>
  );
};

const GroupSessionCard = ({ session }: { session: GroupSession }) => {
  return (
    <Link
      className="bg-gray-100 rounded-xl border-gray-300 border p-2 text-center"
      to={"/groups?id=" + session.id}
    >
      <div className="flex items-center space-x-4">
        {/* TODO: Group Session Image */}
        <img
          alt="Session Image"
          src="https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg"
          className="h-20 rounded-lg"
        />

        <div className="flex-auto flex-col">
          <h1 className="font-bold flex">{session.name}</h1>
          <div className="flex space-x-1">
            by {session.host.first_name} {session.host.last_name}
          </div>
          <LocationText location={session.location} />
          <DateTextProps date={session.date} />
        </div>
      </div>
    </Link>
  );
};

type UpcomingSessionProps = {
  isMeeting: boolean;
  event: Meeting | GroupSession;
};

const eventIsMeeting = (
  isMeeting: boolean,
  event: Meeting | GroupSession
): event is Meeting => isMeeting;

export default function UpcomingSession({
  isMeeting,
  event,
}: UpcomingSessionProps) {
  return eventIsMeeting(isMeeting, event) ? (
    <MeetingCard meeting={event} />
  ) : (
    <GroupSessionCard session={event} />
  );
}
