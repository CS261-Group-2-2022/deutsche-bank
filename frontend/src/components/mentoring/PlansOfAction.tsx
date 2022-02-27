import { useState } from "react";
import { PlanOfAction, User, UserFull } from "../../utils/endpoints";
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

  return (
    <div>
      <PlanOfActionPopup
        planOfAction={openedPlanOfAction}
        isOpen={openedPlanOfAction !== undefined}
        closeModal={() => setOpenedPlanOfAction(undefined)}
      />
      <div className="grid grid-cols-3 gap-5 mt-5">
        <PlansOfActionColumn
          is_completed_goals={false}
          setOpenedPlanOfAction={setOpenedPlanOfAction}
        />
        <PlansOfActionColumn
          is_completed_goals={true}
          setOpenedPlanOfAction={setOpenedPlanOfAction}
        />
      </div>
    </div>
  );
}
