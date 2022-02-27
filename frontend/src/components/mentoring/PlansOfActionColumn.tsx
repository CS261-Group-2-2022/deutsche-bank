import {
  CalendarIcon,
  PlusIcon,
  ChartPieIcon,
  CheckCircleIcon,
} from "@heroicons/react/solid";
import useSWR from "swr";
import { PlanOfAction, PlanOfActionResponse } from "../../utils/endpoints";
import PlanOfActionInfo from "./PlanOfActionInfo";
import { useUser } from "../../utils/authentication";

type PlansOfActionColumnProps = {
  is_completed_goals: boolean;
  setOpenedPlanOfAction: (plan: PlanOfAction) => unknown;
};

export default function PlansOfActionColumn({
  is_completed_goals,
  setOpenedPlanOfAction,
}: PlansOfActionColumnProps) {
  // let { data: plansOfActionData } = useSWR<PlanOfActionResponse>(
  //   "PLANS_OF_ACTION_ENDPOINT"
  // );
  // plansOfActionData = plansOfActionData ?? [
  //   {
  //     name: "Plan Name",
  //     description: "Plan Description",
  //     user: useUser(),
  //     creation_date: "Creation Date",
  //     completion_date: "Completion Date",
  //   },
  // ];

  const plansOfActionData = [
    {
      name: "Plan Name",
      description: "Plan Description",
      // user: useUser().user,
      creation_date: "Creation Date",
      completion_date: "Completion Date",
    },
    {
      name: "Plan Name",
      description: "Plan Description",
      // user: useUser().user,
      creation_date: "Creation Date",
      completion_date: "Completion Date",
    },
    {
      name: "Plan Name",
      description: "Plan Description",
      // user: useUser().user,
      creation_date: "Creation Date",
      completion_date: "Completion Date",
    },
    {
      name: "Plan Name",
      description: "Plan Description",
      // user: useUser().user,
      creation_date: "Creation Date",
      completion_date: "Completion Date",
    },
    {
      name: "Plan Name",
      description: "Plan Description",
      // user: useUser().user,
      creation_date: "Creation Date",
      completion_date: "Completion Date",
    },
    {
      name: "Plan Name",
      description: "Plan Description",
      // user: useUser().user,
      creation_date: "Creation Date",
      completion_date: "Completion Date",
    },
    {
      name: "Plan Name",
      description: "Plan Description",
      // user: useUser().user,
      creation_date: "Creation Date",
      completion_date: "Completion Date",
    },
    {
      name: "Plan Name",
      description: "Plan Description",
      // user: useUser().user,
      creation_date: "Creation Date",
      completion_date: "Completion Date",
    },
    {
      name: "Plan Name",
      description: "Plan Description",
      // user: useUser().user,
      creation_date: "Creation Date",
      completion_date: "Completion Date",
    },
    {
      name: "Plan Name",
      description: "Plan Description",
      // user: useUser().user,
      creation_date: "Creation Date",
      completion_date: "Completion Date",
    },
    {
      name: "Plan Name",
      description: "Plan Description",
      // user: useUser().user,
      creation_date: "Creation Date",
      completion_date: "Completion Date",
    },
  ];

  // let allSessions = [...allJoinedSessions, ...allHostSessions];
  // allSessions = allSessions
  //   .sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
  //   .filter((c) => Date.parse(c.date) >= Date.now());

  return (
    <div className="bg-gray-100 rounded-2xl border-gray-200 border-2 p-2 text-center h-2/5">
      <h4 className="text-l sm:text-xl font-semibold flex items-center ml-3">
        {is_completed_goals ? (
          <CheckCircleIcon className="mr-2 h-5 w-5 mb-2" />
        ) : (
          <ChartPieIcon className="mr-2 h-5 w-5 mb-2" />
        )}
        <span className="mb-2">
          {is_completed_goals ? "Completed Goals" : "Current Goals"}
        </span>
      </h4>
      <div className="justify justify-center grid grid-cols-1 gap-1 h-[94%] overflow-auto">
        {plansOfActionData.length == 0 ? (
          <div className="align-items-">You have no plans of action</div>
        ) : (
          plansOfActionData.map((plan) => (
            <PlanOfActionInfo
              key={plan.name}
              planOfAction={plan}
              setOpenedPlanOfAction={setOpenedPlanOfAction}
            />
          ))
        )}
      </div>
      {is_completed_goals ? (
        <></>
      ) : (
        <button className="items-center gap-2 justify-center flex rounded-2xl border-gray-200 border-2 p-2 text-center font-bold w-full mt-3 bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white">
          <PlusIcon className="w-5" />
          Create new Goal
        </button>
      )}
    </div>
  );
}
