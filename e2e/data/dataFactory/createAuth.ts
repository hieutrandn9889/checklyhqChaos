import { Page } from '@playwright/test'
import { LoginPage } from '../../pages/loginPage'
import { users } from '../../data/users';
import { STORAGE_STATE } from '../../../playwright.config';

export async function resetStorage(page: Page) {
  const loginPage = new LoginPage(page)
  await loginPage.login(users.valid.username, users.valid.password);
  await page.context().storageState({ path: STORAGE_STATE })
  return STORAGE_STATE
}
