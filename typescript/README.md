# TypeScript Lunch 'n' Learn

## What is TypeScript?

Some key points from https://www.typescriptlang.org/:

- TypeScript extends JavaScript by adding types.
- Types provide a way to describe the shape of an object, providing better documentation, and allowing TypeScript to validate that your code is working correctly.
- Writing types can be optional in TypeScript, because type inference allows you to get a lot of power without writing additional code.
- All valid JavaScript code is also TypeScript code.

## Playground

The TypeScript playground is a great environment to try out TypeScript quickly and without worrying about anything breaking: https://www.typescriptlang.org/play
It also shows the resulting js and d.ts files.

### Primitive Types

You can specify a type after a variable name. If omitted, the type will be inferred from context. Hover over the variable name to see the type.

```ts
let helloWorld:string = "Hello World";
let foo = "bar";
foo = 42; // An error will be shown on this line, because foo is type str
```

### Types vs. Interfaces

You can declare your own types or interfaces for usage. For most cases, they function the same. The formatting for specifying types is more concise, but interfaces in general are recommended as they produce better error messages.
https://www.typescriptlang.org/play?q=299#example/types-vs-interfaces

### Union and Intersection Types

https://www.typescriptlang.org/play?q=58#example/union-and-intersection-types

You can easily specify multiple types using a union, eg.

```ts
const str = "Hello World";
const num = 42;
const obj = {};

const printValue = (value:string | number) => {
  console.log(value);
}

printValue(str);
printValue(num);
printValue(obj); // Error since it's not a string or a number
```

### Optional properties

You can specify when an interface has an optional property, eg.

```ts
interface Artist {
  id: number;
  name?: string;
}
const printArtist = (artist:Artist) => {
  console.log(artist);
}
printArtist({ id: 42, name: "Douglas" }); // Works if name is specified
printArtist({ id: 42 });  // Can also completely omit name
printArtist({ id: 42, name: null }); // If you try to pass null for name, it is an error. Need to specify `string | null`.
```

### Enums

Enums can be specified without values, or you can specify a value for each of the keys: https://www.typescriptlang.org/play?q=110#example/enums
It also will point out if you're not handling some cases in a switch/case, eg:

```ts
enum CompassDirection {
  North,
  East,
  South,
  West,
}

const displayText = (direction:CompassDirection):string => {
    switch (direction) {
        case CompassDirection.North: return "North";
        case CompassDirection.East: return "East";
        case CompassDirection.South: return "South";
        // Uncomment this to fix the error
        // case CompassDirection.West: return "West";
    }
}
```

### Type Guards and Type Predicates

Use Type Predicates to check if a type conforms to a specific subtype.

```ts
interface Shape {
  pointCount: number;
}

interface Circle extends Shape {
  diameter: number;
}

interface Rectangle extends Shape {
  width: number;
  height: number;
}

function isCircle(shape: Shape): shape is Circle {
  return (shape as Circle).diameter !== undefined;
}

function isRectangle(shape: Shape): shape is Rectangle {
  return (shape as Rectangle).width !== undefined;
}

function printShape(shape:Shape) {
  if (isCircle(shape)) {
    console.log("Circle diameter is ", shape.diameter);
  } else if

  // There's an error here because shape isn't known to be a Circle in this block
  // console.log("Circle diameter is ", shape.diameter);
}
```

### Structural vs. Nominal Typing

TypeScript uses Structural Typing by default (duck typing). You may also use Nominal Typing: https://www.typescriptlang.org/play?q=46#example/structural-typing
