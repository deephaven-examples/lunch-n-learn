import React from "react";
import { render } from "@testing-library/react";
import { ClickButtonProps } from "./ClickButton";
import ShallowClick from "./ShallowClick";

const mockClickButton = jest.fn();
jest.mock(
  "./ClickButton",
  () => (props: ClickButtonProps) => mockClickButton(props)
);

beforeEach(() => {
  mockClickButton.mockClear();
});

it("mounts and unmounts properly", () => {
  const onClick = jest.fn();
  render(<ShallowClick onClick={onClick} />);
  expect(mockClickButton).toHaveBeenCalledWith(
    expect.objectContaining({ onClick })
  );
});
