import { expect, Page } from '@playwright/test';
import { CommonClassPage } from '../commons/commonClassPage';
import { LoginPage } from '../pages/loginPage';
import HomePageUI from '../interfaces/homePageUI';
import { resetStorage } from '../data/dataFactory/createAuth'


export class HomePage extends CommonClassPage {

  async goto() {
    const loginPage = new LoginPage(this.page);
    await loginPage.goto();
    // Check if user is already logged in by looking for the profile element
    const isLoggedIn = await this.page.locator(HomePageUI.checkDashboard).isVisible().catch(() => false);
    
    if (!isLoggedIn) {
      console.log('Chưa đăng nhập hoặc storageState hết hạn, thực hiện đăng nhập lại');
      // User is not logged in, perform login to create fresh storage state
      await resetStorage(this.page);
    } else {
      console.log('Đã đăng nhập bằng storageState, không cần đăng nhập lại');
      // User is already logged in, just navigate to the base URL
      await this.page.goto(process.env.BASE_URL!);
    }
  }

  async isLoggedIn() {
    await expect(this.page.locator(HomePageUI.logoProfile))
      .toBeVisible({ timeout: 10000 });
    console.log('User is successfully logged in and on the home page');
  }

   async profile() {
    await this.clickLocatorElement(HomePageUI.logoProfile);
    await this.clickLocatorElementToLoadPage(HomePageUI.chaosV2);
  }

}


