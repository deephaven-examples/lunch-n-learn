import React from "react";
import Throw from "./Throw";

export const Shallow = (): JSX.Element => {
  return (
    <div role="main">
      My component
      <Throw />
    </div>
  );
};

export default Shallow;
