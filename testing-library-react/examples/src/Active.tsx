import React from "react";

export type Props = { isActive?: boolean };

export const Active = ({ isActive = false }: Props): JSX.Element => {
  return (
    <div role="main" className={isActive ? "active" : "inactive"}>
      Main
    </div>
  );
};

export default Active;
