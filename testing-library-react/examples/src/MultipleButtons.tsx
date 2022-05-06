import React from "react";

export type MultipleButtonsProps = {
  onCancel: React.MouseEventHandler<HTMLButtonElement>;
  onSave: React.MouseEventHandler<HTMLButtonElement>;
};

export const MultipleButtons = (props: MultipleButtonsProps): JSX.Element => {
  const { onCancel, onSave } = props;
  return (
    <div>
      <button type="button" onClick={onSave}>
        Save
      </button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
};

export default MultipleButtons;
