import { getAreaFromId, useBusinessAreas } from "../utils/business_area";
import { User } from "../utils/endpoints";
import SessionTopicLabel from "./SessionTopicLabel";

type UserPanelProps = {
  user: User;
  extra_information?: React.ReactNode;
  actions?: React.ReactNode;
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
        <div className="bg-gray-500 rounded-full aspect-square w-16 h-16"></div>

        {/* Information */}
        <div className="flex-auto ml-2">
          <h3 className="text-gray-800 font-medium text-lg">
            {user.first_name} {user.last_name}
          </h3>
          <h4 className="text-gray-500">
            {getAreaFromId(user.business_area, areas)?.name ?? ""}
          </h4>

          {extra_information}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row gap-1">{actions}</div>
      </div>
    </div>
  );
};
