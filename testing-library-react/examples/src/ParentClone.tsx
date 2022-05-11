import React from "react";

export type Props = {
  children: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export function isReactElement(
  child: React.ReactNode
): child is React.ReactElement {
  return (
    typeof child !== "string" &&
    typeof child !== "number" &&
    (child as React.ReactElement).type !== undefined
  );
}

const ParentClone = ({ children, onClick }: Props): JSX.Element => (
  <div>
    <h1>Testing pass through to child</h1>
    {React.Children.toArray(children).map((child) =>
      isReactElement(child) ? React.cloneElement(child, { onClick }) : null
    )}
  </div>
);

export default ParentClone;
