import { useEffect, useState } from "react";
import useSWR from "swr";
import {
  LIST_USER_PLANS,
  PlanOfAction,
  PlanOfActionResponse,
  User,
  UserFull,
} from "../../utils/endpoints";
import CreatePlanOfActionPopup from "./CreatePlanOfActionPopup";
import PlanOfActionPopup from "./PlanOfActionPopup";
import PlansOfActionColumn from "./PlansOfActionColumn";

type PlansOfActionProps = {
  mentor: UserFull;
  mentee: User;
  perspective: "mentor" | "mentee";
};

export default function GeneralInfo({
  mentor,
  mentee,
  perspective,
}: PlansOfActionProps) {
  const [openedPlanOfAction, setOpenedPlanOfAction] = useState<
    PlanOfAction | undefined
  >();
  const [createPlanOfActionOpen, setCreatePlanOfActionOpen] = useState(false);

  const { data: plansOfActionData = [] } = useSWR<PlanOfActionResponse>(
    LIST_USER_PLANS.replace("{ID}", mentee.id.toString())
  );

  // When data updates, we should update the object stored in opened so it uses new information
  useEffect(() => {
    if (openedPlanOfAction) {
      setOpenedPlanOfAction(
        plansOfActionData.find((plan) => plan.id === openedPlanOfAction.id)
      );
    }
  }, [plansOfActionData]);

  return (
    <div>
      <PlanOfActionPopup
        planOfAction={openedPlanOfAction}
        isOpen={openedPlanOfAction !== undefined}
        closeModal={() => setOpenedPlanOfAction(undefined)}
      />
      <CreatePlanOfActionPopup
        isOpen={createPlanOfActionOpen}
        closeModal={() => setCreatePlanOfActionOpen(false)}
        menteeID={mentee.id}
      />

      <div className="grid grid-cols-2 gap-5 mt-5">
        <PlansOfActionColumn
          mentee={mentee}
          plansOfActionData={plansOfActionData}
          is_completed_goals={false}
          setOpenedPlanOfAction={setOpenedPlanOfAction}
          setCreatePlanOfActionOpen={setCreatePlanOfActionOpen}
        />
        <PlansOfActionColumn
          mentee={mentee}
          plansOfActionData={plansOfActionData}
          is_completed_goals={true}
          setOpenedPlanOfAction={setOpenedPlanOfAction}
          setCreatePlanOfActionOpen={setCreatePlanOfActionOpen}
        />
      </div>
    </div>
  );
}
