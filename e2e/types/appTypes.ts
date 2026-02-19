import { Page } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { LoginPage } from '../pages/loginPage';

export type AppFixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
};