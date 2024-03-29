import { Link } from "react-router-dom";
import { useUser } from "../utils/authentication";
import { ExtendedMeeting, GroupSession } from "../utils/endpoints";
import DateTextProps from "./DateText";
import LocationText from "./LocationText";
import UserAvatar from "./UserAvatar";

const MeetingCard = ({ meeting }: { meeting: ExtendedMeeting }) => {
  const { user } = useUser();
  const iAmMentee = meeting.mentorship.mentee.id === user?.id;

  const otherUser = iAmMentee
    ? meeting.mentorship.mentor
    : meeting.mentorship.mentee;

  return (
    <Link
      className="bg-gray-100 rounded-xl border-gray-300 border p-2 text-center"
      to={`/mentoring/${iAmMentee ? "me" : otherUser.id}?tab=meetings`}
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
          src={
            session.image_link ??
            "https://thinkingportfolio.com/wp-content/uploads/2015/10/02G69046.jpg"
          }
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
  event: ExtendedMeeting | GroupSession;
};

const eventIsMeeting = (
  isMeeting: boolean,
  event: ExtendedMeeting | GroupSession
): event is ExtendedMeeting => isMeeting;

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
