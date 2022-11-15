# Mela Decoder

A simple package to decode exported recipe files (of type `.melarecipe` and `.melarecipes`) from the iOS recipe app [Mela](https://mela.recipes).

## Installation

```sh
# npm
npm install package

# yarn
yarn add package

# pnpm
pnpm install package
```

## Usage

```typescript
import Recipes, { Recipe } from "mela-decoder"

let recipes = (await Recipes.readFromFile("./Recipes.melarecipes")) as Recipe[]
await Recipes.writeToDir("../Desktop", recipes)
```

## License

Published under the [MIT License](./LICENSE).
