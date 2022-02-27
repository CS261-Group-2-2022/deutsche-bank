import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon, XIcon } from "@heroicons/react/solid";
import { colourFromName } from "../utils/colours";

export interface DropdownOption {
  id: number;
  name: string;
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

export type FormMultiSelectProps<T extends DropdownOption> = {
  title: string;
  subtitle?: string;
  options: T[];
  selected?: T[];
  setSelected: React.Dispatch<React.SetStateAction<T[]>>;
  placeholder?: string;
  error?: string;
  required?: boolean;
  hashColouredLabels?: boolean;
};

export default function FormMultiSelect<T extends DropdownOption>({
  title,
  subtitle,
  selected,
  options,
  setSelected,
  placeholder,
  error,
  required = false,
  hashColouredLabels = false,
}: FormMultiSelectProps<T>) {
  const borderColour = error ? "red" : "gray";
  const focusBorderColour = error ? "red" : "blue";

  const isSelected = (item: T) => selected?.includes(item);

  const updateSelection = (item: T) => {
    setSelected((current) => {
      if (current.includes(item)) {
        return current.filter((x) => x.id != item.id);
      } else {
        return [...current, item];
      }
    });
  };

  const removeItem = (item: T) => {
    setSelected((current) => current.filter((x) => x.id != item.id));
  };

  return (
    // @ts-expect-error because we need to
    <Listbox value={selected} onChange={updateSelection}>
      {({ open }) => (
        <div>
          <Listbox.Label className="flex flex-row text-sm font-medium text-gray-700">
            {title}
            {required && <p className="text-red-500 pl-1">*</p>}
          </Listbox.Label>
          {subtitle && <p className="text-xs text-gray-600">{subtitle}</p>}
          <div className="mt-1 relative">
            <Listbox.Button
              className={`relative w-full bg-white border border-${borderColour}-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-${focusBorderColour}-500 focus:border-${focusBorderColour}-500 sm:text-sm transition`}
            >
              {selected && selected.length > 0 ? (
                selected.map((item) => (
                  <div
                    key={item.id}
                    className={`inline-flex items-center px-1 mr-1 mt-1 rounded text-gray-700 ${
                      hashColouredLabels
                        ? colourFromName(item.name)
                        : "bg-blue-600"
                    }`}
                  >
                    {item.name}
                    <div
                      className="ml-1 rounded-full cursor-pointer"
                      onClick={() => removeItem(item)}
                    >
                      <XIcon className="h-4 w-4" aria-hidden="true" />
                    </div>
                  </div>
                ))
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
                    {({ active }) => (
                      <>
                        <DropdownItem
                          item={option}
                          selected={isSelected(option)}
                        />
                        {isSelected(option) ? (
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
