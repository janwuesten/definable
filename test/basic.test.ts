import { expect, test } from "@jest/globals"
import { Definable, DefinableDefinition } from "../src"

class Mayor extends Definable {
  firstName: string = ""
  lastName: string = ""

  definition({ useProp }: DefinableDefinition): void {
    useProp("firstName")
      .useDeserializer<string>((data) => this.firstName = data ?? "")
      .useSerializer<string>(() => this.firstName)
    useProp("lastName")
      .useDeserializer<string>((data) => this.lastName = data ?? "")
      .useSerializer<string>(() => this.lastName)
  }
}
class City extends Definable {
  name: string = ""

  definition({ useProp }: DefinableDefinition): void {
    useProp("name")
      .useDeserializer<string>((data) => this.name = data ?? "")
      .useSerializer<string>(() => this.name)
  }
}
class Manager extends Definable {
  admin: boolean = false

  definition({ useProp }: DefinableDefinition): void {
    useProp("admin")
      .useDeserializer<boolean>((data) => this.admin = data ?? false)
      .useSerializer<boolean>(() => this.admin)
  }
}
class Country extends Definable {
  name: string = ""
  cities: City[] = []
  mayor: Mayor = new Mayor()
  manager: Map<string, Manager> = new Map()

  definition({ useProp }: DefinableDefinition): void {
    useProp("name")
      .useDeserializer<string>((data) => this.name = data ?? "")
      .useSerializer<string>(() => this.name)
    useProp("cities")
      .useDefinableArray(() => new City())
      .useDeserializer<City[]>((data) => this.cities = data ?? [])
      .useSerializer<City[]>(() => this.cities)
    useProp("mayor")
      .useDefinable(() => new Mayor())
      .useDeserializer<Mayor>((data) => this.mayor = data ?? new Mayor())
      .useSerializer<Mayor>(() => this.mayor)
    useProp("manager")
      .useDefinableMap(() => new Manager())
      .useDeserializer<Map<string, Manager>>((data) => this.manager = data ?? new Map())
      .useSerializer<Map<string, Manager>>(() => this.manager)
  }
}

test("basic serialize", async () => {
  const country = new Country()
  country.name = "TEST"
  const myCity = new City()
  myCity.name = "Test City"
  country.cities.push(myCity)
  country.manager.set("test-id", new Manager())
  country.manager.set("test-id-2", new Manager())
  const data = await country.serialize() as any
  expect(data.name).toBe("TEST")
  expect(data.cities.length).toBe(1)
  expect(data.cities[0].name).toBe("Test City")
  expect(data.manager["test-id"].admin).toBe(false)
  expect(data.manager["test-id-2"].admin).toBe(false)
})
test("basic deserialize", async () => {
  const country = new Country()
  await country.deserialize({ name: "TEST", cities: [{ name: "Test City" }], mayor: { firstName: "Test", lastName: "Teest 2" }, manager: { "test-id": { admin: true }} })
  expect(country.name).toBe("TEST")
  expect(country.cities.length).toBe(1)
  expect(country.cities[0].name).toBe("Test City")
  expect(country.manager.get("test-id")?.admin).toBe(true)
})