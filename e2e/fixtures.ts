import { test as base } from '@playwright/test';
import { AppFixtures } from './types/appTypes';
import { HomePage } from './pages/homePage';
import { LoginPage } from './pages/loginPage';

// Extend the test object with custom fixtures
export const test = base.extend<AppFixtures>({
  // Fixture for HomePage - creates a new instance for each test
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  // Fixture for LoginPage - creates a new instance for each test
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
});

// Export the expect function and other utilities from playwright/test
export { expect } from '@playwright/test';