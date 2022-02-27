import { PlanOfAction } from "../../utils/endpoints";
import DateTextProps from "../DateText";

type PlanOfActionProps = {
  planOfAction: PlanOfAction;
  setOpenedPlanOfAction: (plan: PlanOfAction) => unknown;
};

export default function PlanOfActionInfo({
  planOfAction,
  setOpenedPlanOfAction,
}: PlanOfActionProps) {
  return (
    <button
      className="bg-neutral-50 rounded-2xl border-gray-200 border-2 p-2 text-center h-full"
      onClick={() => setOpenedPlanOfAction(planOfAction)}
    >
      <div className="flex items-center space-x-4">
        <div className="flex-auto flex-col">
          <h1 className="font-bold flex">{planOfAction.name}</h1>
          <div className="flex space-x-1">{planOfAction.description}</div>
          <DateTextProps date={"2025-04-11T14:46:00Z"} />
        </div>
      </div>
    </button>
  );
}
