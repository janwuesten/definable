import { expect, test } from "@jest/globals"
import { Definable, DefinableDefinition } from "../src"

class Mayor extends Definable {
  firstName: string = ""
  lastName: string = ""

  definition({ prop }: DefinableDefinition): void {
    prop<string>("firstName")
      .useDeserializer((data) => this.firstName = data ?? "")
      .useSerializer(() => this.firstName)
    prop<string>("lastName")
      .useDeserializer((data) => this.lastName = data ?? "")
      .useSerializer(() => this.lastName)
  }
}
class City extends Definable {
  name: string = ""

  definition({ prop }: DefinableDefinition): void {
    prop<string>("name")
      .useDeserializer((data) => this.name = data ?? "")
      .useSerializer(() => this.name)
  }
}
class Manager extends Definable {
  admin: boolean = false

  definition({ prop }: DefinableDefinition): void {
    prop<boolean>("admin")
      .useDeserializer((data) => this.admin = data ?? false)
      .useSerializer(() => this.admin)
  }
}
class Country extends Definable {
  name: string = ""
  cities: City[] = []
  mayor: Mayor = new Mayor()
  manager: Map<string, Manager> = new Map()

  definition({ prop }: DefinableDefinition): void {
    prop<string>("name")
      .useDeserializer((data) => this.name = data ?? "")
      .useSerializer(() => this.name)
    prop<City[]>("cities")
      .useDefinableArray(() => new City())
      .useDeserializer((data) => this.cities = data ?? [])
      .useSerializer(() => this.cities)
    prop<Mayor>("mayor")
      .useDefinable(() => new Mayor())
      .useDeserializer((data) => this.mayor = data ?? new Mayor())
      .useSerializer(() => this.mayor)
    prop<Map<string, Manager>>("manager")
      .useDefinableMap(() => new Manager())
      .useDeserializer((data) => this.manager = data ?? new Map())
      .useSerializer(() => this.manager)
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