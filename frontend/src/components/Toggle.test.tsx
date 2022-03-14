import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import { useState } from "react";
import Toggle from "./Toggle";

// Cleanup all components
afterEach(cleanup);

const TestToggle = () => {
  const [input, setInput] = useState(false);

  return (
    <>
      <Toggle name="Toggle" enabled={input} setEnabled={setInput} />
      <p>output: {`${input}`}</p>
    </>
  );
};

test("renders normally", () => {
  render(<TestToggle />);

  expect(screen.getByText(/output: false/i)).toBeInTheDocument();
});

test("click on toggle changes state", () => {
  render(<TestToggle />);

  fireEvent.click(screen.getByRole("switch"));

  expect(screen.getByText(/output: true/i)).toBeInTheDocument();
});

test("click on toggle again reverts state", () => {
  render(<TestToggle />);

  fireEvent.click(screen.getByRole("switch"));
  fireEvent.click(screen.getByRole("switch"));

  expect(screen.getByText(/output: false/i)).toBeInTheDocument();
});
