import { cleanup, render } from "@testing-library/react";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";

// Cleanup all components
afterEach(cleanup);

test("an empty password yields a score of 0", () => {
  let strength = 0;

  render(
    <PasswordStrengthIndicator
      password=""
      updateResult={(num) => (strength = num)}
    />
  );

  expect(strength).toBe(0);
});

test("a common password yields a poor score", () => {
  let strength = 0;

  render(
    <PasswordStrengthIndicator
      password="password"
      updateResult={(num) => (strength = num)}
    />
  );

  expect(strength).toBe(0);
});

test("a strong password yields a strong score", () => {
  let strength = 0;

  render(
    <PasswordStrengthIndicator
      password="ThisIsAStrongPassword"
      updateResult={(num) => (strength = num)}
    />
  );

  expect(strength).toBe(4);
});
