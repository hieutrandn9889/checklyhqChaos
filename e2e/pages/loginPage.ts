import LoginUI from '../interfaces/loginUI';
import { CommonClassPage } from '../commons/commonClassPage';

export class LoginPage extends CommonClassPage {

  async goto() {
    await this.gotoUrl(process.env.BASE_URL!);
    
  }
 
  async login(username: string, password: string) {
    await this.waitForSelector(LoginUI.usernameInput);
    await this.fillLocatorElement(LoginUI.usernameInput, username);
    await this.waitForSelector(LoginUI.passwordInput);
    await this.fillLocatorElement(LoginUI.passwordInput, password);
    await this.waitForSelector(LoginUI.loginButton);
    await this.clickLocatorElement(LoginUI.loginButton);
    // Wait for login to complete by waiting for navigation or a post-login element
    // We'll wait for a reasonable amount of time for the page to load after login
    await this.page.waitForLoadState('networkidle');
    await this.saveAuthentication();
  }

}
