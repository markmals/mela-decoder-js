import { existsSync, unlinkSync } from "node:fs"
import { afterEach, describe, expect, test } from "vitest"
import Recipes from "../src"

describe("mela recipe files", () => {
    describe("recipe decoder", () => {
        test("reads from melarecipes file", async () => {
            let recipes = await Recipes.readFromFile("./test/files/Recipes.melarecipes")
            expect(recipes.length).toEqual(10)
        })

        test("reads from melarecipe file", async () => {
            let recipe = await Recipes.readFromFile("./test/files/Banana Bread.melarecipe")
            expect(recipe.title).toEqual("Banana Bread")
            expect(recipe.text).toEqual(
                "Dark brown sugar is key and a dollop of mascarpone makes for superior tenderness."
            )
            expect(recipe.categories).toEqual(["BA's Best", "Bread", "Breakfast", "Dessert"])
            expect(recipe.link).toEqual("https://www.bonappetit.com/recipe/banana-bread")
            expect(recipe.yield).toEqual('Makes one 8½x4½" loaf')
            expect(recipe.images[0]).toBeTruthy()
        })
    })

    describe("json encoder", () => {
        test("writes to file", async () => {
            let recipes = await Recipes.readFromFile("./test/files/Recipes.melarecipes")
            await Recipes.writeToDir("./test/files", recipes)
            expect(existsSync("./test/files/Recipes.json")).toBeTruthy()
        })

        afterEach(() => unlinkSync("./test/files/Recipes.json"))
    })
})
