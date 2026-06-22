import { validateEmail } from "./validateEmail.js";

// casos que deben pasar como emails vÃ¡lidos
test("valid email returns true", () => {
  expect(validateEmail("user@gmail.com")).toBe(true);
});

test("valid email with subdomain returns true", () => {
  expect(validateEmail("user@mail.company.com")).toBe(true);
});

// casos que deben fallar
test("email without @ returns false", () => {
  expect(validateEmail("usergmail.com")).toBe(false);
});

test("email without domain returns false", () => {
  expect(validateEmail("user@")).toBe(false);
});

test("email without extension returns false", () => {
  expect(validateEmail("user@gmail")).toBe(false);
});

test("empty string returns false", () => {
  expect(validateEmail("")).toBe(false);
});