import useSWR from "swr";
import { useUser } from "../../utils/authentication";
import { getAreaFromId, useBusinessAreas } from "../../utils/business_area";
import SessionTopicLabel from "../SessionTopicLabel";
import {
  FULL_USER_ENDPOINT,
  User,
  UserFull,
  Mentorship,
} from "../../utils/endpoints";

type MentorProfileProps = {
  mentor: UserFull;
};

export default function MentorProfile({ mentor }: MentorProfileProps) {
  const { user } = useUser();
  const { areas } = useBusinessAreas();
  const userID = user?.id.toString();

  //   if (!menteeUser) {
  //     return <div />;
  //   }

  if (mentor == null) {
    return <div>You do not have a mentor</div>;
  }

  return (
    <div className="w-full rounded-lg p-2 rounded-2xl border-gray-200 border-2 p-2">
      <div className="flex items-center space-x-4">
        <img
          alt="Session Image"
          src="https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg"
          className="h-20 rounded-lg"
        />

        <div className="flex-auto flex-col ">
          <h1 className="font-bold text-xl">
            {mentor?.first_name} {mentor?.last_name}
          </h1>
          <div className="flex space-x-1 block text-m text-gray-500 mt-1">
            {mentor?.business_area?.name ?? ""}
          </div>
          <div className="flex flex-wrap space-x-1 mt-1 space-y-1">
            {mentor?.expertise?.map((skill) => (
              <SessionTopicLabel key={skill.id} name={skill.name} />
            ))}
          </div>

          <div></div>
          {/* <LocationText
            location={session.location}
            link={session.virtual_link}
          />
          Location
          Date
          <DateTextProps date={session.date} /> */}
        </div>
        <div></div>
      </div>
    </div>
  );
}
