import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ParentClone from "./ParentClone";

it("passes through onClick prop", async () => {
  const name = "Child Button";
  const ChildElement: React.FunctionComponent<{
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
  }> = ({ onClick }) => <button onClick={onClick}>{name}</button>;
  const onClick = jest.fn();
  render(
    <ParentClone onClick={onClick}>
      <ChildElement />
    </ParentClone>
  );

  await userEvent.click(screen.getByRole("button", { name }));
  expect(onClick).toHaveBeenCalled();
});
