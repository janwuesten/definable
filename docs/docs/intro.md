---
sidebar_position: 0
---

# Introduction

## What is Definable?

When working with TypeScript classes, the serialization and deserialization of JSON data can become very time consuming and can get unmanageable very quickly. Especially when working with a team of developers, every dev implements serialization and deserialization differently.

Definable offers a structured class definition pattern to define the serialization and deserialization of JSON Objekt data to improve code readability, maintainability and extend serialization and deserialization with additinal and useful features.

### Example

This is a short example of the usage for Definable.

```ts
class Country extends Definable {
  name: string = ""
  countryCode: string = ""

  definition({ prop }: DefinableDefinition): void {
    prop("name")
      .useDeserializer<string>((data) => this.name = data ?? "")
      .useSerializer<string>(() => this.name)
    prop("countryCode")
      .useDeserializer<string>((data) => this.countryCode = data ?? "")
      .useSerializer<string>(() => this.countryCode)
  }
}

const country = new Country().deserialize({
  name: "Denmark",
  countryCode: "DK"
})

const dataToStore = country.serialize()
```

This example is equivalent to the following TypeScript code:
```ts
class Country {
  name: string = ""
  countryCode: string = ""

 serialize(): Record<string, unknown> {
    return {
      name: this.name,
      countryCode: this.countryCode
    }
  }
  deserialize(data: Record<string, unknown>) {
    this.name = data.name as string ?? ""
    this.countryCode = data.countryCode as string ?? ""
    return this
  }
}
```

In this simple example, Definable might look like additional steps. But add data like arrays of objects, field validation, events and more and it becomes clear that the "default way" gets clunky and unmaintainable very quickly.
And this doesn't event include class sharing between your website, webapp, server and your react native app.

```ts
// highlight-start
class City {
  name: string = ""

  serialize(): Record<string, unknown> {
    return {
      name: this.name
    }
  }
  deserialize(data: Record<string, unknown>) {
    this.name = data.name as string ?? ""
    return this
  }
}
// highlight-end
class Country {
  name: string = ""
  countryCode: string = ""
  // highlight-start
  cities: City[] = []
  // highlight-end

 serialize(): Record<string, unknown> {
    // highlight-start
    if (this.name == "") {
      throw new Error("name cannot be empty")
    }
    const cities: Record<string, unknown>[] = []
    for (const city of this.cities) {
      cities.push(city.serialize())
    }
    // highlight-end
    return {
      name: this.name,
      countryCode: this.countryCode,
      // highlight-start
      cities: cities
      // highlight-end
    }
  }
  deserialize(data: Record<string, unknown>) {
    this.name = data.name as string ?? ""
    this.countryCode = data.countryCode as string ?? ""
    // highlight-start
    this.cities = []
    for (const city of data.cities as Record<string, unknown>[]) {
      this.cities.push(new City().deserialize(city))
    }
    // highlight-end
    return this
  }
}
```

Definable will help to make the code more clear and helps to maintain, validate and structure your classes - no matter if the classes are simple or large, the Definable system will get rid of the clunky feeling then serialize or deserialize data.
```ts
// highlight-start
class City extends Definable {
  name: string = ""

  constructor() {
    super()
  }

  definition({ prop }: DefinableDefinition): void {
    prop("name")
      .useDeserializer<string>((data) => this.name = data ?? "")
      .useSerializer<string>(() => this.name)
  }
}
// highlight-end
class Country extends Definable {
  name: string = ""
  code: string = ""
  // highlight-start
  cities: City[] = []
  // highlight-end

  definition({ prop }: DefinableDefinition): void {
    prop("name")
      .useDeserializer<string>((data) => this.name = data ?? "")
      .useSerializer<string>(() => {
        // highlight-start
        if (!this.name)
          throw new Error("name cannot be empty")
        // highlight-end
        return this.name
      })
    prop("code")
      .useDeserializer<string>((data) => this.code = data ?? "")
      .useSerializer<string>(() => this.code)
    // highlight-start
    prop("cities")
      .useDefinableArray(() => new City())
      .useDeserializer<City[]>((data) => this.cities = data ?? [])
      .useSerializer<City[]>(() => this.cities)
    // highlight-end
  }
}
```

## Supported use cases

Definable is supported for the following use cases:
- Web based projects
- NodeJS server projects
- React Native projects

For all use cases the NPM package stays the same - so sharing code between projects is fully possible and supported. This means that you can create "common classes" with attributes than can then be shared between your backend, your websites and your native apps.

While using JavaScript is possible, it is recommended to use TypeScript. This documentation will only focus on using Definable with TypeScript.