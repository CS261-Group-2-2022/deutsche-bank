import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import { useState } from "react";
import { FormInput } from "./FormInput";

// Cleanup all components
afterEach(cleanup);

const TestInput = ({ error }: { error?: string }) => {
  const [input, setInput] = useState("");

  return (
    <>
      <FormInput
        id="textarea"
        name="textarea"
        type="input"
        text={input}
        onChange={setInput}
        placeholder="input"
        error={error}
      />
      <p>output: {input}</p>
    </>
  );
};

test("typing in input updates state", () => {
  render(<TestInput />);

  fireEvent.change(screen.getByPlaceholderText("input"), {
    target: { value: "writing inside input" },
  });

  expect(screen.getByText(/output: writing inside input/i)).toBeInTheDocument();
});

test("shows error if present", () => {
  render(<TestInput error="an error occurred" />);

  expect(screen.getByText(/an error occurred/i)).toBeInTheDocument();
});
