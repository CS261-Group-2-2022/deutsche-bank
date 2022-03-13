import { cleanup, render, screen } from "@testing-library/react";
import DateText from "./DateText";
import { DateTime } from "luxon";

// Cleanup all components
afterEach(cleanup);

test("shows relative time", () => {
  const now = DateTime.fromISO("2022-01-01T01:00:00Z");

  render(<DateText date="2022-01-01T00:00:00Z" base={now} />);

  expect(screen.getByText(/1 hour ago/i)).toBeInTheDocument();
});

test("shows date on hover title", () => {
  const now = DateTime.fromISO("2022-01-01T01:00:00Z");

  render(<DateText date="2022-01-01T00:00:00Z" base={now} />);

  expect(screen.getByTitle(/Saturday/i)).not.toBeNull();
});
