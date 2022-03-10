import { cleanup, render, screen } from "@testing-library/react";
import DateText from "./DateText";
import { DateTime } from "luxon";

// Cleanup all components
afterEach(cleanup);

test("shows relative time", () => {
  const now = DateTime.fromISO("2022-01-01T01:00:00");

  render(<DateText date="2022-01-01T00:00:00" base={now} />);

  expect(screen.getByText(/1 hour ago/i)).toBeInTheDocument();
});

test("shows full date on hover time", () => {
  const now = DateTime.fromISO("2022-01-01T01:00:00");

  render(<DateText date="2022-01-01T00:00:00" base={now} />);

  expect(
    screen.getByTitle(/Saturday, 1 January 2022, 0:00:00 GMT/i)
  ).toBeInTheDocument();
});
