# deephaven.ui Lunch 'n' Learn

This guided session is designed to give an overview of what deephaven.ui is, how it works, and some ideas for how you can use it. This is a different than the [crash course tutorial](https://github.com/deephaven/deephaven-plugins/blob/main/plugins/ui/docs/tutorial.md) which is designed to be self-guided, whereas this session will be more interactive, working through examples together and answering questions.

## What is deephaven.ui?

- Quickly build UIs from Python
- React-like approach to building components
- Stock toolkit of themeable components based on Adobe Spectrum
- Custom components can be created and parameterized for reusability
- Docs: https://salmon.deephaven.io/core/ui/docs/

## Why deephaven.ui?

- Allow building custom widgets and layouts quickly, without needing to install new plugins
- Great flexibility - interact with other frameworks we haven’t thought about yet
- Opportunity to create and share custom widgets, interact with other frameworks
- Some example widgets: https://gist.github.com/search?q=deephaven.ui

## What can you build?

### Display/layout information

- Many different components provided to display and layout information
- Layout within a component: flex, tabs, grid, view
- Layout within a dashboard: column, row, stack
- Emphasize information: heading, inline_alert, illustrated_message
- Provide guidance: markdown, contextual_help

```python
from deephaven import ui


@ui.component
def example():
    return [
        ui.heading("deephaven.ui"),
        ui.inline_alert(
            heading="Organize information",
            content="You can display useful alerts inline like this.",
            variant="info",
        ),
        ui.illustrated_message("info", "This is an illustrated message"),
        ui.markdown("This is a markdown block"),
        ui.contextual_help("This is a contextual help message"),
    ]
```

### Input from users

- Stock components will call functions when user interactions occur
- Receive text input: text_field, text_area
- Select from a list: list_view, picker, combo_box, table, radio_group, menu
- Press events: button, toggle_button, action_button, switch

### Define a component

#### Displaying a component

- Many deephaven.ui stock components are defined. You can simply assign those to a variable to use/display them

```python
from deephaven import ui


hello_world = ui.heading("Hello, world!")
```

- You can use this to build some ad-hoc panels that don't need state or interactivity

```python
from deephaven import ui
from deephaven.plot import express as dx

example_plots = ui.flex(
  dx.data.stocks(),
  dx.data.tips(),
)
```

- That doesn't give you any interactivity or state though. For that, you need to define your own custom component.

#### Defining a component

- Use the `@ui.component` decorator on a function to define a "component"

```python
from deephaven import ui


@ui.component
def foo():
    return ui.heading("Hello, world!")

f = foo()
```

- The function will be executed when the component is rendered, not when it is called and assigned to a variable.
- In the example below, if you execute the code without opening the component, you will not see the print statement. It will only print when the component is rendered.

```python
from deephaven import ui


@ui.component
def foo():
    print("Rendering foo")
    return ui.heading("Hello, world!")

# Even though we're calling `foo()` here, the function is not actually executed until it is opened by the user
f = foo()
```

- Now that we have a component, let's add some state to it.

```python
from deephaven import ui


@ui.component
def counter():
    number, set_number = ui.use_state(0)


    def handle_press():
        set_number(number + 1)

    return [ui.heading(f"Number is {number}"), ui.button("+1", on_press=handle_press)]


example_counter = counter()
```

- The [`use_state` function](https://github.com/deephaven/deephaven-plugins/blob/main/plugins/ui/docs/hooks/use_state.md) returns a tuple of the current value and a function to update it. This is similar to React's `useState` hook.
- In this example, we are displaying a number and a button that increments the number when pressed.
- Add print statements to show when the component is rendered and when the button is pressed.

```python
from deephaven import ui


@ui.component
def counter():
    number, set_number = ui.use_state(0)

    # Log whenever the component is rendered, along with the value
    print("1. Rendering counter", number)

    def handle_press():
        # Log that the button was pressed
        print("2. Button pressed, number is", number)

        # Actually increment the number
        set_number(number + 1)

        # After press, the value of `number` has not changed. It _will_ be changed in the next function call
        print("3. handle_press after set_number, number is", number)

    return [ui.heading(f"{number}"), ui.button("+1", on_press=handle_press)]

example_counter = counter()
```

Upon opening the component and pressing the button, you will see the following output:

- The `1.` statement is printed when the component is initially opened.
- The `2.` and `3.` statements are printed when the button is pressed. The `set_number` call queues up a state update, which will "re-render" the component (i.e. the function will run again).
- The `1.` statement is printed again as the component is re-rendered.
- Note that the `number` value printed by 3 is not changed even though it is after the call to `set_number`. `number` is simply a variable and is a reference to the value _for that render_. The new value will be available in the next render, after processing all state updates.

If we try and queue up multiple state updates, only the last one will be applied. This is because the state updates are batched and applied in order. Let's change the button to increment by 3 instead of 1:

```python
from deephaven import ui


@ui.component
def counter():
    number, set_number = ui.use_state(0)

    # Log whenever the component is rendered, along with the value
    print("1. Rendering counter", number)

    def handle_press():
        # Log that the button was pressed
        print("2. Button pressed, number is", number)

        # Calling `number + 1` multiple times, but only the last will take effect
        set_number(number + 1)
        set_number(number + 1)
        set_number(number + 1)

        # After press, the value of `number` has not changed. It _will_ be changed in the next function call
        print("3. handle_press after set_number, number is", number)

    return [ui.heading(f"{number}"), ui.button("+3", on_press=handle_press)]

example_counter = counter()
```

The value of `number` is the same all through the `handle_press` method, and `number + 1` is evaluating to the same number each time. We can instead use a function to update the state based on the current value:

```python
from deephaven import ui


@ui.component
def counter():
    number, set_number = ui.use_state(0)

    # Log whenever the component is rendered, along with the value
    print("1. Rendering counter", number)

    def handle_press():
        # Log that the button was pressed
        print("2. Button pressed, number is", number)

        # Calling `number + 1` multiple times, but only the last will take effect
        set_number(lambda n: n + 1)
        set_number(lambda n: n + 1)
        set_number(lambda n: n + 1)

        # After press, the value of `number` has not changed. It _will_ be changed in the next function call
        print("3. handle_press after set_number, number is", number)

    return [ui.heading(f"{number}"), ui.button("+3", on_press=handle_press)]

example_counter = counter()
```
