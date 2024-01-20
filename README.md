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

## Extensions

Definable offers official extensions to use definable with different services.

- `defineable-firestore`: use definable with your Google Firebase Firestore database to serialize your Firestore documents to JavaScript classes (coming soon).