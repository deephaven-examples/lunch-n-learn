import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MultipleButtons from "./MultipleButtons";

it("throws when trying to retrieve single button by role", () => {
  const onCancel = jest.fn();
  const onSave = jest.fn();
  render(<MultipleButtons onCancel={onCancel} onSave={onSave} />);
  expect(() => screen.getByRole("button")).toThrow();
  expect(onSave).not.toHaveBeenCalled();
  expect(onCancel).not.toHaveBeenCalled();
});

it("retrieves button by role and name", () => {
  const onCancel = jest.fn();
  const onSave = jest.fn();
  render(<MultipleButtons onCancel={onCancel} onSave={onSave} />);
  expect(onSave).not.toHaveBeenCalled();
  expect(onCancel).not.toHaveBeenCalled();

  // The name property checks the accessible name: https://www.w3.org/TR/accname-1.1/
  // The accessible name checks aria-label, and falls back to the text contents if label isn't set
  userEvent.click(screen.getByRole("button", { name: "Save" }));
  expect(onSave).toHaveBeenCalledTimes(1);
  expect(onCancel).not.toHaveBeenCalled();
});

it("retrieves button by text", () => {
  const onCancel = jest.fn();
  const onSave = jest.fn();
  render(<MultipleButtons onCancel={onCancel} onSave={onSave} />);
  expect(onSave).not.toHaveBeenCalled();
  expect(onCancel).not.toHaveBeenCalled();
  userEvent.click(screen.getByText("Save"));
  expect(onSave).toHaveBeenCalledTimes(1);
  expect(onCancel).not.toHaveBeenCalled();
});
