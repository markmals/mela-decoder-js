import Zip from "adm-zip"
import { readFile, writeFile } from "node:fs/promises"
import { extname } from "node:path"

export interface Recipe {
    /**
     * The unique ID of the recipe.
     *
     * If `link` is a URL, then ID is `link` without the protocol at the beginning.
     *
     * If `link` is not a URL, then ID is a UUID.
     */
    id: string
    date: Date
    images: string[]
    title?: string
    yield?: string
    cookTime?: string
    prepTime?: string
    totalTime?: string
    /** Also "source"; can be a URL or plain text */
    link?: string
    text?: string
    ingredients?: string
    instructions?: string
    notes?: string
    nutrition?: string
    /** An array of tags */
    categories: string[]
    wantToCook: boolean
    favorite: boolean
}

export namespace Recipes {
    /**
     * Converts a Swift time interval (as encoded to JSON with `Swift.JSONEncoder`)
     * to a JavaScript Date.
     *
     * Since Mela is written in Swift, this is needed to convert their encoded dates to JS Dates.
     *
     * @see https://stackoverflow.com/a/52001521
     *
     * @param { number } timeInterval - A Swift time interval; seconds since 2001-01-01.
     *
     * @returns { Date } A Date representing the Swift time interval.
     *
     */
    function timeIntervalToDate(timeInterval: number): Date {
        let swiftOffset = Date.UTC(2001, 0, 1) // 978307200000
        return new Date(swiftOffset + timeInterval * 1000)
    }

    async function decodeFromJSON(text: string): Promise<Recipe> {
        type ParsedRecipe = Omit<Recipe, "date"> & { date?: number }

        // '.melarecipe' files are really just JSON files with the `ParsedRecipe` schema
        let parsedRecipe = JSON.parse(text) as ParsedRecipe
        let date = timeIntervalToDate(parsedRecipe.date!)
        delete parsedRecipe.date

        return { ...parsedRecipe, date }
    }

    async function decodeFromZip(data: Buffer): Promise<Recipe[]> {
        // '.melarecipes' files are really just ZIP archives containing '.melarecipe' files
        let zip = new Zip(data)
        let recipes = zip.getEntries().map(entry => entry.getData().toString("utf8"))
        return await Promise.all(recipes.map(async recipe => await decodeFromJSON(recipe)))
    }

    /**
     * Reads a `Recipe` object from a .melarecipe or .melarecipes file.
     *
     * @async
     *
     * @param { string } filePath - Path to the local '.melarecipe' or '.melarecipes' file.
     *
     * @returns { Promise<Recipe | Recipe[]> }
     * Returns a `Recipe` if a '.melarecipe' file path is passed in
     * or a `Recipe[]` if a '.melarecipes' file path is passed in.
     *
     * @throws { Error }
     * Throws an error if the file path does not point to a '.melarecipes' or '.melarecipe' file.
     *
     */
    export async function readFromFile(filePath: `${string}.melarecipe`): Promise<Recipe>
    export async function readFromFile(filePath: `${string}.melarecipes`): Promise<Recipe[]>
    export async function readFromFile(filePath: string): Promise<Recipe | Recipe[]> {
        switch (extname(filePath)) {
            case ".melarecipes": {
                let data = await readFile(filePath)
                return await decodeFromZip(data)
            }
            case ".melarecipe": {
                let text = await readFile(filePath, "utf-8")
                return await decodeFromJSON(text)
            }
            default: {
                throw new Error("File must be format '.melarecipes' or '.melarecipe'")
            }
        }
    }

    /**
     * Writes a `Recipe` object to a new JSON file in the specified directory.
     *
     * @async
     *
     * @param { string } dirPath - Path to the directory where the file will be written.
     *
     * @param { Recipe | Recipe[] } recipe - The `Recipe` or `Array` of `Recipe`s to
     * serialize to a JSON file.
     *
     */
    export async function writeToDir(dirPath: string, recipe: Recipe | Recipe[]) {
        let str = JSON.stringify(recipe, null, 4)
        let fileName = Array.isArray(recipe) ? "Recipes" : recipe.title
        await writeFile(`${dirPath}/${fileName}.json`, str)
    }
}
