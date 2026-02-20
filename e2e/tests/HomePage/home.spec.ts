import { test, expect } from '../../fixtures';
import { STORAGE_STATE } from '../../../playwright.config';
import * as fs from 'fs';
import * as path from 'path';


test.describe('Home Page', () => {

  // Only use storage state if the file exists
  if (fs.existsSync(STORAGE_STATE)) {
    test.use({ storageState: STORAGE_STATE });
  } else {
    console.log(`Storage state file does not exist: ${STORAGE_STATE}`);
  }
  
  test('Verify login page and create ticket', async ({ page, homePage, projectPage }) => {
    await test.step('Customer can home page', async () => {
      await homePage.goto();
    });

    await test.step('Customer can isLoggedIn', async () => {
      await homePage.isLoggedIn();
    });

    await test.step('Customer can profile', async () => {
      await homePage.profile();
    });

    await test.step('Customer can checkDashboardProject', async () => {
      await projectPage.checkDashboardProject();
    });

    await test.step('Customer can clickProjectAndCreateTicket', async () => {
      await projectPage.clickProjectAndCreateTicket();
    });
  });
});