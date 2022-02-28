import { useState } from "react";
import { PlanOfAction, User, UserFull } from "../../utils/endpoints";
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

  return (
    <div>
      <div className="grid grid-cols-2 gap-5 mt-5">
        <PlansOfActionColumn
          is_completed_goals={false} setOpenedPlanOfAction={function (plan: PlanOfAction): unknown {
            throw new Error("Function not implemented.");
          } } setOpenedCreatePlanOfAction={function (plan: PlanOfAction): unknown {
            throw new Error("Function not implemented.");
          } }        />
        <PlansOfActionColumn
          is_completed_goals={true}
          setOpenedCreatePlanOfAction={setOpenedPlanOfAction} setOpenedPlanOfAction={function (plan: PlanOfAction): unknown {
            throw new Error("Function not implemented.");
          } }        />
      </div>
    </div>
  );
}
