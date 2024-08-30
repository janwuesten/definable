# Definable

## Introduction

Definable offers a structured class definition pattern to define the serialization and deserialization of JSON Objekt data to improve code readability and to extend serialization and deserialization features.

Definable is developed for TypeScript projects and allows the deserialization of JSON data to classes and serialize them back into JSON data.

## Installation

To install Definable simple use the Node package manager of your choice to install the `definable` package. No additional dependencies are required.

`npm i definable`

## Documentation

You can find a documentation here:
https://janwuesten.github.io/definable/

## Usage example

```ts
class Country extends Definable {
  name: string = ""
  countryCode: string = ""

  definition({ prop }: DefinableDefinition): void {
    prop<string>("name")
      .useDeserializer((data) => this.name = data ?? "")
      .useSerializer(() => this.name)
    prop<string>("countryCode")
      .useDeserializer((data) => this.countryCode = data ?? "")
      .useSerializer(() => this.countryCode)
  }
}

const country = new Country().deserialize({
  name: "Denmark",
  countryCode: "DK"
})

const dataToStore = country.serialize()
```