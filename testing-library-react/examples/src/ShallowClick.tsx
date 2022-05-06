import React from "react";
import ClickButton from "./ClickButton";

export type Props = { onClick: React.MouseEventHandler<HTMLButtonElement> };

export const ShallowClick = ({ onClick }: Props): JSX.Element => {
  return (
    <div role="main">
      My component
      <ClickButton onClick={onClick} />
    </div>
  );
};

export default ShallowClick;
