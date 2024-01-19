import { test } from "@jest/globals"
import { Definable, DefinableDefinition } from "../src"

class Country extends Definable {
  name: string = ""
  code: string = ""

  definition({ useProp }: DefinableDefinition): void {
    useProp("name")
      .useDeserializer<string>((data) => this.name = data ?? "")
      .useSerializer<string>(() => this.name)
    useProp("code")
      .useValidator(() => {
        if (!this.code) {
          return "code-must-be-set"
        }
        return null
      })
      .useDeserializer<string>((data) => this.code = data ?? "")
      .useSerializer<string>(() => this.code)
  }
}
test("validate props", async () => {
  const county = new Country()
  const isValid = county.validate()
  console.log(isValid)
})