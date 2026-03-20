import fs from 'fs';
import path from 'path';

import { expect, test as setup } from '@playwright/test';

import { LoginPage } from '../framework/pages/login.page';
import { authStateFile, localCredentialsFile, resolveCredentials } from '../framework/utils/credentials';

setup('authenticate', async ({ page, baseURL }) => {
  const { username, password } = resolveCredentials();

  if (!baseURL) {
    throw new Error('BASE_URL is required to run the ERPNext Playwright suite.');
  }

  if (!username || !password) {
    throw new Error(
      `ERP_USERNAME and ERP_PASSWORD must be provided before running the suite, or create ${localCredentialsFile}.`
    );
  }

  fs.mkdirSync(path.dirname(authStateFile), { recursive: true });

  const loginPage = new LoginPage(page);
  await loginPage.login(username, password);

  await expect(page).not.toHaveURL(/#login/);
  await page.context().storageState({ path: authStateFile });
});
