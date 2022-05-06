import React from "react";
import { render, screen } from "@testing-library/react";
import Basic from "./Basic";

it("mounts and unmounts properly", () => {
  render(<Basic />);
});

it("finds the main content", () => {
  render(<Basic />);
  expect(() => screen.getByRole("main")).not.toThrow();
  expect(() => screen.getByText("Main")).not.toThrow();
});
