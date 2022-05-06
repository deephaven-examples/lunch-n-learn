import React, { useRef } from "react";
import Throw from "./Throw";

export const ShallowRef = (): JSX.Element => {
  const throwRef = useRef();
  return (
    <div role="main">
      My component
      <Throw ref={throwRef} />
    </div>
  );
};

export default ShallowRef;
