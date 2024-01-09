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
      .useSerializer<string>(() => this.name)
    useProp("code")
      .useDeserializer<string>((data) => this.code = data ?? "")
      .useSerializer<string>(() => this.code)
    useProp("cities")
      .useDefinableArray(() => new City())
      .useDeserializer<City[]>((data) => this.cities = data ?? [])
      .useSerializer<City[]>(() => this.cities)
  }
}

const executions = 1000

test("DocumentClass write", async () => {
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
  console.log(`[DocumentClass write]: total ${(totalEndMillis - totalStartMillis)}ms, average ${average}ms`)
})
test("DocumentClass read", async () => {
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
  console.log(`[DocumentClass read]: total ${(totalEndMillis - totalStartMillis)}ms, average ${average}ms`)
})
test("native", async () => {
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