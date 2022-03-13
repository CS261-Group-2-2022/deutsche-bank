import {
  PlusIcon,
  ChartPieIcon,
  CheckCircleIcon,
} from "@heroicons/react/solid";
import { PlanOfAction, User } from "../../utils/endpoints";
import PlanOfActionInfo from "./PlanOfActionInfo";

type PlansOfActionColumnProps = {
  mentee: User;
  is_completed_goals: boolean;
  plansOfActionData: PlanOfAction[];
  setOpenedPlanOfAction: (plan: PlanOfAction) => unknown;
  setCreatePlanOfActionOpen: (open: boolean) => unknown;
};

export default function PlansOfActionColumn({
  is_completed_goals,
  plansOfActionData,
  setOpenedPlanOfAction,
  setCreatePlanOfActionOpen,
}: PlansOfActionColumnProps) {
  const filteredPlans = plansOfActionData
    .filter((plan) => (is_completed_goals ? plan.completed : !plan.completed))
    .sort((a, b) => Date.parse(a.due_date) - Date.parse(b.due_date));

  return (
    <div className="flex flex-col h-[75vh] bg-gray-100 rounded-xl border-gray-300 border p-2 text-center ">
      <h4 className="flex items-center text-l sm:text-xl font-semibold ml-3">
        {is_completed_goals ? (
          <CheckCircleIcon className="mr-2 h-5 w-5 mb-2" />
        ) : (
          <ChartPieIcon className="mr-2 h-5 w-5 mb-2" />
        )}
        <span className="mb-2">
          {is_completed_goals ? "Completed Goals" : "Current Goals"}
        </span>
      </h4>
      <div className="flex flex-col justify-start gap-1 grow overflow-auto">
        {filteredPlans.length == 0 ? (
          <div className="align-items">
            You have no {is_completed_goals ? "completed" : "ongoing"} plans of
            action
          </div>
        ) : (
          filteredPlans.map((plan) => (
            <PlanOfActionInfo
              key={plan.id}
              planOfAction={plan}
              setOpenedPlanOfAction={setOpenedPlanOfAction}
            />
          ))
        )}
      </div>
      {!is_completed_goals && (
        <button
          className="items-center gap-2 justify-center flex rounded-xl border-gray-200 border-2 p-2 text-center font-bold w-full mt-3 bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white"
          onClick={() => setCreatePlanOfActionOpen(true)}
        >
          <PlusIcon className="w-5" />
          Create new Goal
        </button>
      )}
    </div>
  );
}
