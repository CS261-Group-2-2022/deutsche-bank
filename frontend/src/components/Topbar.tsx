import {
  BellIcon,
  CogIcon,
  LogoutIcon,
  ChatAlt2Icon,
} from "@heroicons/react/solid";
import { Link, NavLink } from "react-router-dom";
import { useUser } from "../utils/authentication";
import { useBusinessAreas } from "../utils/business_area";

type MenuButtonProps = {
  text: string;
  to: string;
};

function MenuButton({ text, to }: MenuButtonProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `text-base font-medium text-gray-${
          isActive ? "800" : "400"
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
                areas.find((area) => area.id == user?.business_area)?.name ?? ""
              }
            />
          </div>

          {/* Central Buttons */}
          <nav className="hidden md:flex space-x-10">
            <MenuButton text="Home" to="/" />
            <MenuButton text="Mentoring" to="/mentoring" />
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
