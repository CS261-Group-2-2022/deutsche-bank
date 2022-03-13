import { getAreaFromId, useBusinessAreas } from "../../utils/business_area";
import { User, UserFull } from "../../utils/endpoints";
import UserAvatar from "../UserAvatar";

type UserPanelProps = {
  user: User | UserFull;
  extra_information?: React.ReactNode;
  actions?: React.ReactNode;
};

const isUserFull = (user: User | UserFull): user is UserFull => {
  return typeof user.business_area !== "number";
};

export const UserPanel = ({
  user,
  extra_information,
  actions,
}: UserPanelProps) => {
  const { areas } = useBusinessAreas();

  return (
    <div className="bg-white border rounded-md w-full">
      <div className="flex flex-row items-center px-3 py-1">
        {/* Image */}
        <UserAvatar size={16} user={user} />

        {/* Information */}
        <div className="flex-auto ml-2">
          <h3 className="text-gray-800 font-medium text-lg">
            {user.first_name} {user.last_name}
            <span className="ml-1 text-base font-normal text-gray-700">
              (
              <a
                href={`mailto:${user.email}`}
                className="hover:text-blue-600 transition-colors duration-75"
              >
                {user.email}
              </a>
              )
            </span>
          </h3>
          <h4 className="text-gray-500">
            {isUserFull(user)
              ? user.business_area.name
              : getAreaFromId(user.business_area, areas)?.name ?? ""}
          </h4>

          {extra_information}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row gap-1">{actions}</div>
      </div>
    </div>
  );
};
