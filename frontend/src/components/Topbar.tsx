import { BellIcon } from "@heroicons/react/solid";
import { NavLink } from "react-router-dom";

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

export default function Topbar() {
  return (
    <div className="relative bg-white">
      <div className="mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-3 md:justify-start md:space-x-10">
          {/* LHS Panel */}
          <div className="flex justify-start lg:w-0 lg:flex-1" />

          {/* Central Buttons */}
          <nav className="hidden md:flex space-x-10">
            <MenuButton text="Home" to="/" />
            <MenuButton text="Mentoring" to="/mentoring" />
            <MenuButton text="Group Sessions" to="/groups" />
          </nav>

          {/* RHS Panel */}
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            <BellIcon
              className={"text-gray-600 ml-2 h-5 w-5 group-hover:text-gray-500"}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
