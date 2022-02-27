import { XIcon } from "@heroicons/react/solid";
import { useUser } from "../../utils/authentication";
import { User } from "../../utils/endpoints";
import { UserPanel } from "./MentoringUserPanel";
import SessionTopicLabel from "../SessionTopicLabel";

export default function MentoringMatchingPage() {
  // TODO: get these from an API
  const { user } = useUser();
  if (!user) return <div />;

  const requests: User[] = [user, user];
  const recommendations: User[] = [user];

  return (
    <div className="mx-5">
      {/* Title */}
      <div className="text-center space-y-1">
        <h1 className="font-bold text-2xl">You currently have no mentor</h1>
        <h2 className="text-gray-700 text-xl">
          We have provided a list of recommended mentors which best match your
          profile; send a request to your preferred mentor
        </h2>
      </div>

      {/* TODO: option to change areas of interest - TODO: if we change areas of interest, should outgoing reqs be cancelled? */}

      {/* Current Outgoing Requests */}
      {requests.length > 0 && (
        <>
          <div className="pt-5 pb-2">
            <h3 className="font-bold text-xl text-gray-800">
              Mentor Requests Sent
            </h3>
            <h4 className="text-gray-600 text-sm">
              You have sent a request out to these potential mentors. Once
              somebody accepts, they will become your mentor.
            </h4>
          </div>
          <div className="flex flex-col gap-3">
            {requests.map((mentor) => (
              <UserPanel
                key={mentor.id}
                user={mentor}
                extra_information={
                  <p className="text-sm">
                    {mentor.expertise.length > 0 ? (
                      <>
                        Expert in:
                        <span className="space-x-1 pl-1">
                          {mentor.expertise.map((expertise) => (
                            <SessionTopicLabel
                              key={expertise}
                              name={expertise}
                            />
                          ))}
                        </span>
                      </>
                    ) : (
                      "No expertise"
                    )}
                  </p>
                }
                actions={
                  <button
                    type="button"
                    className="flex flex-row items-center py-2 px-5 text-xl bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white transition ease-in duration-100 text-center font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                  >
                    <XIcon className="h-5 w-5 mr-2" />
                    Cancel
                  </button>
                }
              />
            ))}
          </div>
        </>
      )}

      {/* Recommended Mentors */}
      <div className="pt-5 pb-2">
        <h3 className="font-bold text-xl text-gray-800">Recommendations</h3>
        <div className="flex flex-col gap-3">
          {recommendations.map((mentor) => (
            <UserPanel
              key={mentor.id}
              user={mentor}
              extra_information={
                <p className="text-sm">
                  {mentor.expertise.length > 0 ? (
                    <>
                      Expert in:
                      <span className="space-x-1 pl-1">
                        {mentor.expertise.map((expertise) => (
                          <SessionTopicLabel key={expertise} name={expertise} />
                        ))}
                      </span>
                    </>
                  ) : (
                    "No expertise"
                  )}
                </p>
              }
              actions={
                <button
                  type="button"
                  className="flex flex-row items-center py-2 px-5 text-xl bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-100 text-center font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                >
                  Send Request
                </button>
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
