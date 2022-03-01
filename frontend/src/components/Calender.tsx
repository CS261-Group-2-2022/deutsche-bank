import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { DateTime } from "luxon";
import { useState } from "react";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const NUM_ROWS = 6;
const NUM_COLUMNS = 7;

export const Calender = () => {
  const currentDate = DateTime.now();
  const [monthYear, setMonthYear] = useState(currentDate.startOf("month"));

  const startDay = monthYear.weekday;
  const daysInMonth = monthYear.daysInMonth;
  const numBlankOffsets = startDay - 1; // Number of blank cells to put at the start
  const numBlankEndings =
    NUM_ROWS * NUM_COLUMNS - numBlankOffsets - daysInMonth;

  // Don't allow dates in the past
  const disableDecreaseMonth = monthYear <= currentDate;

  const isToday = (day: number) => {
    return (
      monthYear.month === currentDate.month &&
      monthYear.year === currentDate.year &&
      day === currentDate.day
    );
  };

  return (
    <div className="container mx-auto mt-5">
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-300">
        <div className="flex items-center justify-between py-2 px-6">
          <div>
            <span className="text-lg font-bold text-gray-800">
              {monthYear.toFormat("LLLL")}
            </span>
            <span className="ml-1 text-lg text-gray-600 font-normal">
              {monthYear.year}
            </span>
          </div>
          {/* Change Month Buttons */}
          <div className="border rounded-lg px-1 py-0.5">
            <button
              type="button"
              className={`leading-none rounded-lg transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 items-center ${
                disableDecreaseMonth ? "cursor-not-allowed opacity-25" : ""
              }`}
              disabled={disableDecreaseMonth}
              onClick={() =>
                setMonthYear((current) => current.minus({ month: 1 }))
              }
            >
              <ChevronLeftIcon className="h-6 w-6 text-gray-500 inline-flex leading-node" />
            </button>
            <div className="border-r inline-flex h-6" />
            <button
              type="button"
              className={`leading-none rounded-lg transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 items-center`}
              onClick={() =>
                setMonthYear((current) => current.plus({ month: 1 }))
              }
            >
              <ChevronRightIcon className="h-6 w-6 text-gray-500 inline-flex leading-node" />
            </button>
          </div>
        </div>

        <div className="-mx-1 -mb-1 grid grid-cols-7">
          {/* Day Headings */}
          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day) => (
            <div
              key={day}
              className="px-2 py-2 text-gray-600 text-sm uppercase tracking-wide font-bold text-center border-b"
            >
              {day}
            </div>
          ))}

          {/* Create Day Cells */}
          {/* Blank Cell Paddings */}
          {[...Array(numBlankOffsets)].map((key) => (
            <div
              key={key}
              className="text-center border-r border-b px-4 pt-2"
            />
          ))}

          {[...Array(daysInMonth)].map((_, day) => (
            <div
              className="p-2 border-r border-b relative aspect-square"
              key={day}
            >
              {/* Date Text */}
              <div
                className={`inline-flex w-6 h-6 items-center justify-center cursor-pointer text-center leading-none rounded-full transition ease-in-out duration-100
                ${
                  isToday(day + 1)
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-blue-200"
                }`}
              >
                {day + 1}
              </div>
              <div className="overflow-y-auto mt-1">
                {/* Already scheduled events */}
                {["event 1", "event 2"].map((event) => (
                  <div
                    className="px-2 py-1 rounded-lg mt-1 overflow-hidden border border-blue-200 text-blue-800 bg-blue-100"
                    key={event}
                  >
                    <p className="text-sm truncate leading-tight">{event}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Blank Cell Endings */}
          {[...Array(numBlankEndings)].map((key) => (
            <div
              key={key}
              className="text-center border-r border-b px-4 pt-2 aspect-square"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
