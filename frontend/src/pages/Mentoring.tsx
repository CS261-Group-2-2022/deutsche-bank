import { Tab } from "@headlessui/react";
import {
  ArrowRightIcon,
  CalendarIcon,
  ExclamationIcon,
  UserGroupIcon,
} from "@heroicons/react/solid";
import { Link } from "react-router-dom";
import RoundedImage from "../components/RoundedImage";
import Topbar from "../components/Topbar";

type SubheadingTabProps = {
  name: string;
};

function SubheadingTab({ name }: SubheadingTabProps) {
  return (
    <Tab
      key={name}
      className={({ selected }) =>
        `w-full py-2.5 text-sm leading-5 font-medium rounded-lg focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60 transition-colors duration-200 ${
          selected
            ? "bg-white shadow text-black"
            : "text-gray-500 hover:bg-white/[0.25]"
        }`
      }
    >
      {name}
    </Tab>
  );
}

const posts = [
  {
    id: 1,
    title: "Does drinking coffee make you smarter?",
    date: "5h ago",
    commentCount: 5,
    shareCount: 2,
  },
  {
    id: 2,
    title: "So you've bought coffee... now what?",
    date: "2h ago",
    commentCount: 3,
    shareCount: 2,
  },
];

function YourMentorPage() {
  return (
    <Tab.Panel key="Your Mentor" className="bg-white p-3">
      <ul>
        {posts.map((post) => (
          <li
            key={post.id}
            className="relative p-3 rounded-md hover:bg-coolGray-100"
          >
            <h3 className="text-sm font-medium leading-5">{post.title}</h3>

            <ul className="flex mt-1 space-x-1 text-xs font-normal leading-4 text-coolGray-500">
              <li>{post.date}</li>
              <li>&middot;</li>
              <li>{post.commentCount} comments</li>
              <li>&middot;</li>
              <li>{post.shareCount} shares</li>
            </ul>

            <a
              href="#"
              className="absolute inset-0 rounded-md focus:z-10 focus:outline-none focus:ring-2 ring-blue-400"
            />
          </li>
        ))}
      </ul>
    </Tab.Panel>
  );
}

function YourMenteesPage() {
  return (
    <Tab.Panel
      key="Your Mentees"
      className="bg-white rounded-xl p-3 focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60"
    >
      <ul>
        {posts.map((post) => (
          <li
            key={post.id}
            className="relative p-3 rounded-md hover:bg-coolGray-100"
          >
            <h3 className="text-sm font-medium leading-5">{post.title}</h3>

            <ul className="flex mt-1 space-x-1 text-xs font-normal leading-4 text-coolGray-500">
              <li>{post.date}</li>
              <li>&middot;</li>
              <li>{post.commentCount} comments</li>
              <li>&middot;</li>
              <li>{post.shareCount} shares</li>
            </ul>

            <a
              href="#"
              className="absolute inset-0 rounded-md focus:z-10 focus:outline-none focus:ring-2 ring-blue-400"
            />
          </li>
        ))}
      </ul>
    </Tab.Panel>
  );
}

export default function Mentoring() {
  return (
    <>
      <Topbar />
      <div className="relative mx-5">
        <Tab.Group>
          <Tab.List className="flex p-1 space-x-2 bg-gray-200 rounded-xl">
            <SubheadingTab name="Your Mentor" />
            <SubheadingTab name="Your Mentees" />
          </Tab.List>
          <Tab.Panels className="mt-2">
            <YourMentorPage />
            <YourMenteesPage />
          </Tab.Panels>
        </Tab.Group>
      </div>
    </>
  );
}
