import { Link } from "react-router-dom";
import { SemanticClassificationFormat } from "typescript";
import { GroupSession } from "../utils/endpoints";
import DateTextProps from "./DateText";
import LocationText from "./LocationText";

type UpcomingSessionProps = {
    session: GroupSession;
  };
  
  export default function UpcomingSession({ session}: UpcomingSessionProps) {
      

    return (
    //   <div className="w-full rounded-lg p-2 ">
    // TODO there are some issues with the link, if you end up clicking the button on the home screen it results in the
    // popup flashing open and closed repeatedly
    <Link className="bg-gray-100 rounded-2xl border-gray-200 border-2 p-2 text-center h-full" to={"/groups?id=" + session.id}>
        <div className="flex items-center space-x-4">
          <img
            alt="Session Image"
            src="https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg"
            className="h-20 rounded-lg"
          />
  
          <div className="flex-auto flex-col">
            <h1 className="font-bold flex">{session.name}</h1>
            <div className="flex space-x-1">
              {/* {session.skills?.map((skill) => (
                <SessionTopicLabel key={skill.id} name={skill.name} />
              ))} */} {session.host.first_name + " " + session.host.last_name}
            </div>
            <LocationText
              location={session.location}
              link={session.virtual_link}
            />
            <DateTextProps date={session.date} />
          </div>
        </div>
      </Link>
    );
  }