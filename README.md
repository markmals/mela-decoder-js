# Mela Decoder

A simple package to decode exported recipe files (of type `.melarecipe` and `.melarecipes`) from the iOS recipe app [Mela](https://mela.recipes).

## Installation

```sh
# npm
npm install mela-decoder

# yarn
yarn add mela-decoder

# pnpm
pnpm install mela-decoder
```

## Usage

```typescript
import Recipes, { Recipe } from "mela-decoder"

let recipes: Recipe[] = await Recipes.readFromFile("./Recipes.melarecipes")
await Recipes.writeToDir("../Desktop", recipes)
```

## License

Published under the [MIT License](./LICENSE).
