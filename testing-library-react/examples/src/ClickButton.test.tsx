import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ClickButton from "./ClickButton";

it("clicks the button", () => {
  const onClick = jest.fn();
  render(<ClickButton onClick={onClick} />);
  expect(onClick).not.toHaveBeenCalled();
  const button = screen.getByRole("button");
  userEvent.click(button);
  expect(onClick).toHaveBeenCalledTimes(1);
});
