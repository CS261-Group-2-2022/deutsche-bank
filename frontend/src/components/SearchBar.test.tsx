import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import { useState } from "react";
import SearchBar from "./SearchBar";

// Cleanup all components
afterEach(cleanup);

const TestSearchBar = () => {
  const [input, setInput] = useState("");

  return (
    <>
      <SearchBar searchText={input} onChange={setInput} />
      <p>output: {input}</p>
    </>
  );
};

test("typing in search bar updates state", () => {
  render(<TestSearchBar />);

  fireEvent.change(screen.getByPlaceholderText("Search"), {
    target: { value: "writing inside input" },
  });

  expect(screen.getByText(/output: writing inside input/i)).toBeInTheDocument();
});
