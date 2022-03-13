import { Switch } from "@headlessui/react";

type ToggleProps = {
  name: string;
  enabled: boolean;
  setEnabled: (enabled: boolean) => unknown;
};

export default function Toggle({ name, enabled, setEnabled }: ToggleProps) {
  return (
    <div>
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={`${enabled ? "bg-blue-600" : "bg-gray-800"}
          relative inline-flex flex-shrink-0 h-[28px] w-[64px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        <span className="sr-only">{name}</span>
        <span
          aria-hidden="true"
          className={`${enabled ? "translate-x-9" : "translate-x-0"}
            pointer-events-none inline-block h-[24px] w-[24px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
        />
      </Switch>
    </div>
  );
}
