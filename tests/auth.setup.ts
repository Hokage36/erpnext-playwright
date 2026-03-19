import fs from 'fs';
import path from 'path';

import { test as setup, expect } from '@playwright/test';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page, baseURL }) => {
  const username = process.env.ERP_USERNAME;
  const password = process.env.ERP_PASSWORD;

  if (!baseURL) {
    throw new Error('BASE_URL is required to run the ERPNext Playwright suite.');
  }

  if (!username || !password) {
    throw new Error('ERP_USERNAME and ERP_PASSWORD must be provided before running the suite.');
  }

  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  await page.goto('/#login');
  await page.getByRole('textbox', { name: 'Email' }).fill(username);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  await page.waitForLoadState('networkidle');
  await expect(page).not.toHaveURL(/#login/);
  await page.context().storageState({ path: authFile });
});
