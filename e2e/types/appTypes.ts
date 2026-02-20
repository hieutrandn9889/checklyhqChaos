import { Page } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { LoginPage } from '../pages/loginPage';
import { ProjectPage } from '../pages/projectPage';

export type AppFixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  projectPage: ProjectPage;
};