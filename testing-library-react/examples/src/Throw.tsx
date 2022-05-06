import React from "react";

export const Throw = (): JSX.Element => {
  throw new Error("This component just throws");
};

export default React.forwardRef(Throw);
