# deephaven.ui Lunch 'n' Learn

This guided session is designed to give an overview of what deephaven.ui is, how it works, and some ideas for how you can use it. This is a different than the [crash course tutorial](https://github.com/deephaven/deephaven-plugins/blob/main/plugins/ui/docs/tutorial.md) which is designed to be self-guided, whereas this session will be more interactive, working through examples together and answering questions.

The code samples are expected to be run in order, and may use variables from previous code samples.

## What is deephaven.ui?

- Quickly build UIs from Python
- [React](https://react.dev/)-like approach to building components
- Stock toolkit of themeable components based on [Adobe Spectrum](https://react-spectrum.adobe.com/react-spectrum/index.html)
- Custom components can be created and parameterized for reusability
- Docs: https://salmon.deephaven.io/core/ui/docs/

## Why deephaven.ui?

- Allow building custom widgets and layouts quickly, without needing to install new plugins
- Great flexibility - interact with other frameworks we haven’t thought about yet
- Opportunity to create and share custom widgets, interact with other frameworks
- Some example widgets: https://gist.github.com/search?q=deephaven.ui

## What can you do with deephaven.ui?

For all the examples below, it is assumed you have already imported the `deephaven.ui` module. This module is access to all the `deephaven.ui` functionality:

```python
from deephaven import ui
```

### Display/layout information

- Many different components provided to display and layout information
- Layout within a component: flex, tabs, grid, view
- Layout within a dashboard: column, row, stack
- Emphasize information: heading, inline_alert, illustrated_message
- Provide guidance: markdown, contextual_help

Example to display large text:

```python
x = ui.heading("Hello, world!")
```

![Display large text with heading](./assets/hello-world.png)

Wrap stuff with `ui.view` and give it some colour:

```python
x = ui.view(ui.heading("Hello, world!"), background_color="positive")
```

You can also use `ui.flex` to lay out multiple components vertically in a _column_:

```python
column_example = ui.flex(
    ui.view(ui.heading("Hello, world!"), background_color="positive"),
    ui.view(ui.heading("Goodbye, world!"), background_color="negative"),
    direction="column",
)
```

![Flex layout in a vertical column](./assets/flex-column.png)

Or change the direction to layout horizontally in a _row_:

```python
row_example = ui.flex(
    ui.view(ui.heading("Hello, world!"), background_color="positive"),
    ui.view(ui.heading("Goodbye, world!"), background_color="negative"),
    direction="row",
)
```

![Flex layout in a horizontal row](./assets/flex-row.png)

Those headers are taking up the full height of the panel. This is because the parent container by default is a flexbox, and the `flex` component will grow to fill it. If we don't want those components to take up the full height, we can set the `flex_grow` property to `0`:

```python
row_example = ui.flex(
    ui.view(ui.heading("Hello, world!"), background_color="positive"),
    ui.view(ui.heading("Goodbye, world!"), background_color="negative"),
    flex_grow=0,
    direction="row",
)
```

![Flex layout in a horizontal row with flex_grow=0](./assets/flex-row-no-grow.png)

You can also use those values within a layout:

```python
multi_row_example = ui.flex(
    row_example,
    row_example,
    row_example,
    direction="column",
)
```

You can also display other widgets, like tables and plots, within a `ui.flex`:

```python
from deephaven.plot import express as dx

stocks = dx.data.stocks()
cat_stocks = stocks.where("Sym=`CAT`")

table_plot = ui.flex(
  dx.line(cat_stocks, x="Timestamp", y="Price", by="Exchange", title="CAT"),
  cat_stocks,
)
```

There are other layout components like [`ui.tabs`](https://github.com/deephaven/deephaven-plugins/blob/main/plugins/ui/docs/components/tabs.md) and [`ui.divider`](https://github.com/deephaven/deephaven-plugins/blob/main/plugins/ui/docs/components/divider.md) can be used to further organize your layout.

### Layout a dashboard

By default, components are displayed within a `panel` in the current dashboard. You can define a custom dashboard with panels within it:

```python
d = ui.dashboard(ui.panel(stocks.where("Sym=`CAT`"), title="CAT"))
```

Panels can be resized and dragged around within a dashboard. You cannot nest a panel within another panel.

Generally you'll want to layout your dashboard with a vertical layout using `ui.column` or a horizontal layout with `ui.row`:

```python
d = ui.dashboard(
    ui.column(
        ui.panel(stocks.where("Sym=`CAT`"), title="CAT"),
        ui.panel(stocks.where("Sym=`DOG`"), title="DOG"),
    )
)
```

Or arrange them in a stack:

```python
d = ui.dashboard(
    ui.stack(
        ui.panel(stocks.where("Sym=`CAT`"), title="CAT"),
        ui.panel(stocks.where("Sym=`DOG`"), title="DOG"),
    )
)
```

You can of use any component within the panels.

### Input from users

- Stock components will call functions when user interactions occur
- Receive text input: text_field, text_area
- Select from a list: list_view, picker, combo_box, table, radio_group, menu
- Press events: button, toggle_button, action_button, switch

Callbacks respond to events that occur in the UI. For example, a button press:

```python
b = ui.button("Press me", on_press=lambda e: print(f"Button pressed: {e}"))
```

![Press the button to print a message](./assets/button-example.png)

There are a whole bunch of components that can be used for different kinds of input. A few of them:

```python
inputs = ui.flex(
    ui.date_field(label="date_field"),
    ui.list_view(
        "Option 1",
        "Option 2",
        on_change=lambda value: print(f"List view changed to {value}"),
    ),
    ui.picker(
        "Option 1",
        "Option 2",
        label="picker",
        on_change=lambda value: print(f"Picker changed to {value}"),
    ),
    ui.slider(
        label="slider", on_change=lambda value: print(f"Slider changed to {value}")
    ),
    ui.text_field(
        label="text_field", on_change=lambda value: print(f"Text changed to {value}")
    ),
    direction="column",
)
```

![A few examples of input](./assets/inputs.png)

But how do we use the user input to update the UI? We can define a custom component.

### Define a component

A component can have it's own state and parameters to control how it is displayed. You can define your own component using the `@ui.component` decorator:

```python
@ui.component
def foo():
    return ui.heading("Hello, world!")

f = foo()
```

- The `@ui.component` decorator is used to define a component. What the function _returns_ is what is displayed.
- This will create a component that displays "Hello, world!" when it is rendered.
- The `foo` function is only executed when the component is rendered (opened by the user), not when it is called and assigned to a variable.

This gets interesting when you add state to a component. Let's create a counter component

```python
@ui.component
def counter():
    number, set_number = ui.use_state(0)

    def handle_press():
        set_number(number + 1)

    return [ui.heading(f"Number is {number}"), ui.button("+1", on_press=handle_press)]

example_counter = counter()
```

![Example counter component](./assets/example-counter.png)

- We declare a state variable with `ui.use_state`, with an initial value of `0`.
  - All functions with `use_` are special functions known as [_hooks_](https://github.com/deephaven/deephaven-plugins/blob/main/plugins/ui/docs/hooks/overview.md). They are used to interact with the UI framework, and have special handling.
  - Tuple unpacking is used to get the current value and a function to update it.
- We define a function `handle_press` that increments the number.
- We're returning a heading with the value of `number` in it, and a button that calls `handle_press` to increment the number when pressed.

#### How are components rendered?

What's actually going on here? How does this work?

- The function will be executed when the component is rendered, not when it is called and assigned to a variable.
- Let's go back to the counter example from above, but add some print statements for debugging:

```python
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

        # By passing a lambda function in, we're using `n` which is the previous value instead of `number`
        set_number(lambda n: n + 1)
        set_number(lambda n: n + 1)
        set_number(lambda n: n + 1)

        # After press, the value of `number` has not changed. It _will_ be changed in the next function call
        print("3. handle_press after set_number, number is", number)

    return [ui.heading(f"{number}"), ui.button("+3", on_press=handle_press)]

example_counter = counter()
```

By passing in a lambda function to the set state, we're using the previous value when updating the state, instead of just the value at that render.

### Build a table filter control

Let's build a custom component that filters a table based on user input. We'll use a `ui.text_field` to get the user input, and a `ui.table` to display the data with formatting.

Now, lets use a `@ui.component` that takes text input from the user, and highlights rows matching that input:

```python
@ui.component
def filter_table():
    value, set_value = ui.use_state("")

    return [
        ui.text_field(label="Sym", on_change=set_value),
        stocks.where(f"Sym=value"),
    ]

ft = filter_table()
```

![Display a filterable table](./assets/filter-table-example.png)

- The `filter_table` component uses a `ui.text_field` to get the user input, and then uses that input to filter the table.

Since we're doing an exact match, it would be nice to just be able to select from the possible values. We can use a `picker` instead of a `text_field` to do that:

```python
@ui.component
def filter_table():
    value, set_value = ui.use_state("")

    return [
        ui.picker(stocks.select_distinct("Sym"), label="Sym", on_change=set_value),
        stocks.where(f"Sym=value"),
    ]

ft = filter_table()
```

![Display a filterable table with a picker](./assets/filter-table-picker-example.png)

By passing the distinct values of the `Sym` column to the `picker`, the `picker` component will use those as options that can be selected from the dropdown. That's nice, but it's annoying that we start without a value selected. We can default it to the first value in the table by using a [`use_cell_data`](https://github.com/deephaven/deephaven-plugins/blob/main/plugins/ui/docs/hooks/use_cell_data.md) hook:

```python
@ui.component
def filter_table():
    options = stocks.select_distinct("Sym")
    default_option = ui.use_cell_data(options)
    value, set_value = ui.use_state(default_option)

    return [
        ui.picker(options, label="Sym", selected_key=value, on_change=set_value),
        stocks.where(f"Sym=value"),
    ]


ft = filter_table()
```

![Have a default value for the picker](./assets/filter-table-picker-default-example.png)

This component is very specific to the `stocks` table. We can make it more generic by passing in the table to filter as a parameter, along with which column we want to filter:

```python
@ui.component
def filter_table(table, column):
    options = table.select_distinct(column)
    default_option = ui.use_cell_data(options)
    value, set_value = ui.use_state(default_option)

    return [
        ui.picker(options, label=column, selected_key=value, on_change=set_value),
        table.where(f"{column}=value"),
    ]

sym_table = filter_table(stocks, "Sym")
exchange_table = filter_table(stocks, "Exchange")
```

By adding parameters to the component, we can make it more reusable. We can now filter any table by any column.

```python
tips = dx.data.tips()
smoker_tips = filter_table(tips, "Smoker")
```

We've created an interactive, re-usable component.

### Put it together

We've been limiting out components so far to just within a panel. Now let's make a dashboard that has some interactivity. Return a dashboard layout element like `ui.column` to make an interactive dashboard:

```python
@ui.component
def filter_table_dash(table, column):
    options = table.select_distinct(column)
    default_option = ui.use_cell_data(options)
    value, set_value = ui.use_state(default_option)

    return ui.column(
        ui.panel(
            ui.picker(options, label=column, selected_key=value, on_change=set_value)
        ),
        ui.panel(table.where(f"{column}=value")),
    )


d = ui.dashboard(filter_table_dash(stocks, "Sym"))
```

We can add a plot to that dashboard as well:

```python
@ui.component
def filter_table_dash(table, column, x, y, by):
    options = table.select_distinct(column)
    default_option = ui.use_cell_data(options)
    value, set_value = ui.use_state(default_option)
    filtered_table = table.where(f"{column}=value")

    return ui.column(
        ui.row(
            ui.panel(
                ui.picker(
                    options,
                    label=column,
                    label_position="side",
                    selected_key=value,
                    on_change=set_value,
                )
            ),
            height=10,
        ),
        ui.panel(filtered_table),
        ui.panel(dx.line(filtered_table, x=x, y=y, by=by, title=value)),
    )


d = ui.dashboard(
    filter_table_dash(stocks, column="Sym", x="Timestamp", y="Price", by="Exchange")
)
```

![Dashboard with a filterable table](./assets/dashboard-filter-table.png)

We can also automatically add a stack of panels based on the values in the `by` column of the table:

```python
@ui.component
def filter_table_dash(table, column, x, y, by):
    options = table.select_distinct(column)
    by_options_table = table.select_distinct(by)
    by_options_list = ui.use_column_data(by_options_table)
    default_option = ui.use_cell_data(options)
    value, set_value = ui.use_state(default_option)
    filtered_table = table.where(f"{column}=value")

    return ui.column(
        ui.row(
            ui.panel(
                ui.picker(
                    options,
                    label=column,
                    label_position="side",
                    selected_key=value,
                    on_change=set_value,
                )
            ),
            height=10,
        ),
        ui.stack(
            *[
                ui.panel(
                    table.where(f"{column}=value").where(f"{by}=`{by_option}`"),
                    title=by_option,
                )
                for by_option in by_options_list
            ]
        ),
        ui.panel(dx.line(filtered_table, x=x, y=y, by=by, title=value)),
    )


d = ui.dashboard(
    filter_table_dash(stocks, column="Sym", x="Timestamp", y="Price", by="Exchange")
)
```

![Dashboard with a stack for exchanges](./assets/dashboard-with-stack.png)
