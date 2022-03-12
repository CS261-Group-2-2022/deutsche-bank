import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import { LoadingButton } from "./LoadingButton";

// Cleanup all components
afterEach(cleanup);

test("renders normally if not loading", () => {
  render(<LoadingButton isLoading={false}>button content</LoadingButton>);

  expect(screen.getByText(/button content/i)).toBeInTheDocument();
});

test("does not show content when loading", () => {
  render(<LoadingButton isLoading={true}>button content</LoadingButton>);

  expect(screen.queryByText(/button content/i)).toBeNull();
});

test("shows loading indicator when loading", () => {
  render(<LoadingButton isLoading={true}>button content</LoadingButton>);

  expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
});

test("button is disabled when loading", () => {
  render(<LoadingButton isLoading={true}>button content</LoadingButton>);

  expect(screen.getByRole("button")).toBeDisabled();
});

test("onClick is fired when not loading", () => {
  let fired = false;

  render(
    <LoadingButton isLoading={false} onClick={() => (fired = true)}>
      button content
    </LoadingButton>
  );

  fireEvent.click(screen.getByRole("button"));

  expect(fired).toBeTruthy();
});

test("onClick is not fired when loading", () => {
  let fired = false;

  render(
    <LoadingButton isLoading={true} onClick={() => (fired = true)}>
      button content
    </LoadingButton>
  );

  fireEvent.click(screen.getByRole("button"));

  expect(fired).toBeFalsy();
});
