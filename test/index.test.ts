import { describe, expect, test } from "vitest"
import { testFunction } from "../src"

describe("package name", () => {
    let data = [
        { input: "foo", output: "Hello foo" },
        { input: "bar", output: "Hello bar" },
    ]

    for (let datum of data) {
        test(`testFunction augments ${datum.input}`, () => {
            let result = testFunction(datum.input)
            expect(result).toEqual(datum.output)
        })
    }
})
