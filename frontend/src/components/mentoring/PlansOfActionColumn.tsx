import {
  CalendarIcon,
  PlusIcon,
  ChartPieIcon,
  CheckCircleIcon,
} from "@heroicons/react/solid";
import useSWR from "swr";
import { useUser } from "../../utils/authentication";
import {
  GET_USERS_PLANS,
  PlanOfAction,
  PlanOfActionResponse,
} from "../../utils/endpoints";
import PlanOfActionInfo from "./PlanOfActionInfo";

type PlansOfActionColumnProps = {
  is_completed_goals: boolean;
  setOpenedPlanOfAction: (plan: PlanOfAction) => unknown;
  setCreatePlanOfActionOpen: (open: boolean) => unknown;
};

export default function PlansOfActionColumn({
  is_completed_goals,
  setOpenedPlanOfAction,
  setCreatePlanOfActionOpen,
}: PlansOfActionColumnProps) {
  const { user } = useUser();

  let { data: plansOfActionData } = useSWR<PlanOfActionResponse>(
    GET_USERS_PLANS.replace("{ID}", user?.id.toString() ?? "-1")
  );

  plansOfActionData = plansOfActionData ?? [
    {
      name: "No Plans Found",
      description: "No Plans Found but as a Description",
      completed: "1111-11-11T11:11:11Z",
      dueDate: "1111-11-11T11:11:11Z",
    },
  ];

  // const plansOfActionData = [
  //   {
  //     name: "Plan Name1",
  //     description: "Plan Description",
  //     // user: useUser().user,
  //     creation_date: "Creation Date",
  //     completion_date: "Completion Date",
  //   },
  // ];

  // let allSessions = [...allJoinedSessions, ...allHostSessions];
  // allSessions = allSessions
  //   .sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
  //   .filter((c) => Date.parse(c.date) >= Date.now());

  return (
    <div className="flex flex-col h-[75vh] bg-gray-100 rounded-2xl border-gray-200 border-2 p-2 text-center ">
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
        {plansOfActionData?.length == 0 ? (
          <div className="align-items-">You have no plans of action</div>
        ) : (
          plansOfActionData?.map((plan) => (
            <PlanOfActionInfo
              key={plan.name}
              planOfAction={plan}
              setOpenedPlanOfAction={setOpenedPlanOfAction}
            />
            // TODO here make key equal to something unique, for example the id of the plan of action
          ))
        )}
      </div>
      {!is_completed_goals && (
        <button
          className="items-center gap-2 justify-center flex rounded-2xl border-gray-200 border-2 p-2 text-center font-bold w-full mt-3 bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white"
          onClick={() => setCreatePlanOfActionOpen(true)}
        >
          <PlusIcon className="w-5" />
          Create new Goal
        </button>
      )}
    </div>
  );
}
