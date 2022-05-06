import React from "react";

export type ClickButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export const ClickButton = (props: ClickButtonProps): JSX.Element => {
  const { onClick } = props;
  return (
    <div>
      <button type="button" onClick={onClick}>
        My Button
      </button>
    </div>
  );
};

export default ClickButton;
