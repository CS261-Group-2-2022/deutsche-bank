import { useState } from "react";
import { Link } from "react-router-dom";
import { SemanticClassificationFormat } from "typescript";
import { PlanOfAction } from "../../utils/endpoints";
import DateTextProps from "../DateText";
import LocationText from "../LocationText";
import PlanOfActionPopup from "./PlanOfActionPopup";

type PlanOfActionProps = {
  planOfAction: PlanOfAction;
};

export default function PlanOfActionInfo({ planOfAction }: PlanOfActionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button
      className="bg-neutral-50 rounded-2xl border-gray-200 border-2 p-2 text-center h-full"
      onClick={() => setIsOpen(true)}
    >
      <div className="flex items-center space-x-4">
        <div className="flex-auto flex-col">
          <h1 className="font-bold flex">{planOfAction.name}</h1>
          <div className="flex space-x-1">{planOfAction.description}</div>
          <DateTextProps date={"2025-04-11T14:46:00Z"} />
          <PlanOfActionPopup
            planOfAction={planOfAction}
            isOpen={isOpen}
            closeModal={() => setIsOpen(false)}
          />
        </div>
      </div>
    </button>
  );
}
