import path from 'path';

import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.BASE_URL ?? 'https://per-locking-council-reserves.trycloudflare.com/#login';
const storageState = path.join(__dirname, 'playwright/.auth/user.json');

const browserProjects = process.env.CI
  ? [
      {
        name: 'chromium',
        use: {
          ...devices['Desktop Chrome'],
          storageState,
        },
        dependencies: ['setup'],
      },
    ]
  : [
      {
        name: 'chromium',
        use: {
          ...devices['Desktop Chrome'],
          storageState,
        },
        dependencies: ['setup'],
      },
      {
        name: 'firefox',
        use: {
          ...devices['Desktop Firefox'],
          storageState,
        },
        dependencies: ['setup'],
      },
      {
        name: 'webkit',
        use: {
          ...devices['Desktop Safari'],
          storageState,
        },
        dependencies: ['setup'],
      },
    ];

export default defineConfig({
  testDir: './tests',
  timeout: 180000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: Number(process.env.PLAYWRIGHT_WORKERS ?? '1'),
  reporter: process.env.CI
    ? [
        ['html', { open: 'never' }],
        ['github'],
        ['junit', { outputFile: 'test-results/results.xml' }],
      ]
    : [
        ['html', { open: 'never' }],
        ['list'],
      ],
  use: {
    baseURL,
    trace: process.env.CI ? 'on-first-retry' : 'retain-on-failure',
    video: process.env.CI ? 'on-first-retry' : 'retain-on-failure',
  },
  projects: [
    {
      name: 'setup',
      testDir: './setup',
      testMatch: /.*\.setup\.ts/,
    },
    ...browserProjects,
  ],
});
