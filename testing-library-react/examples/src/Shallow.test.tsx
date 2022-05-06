import React from "react";
import { render } from "@testing-library/react";
import Shallow from "./Shallow";

jest.mock("./Throw", () => () => null);

it("mounts and unmounts properly", () => {
  render(<Shallow />);
});
