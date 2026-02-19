import { FullConfig, chromium } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { users } from '../data/users';
import * as fs from 'fs';
import * as path from 'path';

async function globalSetup(config: FullConfig) {
  // Create auth directory if it doesn't exist
  const authDir = path.join(__dirname, '..', '..', '.auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  // Launch a browser to perform authentication
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Perform login to create authenticated session
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    // Attempt to login with valid credentials
    await loginPage.login(users.valid.username, users.valid.password);

    // Wait for a moment to ensure all authentication cookies are set
    await page.waitForTimeout(2000);
    
    // Additional check to ensure we're properly logged in
    // This might involve checking for specific elements that appear after login
    // or ensuring we've navigated away from the login page
    
    // Save the storage state to persist authentication
    const storageStatePath = path.join(__dirname, '..', '..', '.auth', 'storageState.json');
    await page.context().storageState({ path: storageStatePath });
    
    // Log the cookies that were saved for debugging
    const storageState = JSON.parse(fs.readFileSync(storageStatePath, 'utf-8'));
    console.log(`Authentication successful. Storage state saved with ${storageState.cookies.length} cookies.`);
    
    // Filter and log authentication-related cookies
    const authCookies = storageState.cookies.filter((cookie: any) => 
      cookie.name.toLowerCase().includes('auth') || 
      cookie.name.toLowerCase().includes('session') ||
      cookie.name.toLowerCase().includes('token') ||
      cookie.name.startsWith('.AspNetCore.')
    );
    console.log(`Found ${authCookies.length} potential authentication cookies:`, 
      authCookies.map((c: any) => c.name));
  } catch (error) {
    console.error('Authentication failed:', error);
    // Throw the error to prevent tests from running without proper authentication
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
