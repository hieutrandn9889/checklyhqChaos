import { expect, test } from "@playwright/test"

test("Visit Checkly home page", async ({ page }) => {
  await page.goto("https://www.checklyhq.com")

  await expect(page).toHaveTitle(/Checkly/)

  // More test code ...
})
