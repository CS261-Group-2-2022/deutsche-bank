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
      className="bg-neutral-50 rounded-xl border-gray-200 border-2 p-2 text-center"
      onClick={() => setOpenedPlanOfAction(planOfAction)}
    >
      <div className="flex items-center space-x-4">
        <div className="flex-auto flex-col">
          <h1 className="flex font-bold">{planOfAction.name}</h1>
          <div className="flex space-x-1">{planOfAction.description}</div>
          <DateTextProps date={planOfAction.due_date} />
        </div>
      </div>
    </button>
  );
}
