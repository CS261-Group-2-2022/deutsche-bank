import zxcvbn from "zxcvbn";

export type PasswordStrengthIndicatorProps = {
  password: string;
  otherInputs?: string[];
  updateResult?: (score: number) => unknown;
};

export default function PasswordStrengthIndicator({
  password,
  otherInputs,
  updateResult,
}: PasswordStrengthIndicatorProps) {
  const strengthResult = zxcvbn(password, otherInputs);

  if (updateResult) {
    updateResult(strengthResult.score);
  }

  let colours = [];
  switch (strengthResult.score) {
    case 0:
    case 1:
      colours = ["bg-red-400", "bg-gray-200", "bg-gray-200", "bg-gray-200"];
      break;
    case 2:
      colours = [
        "bg-orange-400",
        "bg-orange-400",
        "bg-gray-200",
        "bg-gray-200",
      ];
      break;
    case 3:
      colours = [
        "bg-yellow-400",
        "bg-yellow-400",
        "bg-yellow-400",
        "bg-gray-200",
      ];
      break;
    case 4:
      colours = [
        "bg-green-400",
        "bg-green-400",
        "bg-green-400",
        "bg-green-400",
      ];
      break;
    default:
      colours = ["bg-gray-200", "bg-gray-200", "bg-gray-200", "bg-gray-200"];
      break;
  }

  return (
    <div className="space-y-1 mx-1">
      <div className="block text-sm font-medium text-gray-700">
        Password Strength
      </div>
      <div className="mt-1 relative grid grid-cols-4 gap-3">
        <span className={`${colours[0]} py-1 rounded-lg`} />
        <span className={`${colours[1]} py-1 rounded-lg`} />
        <span className={`${colours[2]} py-1 rounded-lg`} />
        <span className={`${colours[3]} py-1 rounded-lg`} />
      </div>
      <div className="block text-sm text-gray-700">
        {strengthResult.feedback.warning &&
          `${strengthResult.feedback.warning}. `}
        {strengthResult.feedback.suggestions.join(" ")}
      </div>
    </div>
  );
}
