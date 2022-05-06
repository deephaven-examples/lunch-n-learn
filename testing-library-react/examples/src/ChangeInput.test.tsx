import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChangeInput from "./ChangeInput";

it("receives changes when typing in input field", () => {
  const onChange = jest.fn();
  render(<ChangeInput onChange={onChange} />);
  const text = "Text";
  userEvent.type(screen.getByLabelText("Name"), text);

  // It will actually type out the the text, so we'll get 4 separate onChange events
  expect(onChange).toHaveBeenCalledTimes(4);
  expect(onChange.mock.calls[3][0].target.value).toBe("Text");
});

it("receive one change when pasting in input field", () => {
  const onChange = jest.fn();
  render(<ChangeInput onChange={onChange} />);
  const text = "Text";
  userEvent.paste(screen.getByLabelText("Name"), text);

  // only one on change event
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange.mock.calls[0][0].target.value).toBe("Text");
});
