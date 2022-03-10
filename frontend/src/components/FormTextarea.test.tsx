import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import { useState } from "react";
import { FormTextArea } from "./FormTextarea";

// Cleanup all components
afterEach(cleanup);

const TestTextArea = ({ error }: { error?: string }) => {
  const [input, setInput] = useState("");

  return (
    <>
      <FormTextArea
        id="textarea"
        name="textarea"
        text={input}
        onChange={setInput}
        placeholder="textarea"
        error={error}
      />
      <p>output: {input}</p>
    </>
  );
};

test("typing in box updates state", () => {
  render(<TestTextArea />);

  fireEvent.change(screen.getByPlaceholderText("textarea"), {
    target: { value: "writing inside textbox" },
  });

  expect(
    screen.getByText(/output: writing inside textbox/i)
  ).toBeInTheDocument();
});

test("shows error if present", () => {
  render(<TestTextArea error="an error occurred" />);

  expect(screen.getByText(/an error occurred/i)).toBeInTheDocument();
});
