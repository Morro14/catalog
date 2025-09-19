import { defineConfig } from "eslint/config"

export default defineConfig([
  {
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json"
        }
      }
    }
  }
])