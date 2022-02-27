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
import { Meeting, MeetingRequest } from "../../utils/endpoints";
import { FormTextArea } from "../FormTextarea";
import LocationText from "../LocationText";
import RequestMeetingPopup from "../RequestAMeetingPopup";

type MeetingProps = {
  meeting: Meeting;
  perspective: "mentor" | "mentee";
};

function MeetingInfo({ meeting, perspective }: MeetingProps) {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [menteeNotes, setMenteeNotes] = useState(meeting.mentee_notes ?? "");
  const [mentorNotes, setMentorNotes] = useState(meeting.mentor_notes ?? "");
  const isMentor = perspective === "mentor";

  const datetime = DateTime.fromISO(meeting.time);
  const notesNotRecorded =
    (isMentor && mentorNotes === "") || (!isMentor && menteeNotes === "");

  // TODO: connect updating to backend

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
                    <button
                      className="ml-2 px-4 flex justify-center items-center  bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                      onClick={() => setIsEditingNotes((current) => !current)}
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
                    </button>
                  )}
                </h5>
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
                    <button
                      className="ml-2 px-4 flex justify-center items-center  bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                      onClick={() => setIsEditingNotes((current) => !current)}
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
                    </button>
                  )}
                </h5>
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
  request: MeetingRequest;
  perspective: "mentor" | "mentee";
};

const RequestedMeeting = ({ request, perspective }: RequestedMeetingProp) => {
  const datetime = DateTime.fromISO(request.time);

  // TODO: connect accept/decline/cancel to backend

  return (
    <div className="w-full flex justify-between my-2 rounded-lg px-2 py-1">
      <div>
        <h6 className="flex items-center gap-2">
          {datetime.toFormat("DDDD, t ZZZZ")}
        </h6>
        <p className="text-sm text-gray-700">{request.description}</p>
        <LocationText location={request.location} />
      </div>
      <div className="flex items-center gap-3">
        {perspective === "mentor" ? (
          <>
            <button
              type="button"
              className="flex flex-row items-center py-1 px-3 text-md bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white transition ease-in duration-100 text-center font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
            >
              <CheckIcon className="h-5 w-5 mr-2" />
              Accept
            </button>
            <button
              type="button"
              className="flex flex-row items-center py-1 px-3 text-md bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white transition ease-in duration-100 text-center font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
            >
              <XIcon className="h-5 w-5 mr-2" />
              Decline
            </button>
          </>
        ) : (
          <button
            type="button"
            className="flex flex-row items-center py-1 px-3 text-md bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white transition ease-in duration-100 text-center font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
          >
            <XIcon className="h-5 w-5 mr-2" />
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

type RequestedMeetingsProps = {
  perspective: "mentor" | "mentee";
};

const RequestedMeetings = ({ perspective }: RequestedMeetingsProps) => {
  // TODO: connect from backend
  const requested_meetings: MeetingRequest[] = [
    {
      id: 1,
      time: new Date(Date.now() + 100 * 100).toISOString(),
      location: "Narina",
      description: "Want to talk about goals",
      mentorship: 1,
    },
  ];

  return requested_meetings.length > 0 ? (
    <div className="my-3">
      <h3 className="text-xl font-bold">Requested Meetings</h3>
      {requested_meetings.map((request) => (
        <RequestedMeeting
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
  meeting: Meeting;
};

const ScheduledMeeting = ({ meeting }: ScheduledMeetingProps) => {
  const datetime = DateTime.fromISO(meeting.time);

  // TODO: connect cancel to backend

  return (
    <div className="w-full flex justify-between my-2 rounded-lg px-2 py-1">
      <div>
        <h6 className="flex items-center gap-2">
          {datetime.toFormat("DDDD, t ZZZZ")}
        </h6>
        <p className="text-sm text-gray-700">{meeting.description}</p>
        <LocationText location={meeting.location} />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex flex-row items-center py-1 px-3 text-md bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white transition ease-in duration-100 text-center font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
        >
          <XIcon className="h-5 w-5 mr-2" />
          Cancel
        </button>
      </div>
    </div>
  );
};

const ScheduledMeetings = () => {
  // TODO: connect from backend
  const scheduled_meeting: Meeting[] = [];

  return scheduled_meeting.length > 0 ? (
    <div className="my-3">
      <h3 className="text-xl font-bold">Scheduled Meetings</h3>
      {scheduled_meeting.map((meeting) => (
        <ScheduledMeeting key={meeting.id} meeting={meeting} />
      ))}
      <hr />
    </div>
  ) : null;
};

type MentoringMeetingsProps = {
  perspective: "mentor" | "mentee";
};

export default function MentoringMeetings({
  perspective,
}: MentoringMeetingsProps) {
  const meetings: Meeting[] = [
    {
      id: 1,
      time: new Date(Date.now() + 1000).toISOString(),
      mentee_notes: "",
      mentor_notes: "",
      mentorship: 1,
      location: "Lecture Hall",
      description: "Looking to learn more about what I can do to improve",
    },
  ];

  // TODO: sort meetings by date, newest first?

  const [isRequestingMeeting, setIsRequestingMeeting] = useState(false);

  return (
    <>
      {perspective === "mentee" && (
        <>
          <RequestMeetingPopup
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

      <RequestedMeetings perspective={perspective} />
      <ScheduledMeetings />

      <div className="flex flex-col gap-2">
        {meetings.map((meeting) => (
          <MeetingInfo
            key={meeting.id}
            meeting={meeting}
            perspective={perspective}
          />
        ))}
      </div>
    </>
  );
}
