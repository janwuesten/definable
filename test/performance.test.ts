import { test } from "@jest/globals"
import { Definable, DefinableDefinition } from "../src"

class City extends Definable {
  name: string = ""

  constructor() {
    super()
  }

  definition({ useProp }: DefinableDefinition): void {
    useProp("name")
      .useDeserializer<string>((data) => this.name = data ?? "")
      .useSerializer<string>(() => this.name)
  }
}
class Country extends Definable {
  name: string = ""
  code: string = ""
  cities: City[] = []

  definition({ useProp }: DefinableDefinition): void {
    useProp("name")
      .useDeserializer<string>((data) => this.name = data ?? "")
      .useSerializer<string>(() => {
        if (!this.name)
          throw new Error("name cannot be empty")
        return this.name
      })
    useProp("code")
      .useDeserializer<string>((data) => this.code = data ?? "")
      .useSerializer<string>(() => this.code)
    useProp("cities")
      .useDefinableArray(() => new City())
      .useDeserializer<City[]>((data) => this.cities = data ?? [])
      .useSerializer<City[]>(() => this.cities)
  }
}
class NativeCity {
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
class NativeCountry {
  name: string = ""
  code: string = ""
  cities: NativeCity[] = []

 serialize(): Record<string, unknown> {
    const cities: Record<string, unknown>[] = []
    for (const city of this.cities) {
      cities.push(city.serialize())
    }
    return {
      name: this.name,
      code: this.code,
      cities: cities
    }
  }
  deserialize(data: Record<string, unknown>) {
    this.name = data.name as string ?? ""
    this.code = data.code as string ?? ""
    this.cities = []
    for (const city of data.cities as Record<string, unknown>[]) {
      this.cities.push(new NativeCity().deserialize(city))
    }
    return this
  }
}

const executions = 10000

test("Definable write", async () => {
  const totalStartMillis = new Date().getTime()
  let average = 0
  for (let i = 0; i < executions; i++) {
    const startMillis = new Date().getTime()
    const country = new Country()
    country.code = "DK"
    country.name = "Denmark"
    await country.serialize()
    const endMillis = new Date().getTime()
    const totalMillis = endMillis - startMillis
    average += totalMillis
  }
  average = average / executions
  const totalEndMillis = new Date().getTime()
  console.log(`[Definable write]: total ${(totalEndMillis - totalStartMillis)}ms, average ${average}ms`)
})
test("Definable read", async () => {
  const totalStartMillis = new Date().getTime()
  let average = 0
  for (let i = 0; i < executions; i++) {
    const startMillis = new Date().getTime()
    const country = new Country()
    await country.deserialize({
      name: "Denmark",
      code: "DK",
      cities: [
        { name: "Kopenhagen" },
        { name: "Aalborg" }
      ]
    })
    const endMillis = new Date().getTime()
    const totalMillis = endMillis - startMillis
    average += totalMillis
  }
  average = average / executions
  const totalEndMillis = new Date().getTime()
  console.log(`[Definable read]: total ${(totalEndMillis - totalStartMillis)}ms, average ${average}ms`)
})
test("Native class write", async () => {
  const totalStartMillis = new Date().getTime()
  let average = 0
  for (let i = 0; i < executions; i++) {
    const startMillis = new Date().getTime()
    const country = new NativeCountry()
    country.code = "DK"
    country.name = "Denmark"
    await country.serialize()
    const endMillis = new Date().getTime()
    const totalMillis = endMillis - startMillis
    average += totalMillis
  }
  average = average / executions
  const totalEndMillis = new Date().getTime()
  console.log(`[Native class write]: total ${(totalEndMillis - totalStartMillis)}ms, average ${average}ms`)
})
test("Native class read", async () => {
  const totalStartMillis = new Date().getTime()
  let average = 0
  for (let i = 0; i < executions; i++) {
    const startMillis = new Date().getTime()
    const country = new NativeCountry()
    await country.deserialize({
      name: "Denmark",
      code: "DK",
      cities: [
        { name: "Kopenhagen" },
        { name: "Aalborg" }
      ]
    })
    const endMillis = new Date().getTime()
    const totalMillis = endMillis - startMillis
    average += totalMillis
  }
  average = average / executions
  const totalEndMillis = new Date().getTime()
  console.log(`[Native class read]: total ${(totalEndMillis - totalStartMillis)}ms, average ${average}ms`)
})
test("classless", async () => {
  const totalStartMillis = new Date().getTime()
  let average = 0
  for (let i = 0; i < executions; i++) {
    const startMillis = new Date().getTime()
    const createCountry = () => {
      return {
        code: "DK",
        name: "Denmark",
        cities: [
          { name: "Kopenhagen" },
          { name: "Aalborg" }
        ]
      }
    }
    createCountry()
    const endMillis = new Date().getTime()
    const totalMillis = endMillis - startMillis
    average += totalMillis
  }
  average = average / executions
  const totalEndMillis = new Date().getTime()
  console.log(`[native]: total ${(totalEndMillis - totalStartMillis)}ms, average ${average}ms`)
})