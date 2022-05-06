import React from "react";

export type ChangeInputProps = {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

export const ChangeInput = (props: ChangeInputProps): JSX.Element => {
  const { onChange } = props;
  return (
    <div>
      <label htmlFor="test-input">Name</label>
      <input id="test-input" type="text" onChange={onChange} />
    </div>
  );
};

export default ChangeInput;
