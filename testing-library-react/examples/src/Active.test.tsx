import React from "react";
import { render, screen } from "@testing-library/react";
import Active from "./Active";

it("adds active class properly", () => {
  render(<Active isActive />);
  expect(screen.getByRole("main")).toHaveClass("active");
});

it("does not have active class when not active", () => {
  render(<Active />);
  expect(screen.getByRole("main")).not.toHaveClass("active");
});
