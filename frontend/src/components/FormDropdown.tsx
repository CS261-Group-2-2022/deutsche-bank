/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

export interface DropdownOption {
  id: number;
  name: string;
  // image?: string;
}

type DropdownItemProps<T extends DropdownOption> = {
  item: T;
  selected?: boolean;
};

function DropdownItem<T extends DropdownOption>({
  item,
  selected,
}: DropdownItemProps<T>) {
  return (
    <div className="flex items-center">
      <span
        className={`${
          selected ? "font-semibold" : "font-normal"
        } ml-1 block truncate`}
      >
        {item.name}
      </span>
    </div>
  );
}

export type FormDropdownProps<T extends DropdownOption> = {
  title: string;
  options: T[];
  selected?: T;
  setSelected: (selected: T) => unknown;
  placeholder?: string;
  error?: string;
};

export default function FormDropdown<T extends DropdownOption>({
  title,
  selected,
  options,
  setSelected,
  placeholder,
  error,
}: FormDropdownProps<T>) {
  const borderColour = error ? "red" : "gray";
  const focusBorderColour = error ? "red" : "blue";

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <div>
          <Listbox.Label className="block text-sm font-medium text-gray-700">
            {title}
          </Listbox.Label>
          <div className="mt-1 relative">
            <Listbox.Button
              className={`relative w-full bg-white border border-${borderColour}-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-${focusBorderColour}-500 focus:border-${focusBorderColour}-500 sm:text-sm transition`}
            >
              {selected ? (
                <DropdownItem item={selected} />
              ) : (
                <DropdownItem
                  item={{ id: -1, name: placeholder ?? "Select an item" }}
                />
              )}
              <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {options.map((option) => (
                  <Listbox.Option
                    key={option.id}
                    className={({ active }) =>
                      `${
                        active ? "text-white bg-blue-600" : "text-gray-900"
                      } cursor-default select-none relative py-2 pl-3 pr-9`
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <DropdownItem item={option} selected={selected} />
                        {selected ? (
                          <span
                            className={`${
                              active ? "text-white" : "text-blue-600"
                            } absolute inset-y-0 right-0 flex items-center pr-4`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
          {error && (
            <div className="block text-sm m-1 font-medium text-red-700">
              {error}
            </div>
          )}
        </div>
      )}
    </Listbox>
  );
}
