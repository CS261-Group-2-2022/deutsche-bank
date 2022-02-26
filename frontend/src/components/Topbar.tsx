import { Popover, Transition } from "@headlessui/react";
import {
  BellIcon,
  CogIcon,
  LogoutIcon,
  ChatAlt2Icon,
  ChevronDownIcon,
  IdentificationIcon,
  UserGroupIcon,
} from "@heroicons/react/solid";
import { Fragment } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useUser } from "../utils/authentication";
import { getAreaFromId, useBusinessAreas } from "../utils/business_area";

type MenuButtonProps = {
  text: string;
  to: string;
};

/** Special Dropdown topbar button to display mentoring links */
function MentoringButton() {
  const location = useLocation();
  const isActive = location.pathname.startsWith("/mentoring");

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={`
              ${isActive || open ? "text-gray-900" : "text-gray-400"}
              group bg-white rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 transition-colors duration-200`}
          >
            <span>Mentoring</span>
            <ChevronDownIcon
              className={`${
                isActive || open ? "text-gray-900" : "text-gray-400"
              } ml-1 h-5 w-5 group-hover:text-gray-900 transition-colors duration-200`}
              aria-hidden="true"
            />
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-10 -ml-4 mt-3 transform px-2 w-screen max-w-md sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2">
              <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                  <Link
                    className="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50"
                    to="/mentoring/me"
                  >
                    <IdentificationIcon
                      className="flex-shrink-0 h-6 w-6 text-blue-600"
                      aria-hidden="true"
                    />
                    <div className="ml-4">
                      <p className="text-base font-medium text-gray-900">
                        Your Profile
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        View your profile and mentor information
                      </p>
                    </div>
                  </Link>
                  <Link
                    className="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50"
                    to="/mentoring/mentees"
                  >
                    <UserGroupIcon
                      className="flex-shrink-0 h-6 w-6 text-blue-600"
                      aria-hidden="true"
                    />
                    <div className="ml-4">
                      <p className="text-base font-medium text-gray-900">
                        Your Mentees
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        View all the mentees you are currently mentoring
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}

function MenuButton({ text, to }: MenuButtonProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `text-base font-medium ${
          isActive ? "text-gray-800" : "text-gray-400"
        } rounded-md hover:text-gray-800 transition-colors duration-200`
      }
    >
      <span className="sr-only">{text}</span>
      {text}
    </NavLink>
  );
}

type DashboardUserHeroProps = {
  name: string;
  businessArea: string;
};

export function DashboardUserHero({
  name,
  businessArea,
}: DashboardUserHeroProps) {
  return (
    <div className="bg-white">
      <div className="flex flex-row lg:items-center lg:justify-between w-full py-2 z-20">
        <div className="flex flex-row items-center gap-3">
          <div className="flex-shrink-0">
            <a href="#" className="block relative">
              <img
                alt="profil"
                src="https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg"
                className="mx-auto object-cover rounded-full h-10 w-10"
              />
            </a>
          </div>
          <h2>
            <span className="block text-m font-bold">{name}</span>
            <span className="block text-sm text-gray-500">{businessArea}</span>
          </h2>
        </div>
      </div>
    </div>
  );
}

export default function Topbar() {
  const { user } = useUser();
  const { areas } = useBusinessAreas();

  return (
    <div className="relative bg-white">
      <div className="mx-auto px-4 sm:px-6 mb-2">
        <div className="flex justify-between items-center md:justify-start md:space-x-10">
          {/* LHS Panel */}
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <DashboardUserHero
              name={`${user?.first_name} ${user?.last_name}`}
              businessArea={
                getAreaFromId(user?.business_area ?? -1, areas)?.name ?? ""
              }
            />
          </div>

          {/* Central Buttons */}
          <nav className="hidden md:flex space-x-10">
            <MenuButton text="Home" to="/" />
            <MentoringButton />
            <MenuButton text="Group Events" to="/groups" />
          </nav>

          {/* RHS Panel */}
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            <Link
              to="/feedback"
              className="flex text-gray-600 hover:text-gray-800 items-center mr-5"
            >
              Feedback
              <ChatAlt2Icon className={"ml-2 h-5 w-5"} aria-hidden="true" />
            </Link>
            <BellIcon
              className={"text-gray-600 ml-2 h-5 w-5 group-hover:text-gray-500"}
              aria-hidden="true"
            />
            <Link to="/settings">
              <p title="Settings">
                <CogIcon
                  className={
                    "text-gray-600 ml-2 h-5 w-5 group-hover:text-gray-500"
                  }
                  aria-hidden="true"
                />
              </p>
            </Link>
            <Link to="/logout">
              <p title="Logout">
                <LogoutIcon
                  className={
                    "text-gray-600 ml-2 h-5 w-5 group-hover:text-gray-500"
                  }
                  aria-hidden="true"
                />
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
