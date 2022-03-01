import { Disclosure } from "@headlessui/react";
import {
  CalendarIcon,
  CheckIcon,
  ChevronUpIcon,
  PencilIcon,
  XIcon,
} from "@heroicons/react/solid";
import { DateTime } from "luxon";
import { useState } from "react";
import { mutate } from "swr";
import {
  ACCEPT_MEETING_REQUEST_ENDPOINT,
  CANCEL_MEETING_REQUEST_ENDPOINT,
  DECLINE_MEETING_REQUEST_ENDPOINT,
  getAuthToken,
  Meeting,
  MeetingRequest,
  Mentorship,
  MENTORSHIP_ENDPOINT,
  UPDATE_MEETING_ENDPOINT,
} from "../../utils/endpoints";
import { FormTextArea } from "../FormTextarea";
import LocationText from "../LocationText";
import { LoadingButton } from "../LoadingButton";
import RequestMeetingPopup from "./RequestAMeetingPopup";

type MeetingProps = {
  mentorship: Mentorship;
  meeting: Meeting;
  perspective: "mentor" | "mentee";
};

function MeetingInfo({ mentorship, meeting, perspective }: MeetingProps) {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [menteeNotes, setMenteeNotes] = useState(meeting.mentee_notes ?? "");
  const [mentorNotes, setMentorNotes] = useState(meeting.mentor_notes ?? "");
  const isMentor = perspective === "mentor";

  const datetime = DateTime.fromISO(meeting.time);
  const notesNotRecorded =
    (isMentor && mentorNotes === "") || (!isMentor && menteeNotes === "");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const updateNotes = async () => {
    setIsLoading(true);
    setError(undefined);

    const res = await fetch(
      UPDATE_MEETING_ENDPOINT.replace("{ID}", meeting.id.toString()),
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          authorization: `Token ${getAuthToken()}`,
        },
        body: JSON.stringify({
          mentor_notes: isMentor ? mentorNotes : undefined,
          mentee_notes: !isMentor ? menteeNotes : undefined,
        }),
      }
    );

    const body = await res.json();

    if (res.ok) {
      setIsEditingNotes(false);

      // Revalidate the caches for meetings
      mutate(MENTORSHIP_ENDPOINT.replace("{ID}", mentorship.id.toString()));
    } else {
      setError(
        body.mentor_notes?.join(" ") ??
          body.mentee_notes?.join(" ") ??
          "An error occured when updating your notes. Please try again."
      );
    }

    setIsLoading(false);
  };

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-md font-bold text-left text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75 border border-gray-400">
            <div className="flex w-full justify-between font-bold items-center">
              <div className="flex">
                {datetime.toFormat("DDDD, t ZZZZ")}
                {notesNotRecorded && (
                  <span className="rounded-full ml-2 bg-red-500 px-2 py-1 text-sm text-white font-semibold">
                    NO NOTES
                  </span>
                )}
              </div>
              <ChevronUpIcon
                className={`${
                  open ? "transform rotate-180" : ""
                } w-5 h-5 text-gray-900`}
              />
            </div>
          </Disclosure.Button>
          <Disclosure.Panel className="flex flex-col mx-5 space-y-1">
            <p className="text-sm text-gray-700">{meeting.description}</p>
            <div className="grid grid-cols-2 gap-5 w-full">
              <div>
                <h5 className="font-semibold text-gray-900 text-base flex mb-2">
                  Mentor Notes
                  {isMentor && (
                    <LoadingButton
                      className="ml-2 px-4 flex justify-center items-center  bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                      onClick={() =>
                        isEditingNotes ? updateNotes() : setIsEditingNotes(true)
                      }
                      isLoading={isLoading}
                    >
                      {isEditingNotes ? (
                        <>
                          {/* <SaveIcon className="w-5 h-5 mr-1" /> */}
                          Save
                        </>
                      ) : (
                        <>
                          <PencilIcon className="w-5 h-5 mr-1" />
                          Edit
                        </>
                      )}
                    </LoadingButton>
                  )}
                </h5>
                {isMentor && error && (
                  <div className="block text-sm m-1 font-medium text-red-700">
                    {error}
                  </div>
                )}
                {isMentor && isEditingNotes ? (
                  <FormTextArea
                    id="notes"
                    name=""
                    placeholder="Enter your notes for this session"
                    text={mentorNotes}
                    onChange={setMentorNotes}
                  />
                ) : (
                  <p className="text-sm text-gray-800">
                    {mentorNotes === "" ? "No notes provided" : mentorNotes}
                  </p>
                )}
              </div>
              <div>
                <h5 className="font-semibold text-gray-900 text-base flex mb-2">
                  Mentee Notes
                  {!isMentor && (
                    <LoadingButton
                      className="ml-2 px-4 flex justify-center items-center  bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                      onClick={() =>
                        isEditingNotes ? updateNotes() : setIsEditingNotes(true)
                      }
                      isLoading={isLoading}
                    >
                      {isEditingNotes ? (
                        <>
                          {/* <SaveIcon className="w-5 h-5 mr-1" /> */}
                          Save
                        </>
                      ) : (
                        <>
                          <PencilIcon className="w-5 h-5 mr-1" />
                          Edit
                        </>
                      )}
                    </LoadingButton>
                  )}
                </h5>
                {!isMentor && error && (
                  <div className="block text-sm m-1 font-medium text-red-700">
                    {error}
                  </div>
                )}
                {!isMentor && isEditingNotes ? (
                  <FormTextArea
                    id="notes"
                    name=""
                    placeholder="Enter your notes for this session"
                    text={menteeNotes}
                    onChange={setMenteeNotes}
                  />
                ) : (
                  <p className="text-sm text-gray-800">
                    {menteeNotes === "" ? "No notes provided" : menteeNotes}
                  </p>
                )}
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

type RequestedMeetingProp = {
  mentorship: Mentorship;
  request: MeetingRequest;
  perspective: "mentor" | "mentee";
};

const RequestedMeeting = ({
  mentorship,
  request,
  perspective,
}: RequestedMeetingProp) => {
  const datetime = DateTime.fromISO(request.time);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const makeRequest = (endpoint: string, error: string) => {
    return async () => {
      setIsLoading(true);
      setError(undefined);

      const res = await fetch(endpoint.replace("{ID}", request.id.toString()), {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Token ${getAuthToken()}`,
        },
      });

      const body = await res.json();

      if (res.ok) {
        // Revalidate the caches for mentorship information
        mutate(MENTORSHIP_ENDPOINT.replace("{ID}", mentorship.id.toString()));
      } else {
        setError(body.error?.join(" ") ?? error);
      }

      setIsLoading(false);
    };
  };

  const acceptRequest = makeRequest(
    ACCEPT_MEETING_REQUEST_ENDPOINT,
    "An error occured when accepting this meeting. Please try again."
  );

  const declineRequest = makeRequest(
    DECLINE_MEETING_REQUEST_ENDPOINT,
    "An error occured when declining this meeting. Please try again."
  );

  const cancelRequest = makeRequest(
    CANCEL_MEETING_REQUEST_ENDPOINT,
    "An error occured when cancelling this meeting. Please try again."
  );

  return (
    <div className="w-full flex justify-between my-2 rounded-lg px-2 py-1">
      <div>
        <h6 className="flex items-center gap-2">
          {datetime.toFormat("DDDD, t ZZZZ")}
        </h6>
        <p className="text-sm text-gray-700">{request.description}</p>
        <LocationText location={request.location} />
        {error && (
          <div className="block text-sm m-1 font-medium text-red-700">
            {error}
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        {perspective === "mentor" ? (
          <>
            <LoadingButton
              type="button"
              className="flex flex-row items-center py-1 px-3 text-md bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white transition ease-in duration-100 text-center font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
              isLoading={isLoading}
              onClick={() => acceptRequest()}
            >
              <CheckIcon className="h-5 w-5 mr-2" />
              Accept
            </LoadingButton>
            <LoadingButton
              type="button"
              className="flex flex-row items-center py-1 px-3 text-md bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white transition ease-in duration-100 text-center font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
              isLoading={isLoading}
              onClick={() => declineRequest()}
            >
              <XIcon className="h-5 w-5 mr-2" />
              Decline
            </LoadingButton>
          </>
        ) : (
          <LoadingButton
            type="button"
            className="flex flex-row items-center py-1 px-3 text-md bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white transition ease-in duration-100 text-center font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
            isLoading={isLoading}
            onClick={() => cancelRequest()}
          >
            <XIcon className="h-5 w-5 mr-2" />
            Cancel
          </LoadingButton>
        )}
      </div>
    </div>
  );
};

type RequestedMeetingsProps = {
  mentorship: Mentorship;
  perspective: "mentor" | "mentee";
  requests: MeetingRequest[];
};

const RequestedMeetings = ({
  mentorship,
  perspective,
  requests,
}: RequestedMeetingsProps) => {
  return requests.length > 0 ? (
    <div className="my-3">
      <h3 className="text-xl font-bold">Requested Meetings</h3>
      {requests.map((request) => (
        <RequestedMeeting
          mentorship={mentorship}
          key={request.id}
          perspective={perspective}
          request={request}
        />
      ))}
      <hr />
    </div>
  ) : null;
};

type ScheduledMeetingProps = {
  mentorship: Mentorship;
  meeting: Meeting;
};

const ScheduledMeeting = ({ mentorship, meeting }: ScheduledMeetingProps) => {
  const datetime = DateTime.fromISO(meeting.time);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const cancelMeeting = async () => {
    setIsLoading(true);
    setError(undefined);

    const res = await fetch(
      UPDATE_MEETING_ENDPOINT.replace("{ID}", meeting.id.toString()),
      {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          authorization: `Token ${getAuthToken()}`,
        },
      }
    );

    const body = await res.json();

    if (res.ok) {
      // Revalidate the caches for mentorship information
      mutate(MENTORSHIP_ENDPOINT.replace("{ID}", mentorship.id.toString()));
    } else {
      setError(
        body.error?.join(" ") ??
          "An error occured when cancelling this meeting. Please try again."
      );
    }

    setIsLoading(false);
  };

  return (
    <div className="w-full flex justify-between my-2 rounded-lg px-2 py-1">
      <div>
        <h6 className="flex items-center gap-2">
          {datetime.toFormat("DDDD, t ZZZZ")}
        </h6>
        <p className="text-sm text-gray-700">{meeting.description}</p>
        <LocationText location={meeting.location} />
        {error && (
          <div className="block text-sm m-1 font-medium text-red-700">
            {error}
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <LoadingButton
          type="button"
          className="flex flex-row items-center py-1 px-3 text-md bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white transition ease-in duration-100 text-center font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
          isLoading={isLoading}
          onClick={() => cancelMeeting()}
        >
          <XIcon className="h-5 w-5 mr-2" />
          Cancel
        </LoadingButton>
      </div>
    </div>
  );
};

type ScheduledMeetingsProps = {
  mentorship: Mentorship;
  scheduled: Meeting[];
};

const ScheduledMeetings = ({
  mentorship,
  scheduled,
}: ScheduledMeetingsProps) => {
  return scheduled.length > 0 ? (
    <div className="my-3">
      <h3 className="text-xl font-bold">Scheduled Meetings</h3>
      {scheduled.map((meeting) => (
        <ScheduledMeeting
          key={meeting.id}
          mentorship={mentorship}
          meeting={meeting}
        />
      ))}
      <hr />
    </div>
  ) : null;
};

type MentoringMeetingsProps = {
  perspective: "mentor" | "mentee";
  mentorship: Mentorship;
  meetings: Meeting[];
  requests: MeetingRequest[];
};

export default function MentoringMeetings({
  perspective,
  mentorship,
  meetings,
  requests,
}: MentoringMeetingsProps) {
  const [isRequestingMeeting, setIsRequestingMeeting] = useState(false);

  // Sort meetings by date, newest first
  const sortedMeetings = meetings.sort(
    (a, b) => Date.parse(a.time) - Date.parse(b.time)
  );
  const scheduledMeetings = sortedMeetings.filter(
    (meeting) => Date.parse(meeting.time) > Date.now()
  );
  const pastMeetings = sortedMeetings.filter(
    (meeting) => Date.parse(meeting.time) <= Date.now()
  );

  return (
    <>
      {perspective === "mentee" && (
        <>
          <RequestMeetingPopup
            mentorship={mentorship}
            isOpen={isRequestingMeeting}
            closeModal={() => setIsRequestingMeeting(false)}
          />
          <button
            onClick={() => setIsRequestingMeeting(true)}
            className="my-3 py-2 px-10 flex justify-center items-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg shadow-md"
          >
            <CalendarIcon className="w-5 h-5 mr-2" />
            Request a meeting
          </button>
        </>
      )}

      <RequestedMeetings
        mentorship={mentorship}
        perspective={perspective}
        requests={requests}
      />
      <ScheduledMeetings
        mentorship={mentorship}
        scheduled={scheduledMeetings}
      />

      <h3 className="text-xl font-bold mb-2">Previous Meetings</h3>

      <div className="flex flex-col gap-2">
        {pastMeetings.map((meeting) => (
          <MeetingInfo
            key={meeting.id}
            mentorship={mentorship}
            meeting={meeting}
            perspective={perspective}
          />
        ))}
      </div>
    </>
  );
}
