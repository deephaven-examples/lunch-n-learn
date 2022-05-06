import React from "react";
import { render } from "@testing-library/react";
import ShallowRef from "./ShallowRef";

jest.mock("./Throw", () => {
  const MockReact = jest.requireActual("react");
  return MockReact.forwardRef(() => null);
});

it("mounts and unmounts properly", () => {
  render(<ShallowRef />);
});
