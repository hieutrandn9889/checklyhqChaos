import dotenv from "dotenv"
import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });
export const STORAGE_STATE = path.join(__dirname, '.auth/storageState.json');


/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./e2e/tests",
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
      ['html'],
      ['list'],
      ['allure-playwright'], // Thêm Allure reporter
      ['playwright-smart-reporter', {
        outputFile: 'resultSmartReport/smart-report.html',
        historyFile: 'resultSmartReport/test-history.json',
      }],
    ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on",
    viewport: {
      width: 1280,
      height: 720,
    },
    ...(require('fs').existsSync(STORAGE_STATE) ? { storageState: STORAGE_STATE } : {})
  },
  /**
   * Configure projects
   *
   * More info in github.com/checkly/playwright-check-suite-examples/#examples
   */
  projects: [
    /**
     * Example 1
     * Running multiple browsers
     */
    {
      name: "chromium",
      testMatch: /.*\/e2e\/tests\/.*\.spec\.ts/,
      use: {
        // Không sử dụng devices['Desktop Chrome'] vì có deviceScaleFactor
        browserName: 'chromium',
        viewport: null, // Không giới hạn viewport, chạy toàn màn hình
        launchOptions: {
          args: ['--start-maximized', '--disable-web-security'] // Mở Chrome ở chế độ toàn màn hình
        }
      },
    },
  ],
})
