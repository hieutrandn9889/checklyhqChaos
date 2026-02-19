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
  
  test('Should login successfully with valid credentials', async ({ homePage }) => {
    await homePage.goto();
    await homePage.isLoggedIn();
    await homePage.checkProfile();

  });

});