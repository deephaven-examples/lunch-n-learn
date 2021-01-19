### Chrome DevTools

#### Elements
- Styles tab, `:hov` – force element state
- Layout tab, grid debugger
-  `Cmd+opt+F` – search all sources

#### Console
- [Console Utilities API Reference](https://developers.google.com/web/tools/chrome-devtools/console/utilities)
- Filtering: log levels, filter, search, search in sources
- Debugger timeout
```javascript
setTimeout(() => { debugger }, 2000);
```

- Trigger react event on selected element
```javascript
function triggerReactEvent(element, event, value) {
	Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set.call(element, value);
	element.dispatchEvent(new Event(event, { bubbles: true }));
}

triggerReactEvent($0, 'input', 'test');
```
- Global vars on `irisapi` pages - `currentTable`, `c` (Client)

#### Sources
- Call stack, scope
- Conditional breakpoints

#### Network tab
- Websocket messages, initiators

#### Performance tab
- Timings, react lifecycle (added by React DevTools)
- Experience section + Call tree

### React DevTools extension
#### Components tab
- Edit state/props - re-renders on nested property changes
- Copy prop to variable
- Trigger handler with custom args via global variable
- `debug(handlerGlobalVar)` to add breakpoint on the handler

#### Profiler tab
- Record commits/renders
- "Why did this render?" – off by default

#### Redux


### VSCode debugger
- [CRA debug config](./launch.json)
