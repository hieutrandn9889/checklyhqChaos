// checkly.config.ts
import dotenv from "dotenv"
import path from "path"
dotenv.config({ path: path.resolve(__dirname, ".env") })

import { defineConfig } from "checkly"
import { Frequency } from "checkly/constructs"

export default defineConfig({
  projectName: "Playwright Check Suite Examples",
  logicalId: "pwt-check-suite-examples",
  repoUrl: "https://github.com/checkly/playwright-check-suite-examples",
  checks: {
    // reuse your existing Playwright configuration
    playwrightConfigPath: "./playwright.config.ts",
    // define locations from which your tests will run as monitors
    locations: ["us-east-1", "eu-central-1", "ap-southeast-1"],

    playwrightChecks: [
      /**
       * Example 1: Run Playwright tests with multiple browsers
       *
       * This Playwright Check Suite combines the tests defined in `chromium`
       * and `firefox` project and runs them every 10 minutes.
       *
       * Test it and record the results with:
       * $ npx checkly test --grep="Multiple Browser Suite" --record
       */
      {
        name: "Multiple Browser Suite",
        logicalId: "browser-compat-e2e-suite",
        pwProjects: ["chromium", ],
        frequency: Frequency.EVERY_12H,
      },
    ],
  },
  //also include:
  cli: {
    runLocation: "eu-central-1",
    retries: 0,
  },
})
