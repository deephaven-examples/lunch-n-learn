# React Testing Library Lunch 'n' Learn

## What is React Testing Library?

[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) (package name [@testing-library/react](https://www.npmjs.com/package/@testing-library/react)) is a lightweight testing library built for React that encourages best testing practices. The main [guiding principle](https://testing-library.com/docs/guiding-principles/) is:

> The more your tests resemble the way your software is used, the more confidence they can give you. - [Kent C Dodds, 17 Feb 2018](https://twitter.com/kentcdodds/status/977018512689455106)

Put in other words, React Testing Library encourages writing test cases that interact with your rendered content as an end-user would see the page, rather than use implementation details to write tests. This means finding elements by their labels/titles (i.e. as a user would see them on the page), and then simulate a click or change event on that element, rather than calling a component instance method. Test against DOM nodes, rather than component instances.

With about [~6 million weekly downloads, >15 collaborators, and new versions published monthly](https://www.npmjs.com/package/@testing-library/react), it is very active. It is also [recommended in the create-react-app docs](https://create-react-app.dev/docs/running-tests/#react-testing-library). It is also included by default with apps created by Create React App.

### What about Enzyme?

Enzyme is also a fine testing library, that has a lot of functionality. When we originally selected Enzyme, it was listed as the [first option under testing components](https://github.com/facebook/create-react-app/blob/v3.0.0/docusaurus/docs/running-tests.md#option-1-shallow-rendering) on the Create React App web development page. It used to have a lot of active contributions and support, but [many of the contributors](https://testing-library.com/docs/react-testing-library/migrate-from-enzyme/#why-should-i-use-react-testing-library) of Enzyme are now maintainers of the React Testing Library.

Enzyme has functionality that does _not_ encourage best test practices. As noted in the [React Testing Library FAQ](https://testing-library.com/docs/react-testing-library/faq/):

> Most of the damaging features have to do with encouraging testing implementation details. Primarily, these are shallow rendering, APIs which allow selecting rendered elements by component constructors, and APIs which allow you to get and interact with component instances (and their state/properties) (most of enzyme's wrapper APIs allow this).

Enzyme still has over [2 million weekly downloads](https://www.npmjs.com/package/enzyme). However, a new version hasn't been published in over 2 years, and there are only 3 collaborators listed. There is no official support for React v17. It does not look like there will be [official support anytime soon](https://github.com/enzymejs/enzyme/issues/2429#issuecomment-998082843). There is also a guide for [migrating from Enzyme to React Testing Library](https://testing-library.com/docs/react-testing-library/migrate-from-enzyme/).

### What about react-test-renderer?

[Test Renderer](https://reactjs.org/docs/test-renderer.html) is an [experimental React renderer that renders React components to pure JavaScript objects](https://github.com/facebook/react/tree/main/packages/react-test-renderer). It does not depend on any DOM, and therefore does not follow the guiding principle of tests resembling the way our software is used. We should prefer to test against the DOM as opposed to just a virtual representation of the DOM. At over 4 million weekly downloads and frequent published versions though, it is still very much under active development, and could be useful in scenarios where we do _not_ want to render the DOM. However, we should prefer to render in the DOM and simply mock out problematic components.

## Writing Tests

In the most basic test case, it's easy to render an element and test that it mounts and unmounts properly (see [Basic.test.tsx](./examples/src/Basic.test.tsx)):

```javascript
import React from "react";
import { render } from "@testing-library/react";
import Basic from "./Basic";

it("mounts and unmounts properly", () => {
  render(<Basic />);
});
```

Note that you do not need to call `unmount` - it automatically does that as part of the [cleanup phase](https://testing-library.com/docs/react-testing-library/api/#cleanup).

### Querying elements

When querying/finding elements, it is preferred to try and retrieve them in the order an end-user may find them, rather than through implementation details. There is a [priority ordering](https://testing-library.com/docs/queries/about/#priority) we should follow.

The [RenderResult](https://testing-library.com/docs/react-testing-library/api/#render-result) returns many query functions that can be used to search for elements within the DOM rendered; however, it is [preferred](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library#not-using-screen) to use the screen API. For example, from [Basic.test.tsx](./examples/src/Basic.test.tsx):

```javascript
import React from "react";
import { render, screen } from "@testing-library/react";
import Basic from "./Basic";

it("mounts and unmounts properly", () => {
  render(<Basic />);
});

it("finds the main content", () => {
  render(<Basic />);
  expect(() => screen.getByRole("main")).not.toThrow();
  expect(() => screen.getByText("Main")).not.toThrow();
});
```

### Clicking a button

Use `userEvent` library to simulate clicking a button. Find the button using the `screen` query API, click it, and check that the expected prop has been clicked (see [ClickButton.test.tsx](examples/src/ClickButton.test.tsx)):

```javascript
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ClickButton from "./ClickButton";

it("clicks the button", () => {
  const onClick = jest.fn();
  render(<ClickButton onClick={onClick} />);
  expect(onClick).not.toHaveBeenCalled();
  const button = screen.getByRole("button");
  userEvent.click(button);
  expect(onClick).toHaveBeenCalledTimes(1);
});
```

### Multiple Buttons

What if there are multiple buttons rendered? `screen.getByRole` implicitly verifies there is only one element that matches that query. If more than one element match, it will throw.
Since we may not always be able to disambiguate by `role` alone, you can pass in a `{ name: 'Name' }` option to find a button matching that accessible name. If `role` with a `name` cannot be used, you can use `getByText` instead (see [MultipleButtons.test.tsx](examples/src/MultipleButtons.test.tsx):

```javascript
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MultipleButtons from "./MultipleButtons";

it("throws when trying to retrieve single button by role", () => {
  const onCancel = jest.fn();
  const onSave = jest.fn();
  render(<MultipleButtons onCancel={onCancel} onSave={onSave} />);
  expect(() => screen.getByRole("button")).toThrow();
  expect(onSave).not.toHaveBeenCalled();
  expect(onCancel).not.toHaveBeenCalled();
});

it("retrieves button by role and name", () => {
  const onCancel = jest.fn();
  const onSave = jest.fn();
  render(<MultipleButtons onCancel={onCancel} onSave={onSave} />);
  expect(onSave).not.toHaveBeenCalled();
  expect(onCancel).not.toHaveBeenCalled();

  // The name property checks the accessible name: https://www.w3.org/TR/accname-1.1/
  // The accessible name checks aria-label, and falls back to the text contents if label isn't set
  userEvent.click(screen.getByRole("button", { name: "Save" }));
  expect(onSave).toHaveBeenCalledTimes(1);
  expect(onCancel).not.toHaveBeenCalled();
});

it("retrieves button by text", () => {
  const onCancel = jest.fn();
  const onSave = jest.fn();
  render(<MultipleButtons onCancel={onCancel} onSave={onSave} />);
  expect(onSave).not.toHaveBeenCalled();
  expect(onCancel).not.toHaveBeenCalled();
  userEvent.click(screen.getByText("Save"));
  expect(onSave).toHaveBeenCalledTimes(1);
  expect(onCancel).not.toHaveBeenCalled();
});
```

React Testing Library has a [cheat sheet](https://testing-library.com/docs/react-testing-library/cheatsheet/#queries) for queries showing in what cases a query will throw.

### Entering input

Simulating typing input is easy as well. See [ChangeInput.test.tsx](examples/src/ChangeInput.test.tsx):

```javascript
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChangeInput from "./ChangeInput";

it("receives changes when typing in input field", () => {
  const onChange = jest.fn();
  render(<ChangeInput onChange={onChange} />);
  const text = "Text";
  userEvent.type(screen.getByLabelText("Name"), text);

  // It will actually type out the the text, so we'll get 4 separate onChange events
  expect(onChange).toHaveBeenCalledTimes(4);
  expect(onChange.mock.calls[3][0].target.value).toBe("Text");
});

it("receive one change when pasting in input field", () => {
  const onChange = jest.fn();
  render(<ChangeInput onChange={onChange} />);
  const text = "Text";
  userEvent.paste(screen.getByLabelText("Name"), text);

  // only one on change event
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange.mock.calls[0][0].target.value).toBe("Text");
});
```

### Mocking Children

With Enzyme, we could simply use `shallow` instead of `mount` to only mount the parent components, and not render the children. With React Testing Library, we instead mock the children. In the most basic case, we can simply mock a component so that it renders nothing. See [Shallow.test.tsx](examples/src/Shallow.test.tsx):

```javascript
import React from "react";
import { render } from "@testing-library/react";
import Shallow from "./Shallow";

jest.mock("./Throw", () => () => null);

it("mounts and unmounts properly", () => {
  render(<Shallow />);
});
```

However, it's not always that simple to mock a component. What if you want to test that the child is getting rendered and the correct prop is getting passed? We can add a mock that stores the props passed in and check them. See [ShallowClick.test.tsx](examples/src/ShallowClick.test.tsx):

```javascript
import React from "react";
import { render } from "@testing-library/react";
import { ClickButtonProps } from "./ClickButton";
import ShallowClick from "./ShallowClick";

const mockClickButton = jest.fn();
jest.mock(
  "./ClickButton",
  () => (props: ClickButtonProps) => mockClickButton(props)
);

beforeEach(() => {
  mockClickButton.mockClear();
});

it("mounts and unmounts properly", () => {
  const onClick = jest.fn();
  render(<ShallowClick onClick={onClick} />);
  expect(mockClickButton).toHaveBeenCalledWith(
    expect.objectContaining({ onClick })
  );
});
```

What if you pass a ref to a component? If you mock it out like above, you'll get an error:

```
    console.error
      Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?
```

We can fix this by using `React.forwardRef` in our mock. See [ShallowRef.test.tsx](examples/src/ShallowRef.test.tsx):

```javascript
import React from "react";
import { render } from "@testing-library/react";
import ShallowRef from "./ShallowRef";

jest.mock("./Throw", () => {
  const MockReact = jest.requireActual("react");
  return MockReact.forwardRef(() => null);
});

it("mounts and unmounts properly", () => {
  render(<ShallowRef />);
});
```

### Testing with React.cloneElement

What if we expect a child to receive props via `React.cloneElement`? We can have that child render with those props to check if it is receiving the correct props:

```javascript
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ParentClone from "./ParentClone";

it("passes through onClick prop", async () => {
  const name = "Child Button";
  const ChildElement: React.FunctionComponent<{
    onClick?: React.MouseEventHandler<HTMLButtonElement>,
  }> = ({ onClick }) => <button onClick={onClick}>{name}</button>;
  const onClick = jest.fn();
  render(
    <ParentClone onClick={onClick}>
      <ChildElement />
    </ParentClone>
  );

  await userEvent.click(screen.getByRole("button", { name }));
  expect(onClick).toHaveBeenCalled();
});
```

### Custom Matchers

There are [custom matchers](https://github.com/testing-library/jest-dom#custom-matchers) included in `@testing-library/jest-dom` (which is included in Create React App apps). These can be used to conveniently check the classes or attributes of an element. An example of checking that an element has a specific class set by using [toHaveClass](https://github.com/testing-library/jest-dom#tohaveclass) (see [Active.test.tsx](examples/src/Active.test.tsx)):

```javascript
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
```

## Examples

There are working examples of the above in the [examples](./examples/) directory.
