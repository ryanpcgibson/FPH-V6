import { test as setup, expect } from "@playwright/test";

const baseURL = process.env.APP_URL;

setup("authenticate", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(baseURL!);
  await page.fill(
    'input[type="email"][name="email"]',
    process.env.TEST_USER_EMAIL!
  );
  await page.fill(
    'input[type="password"][name="password"]',
    process.env.TEST_USER_PASSWORD!
  );
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(`${baseURL}/app`);

  await context.storageState({ path: "./playwright/.auth/user.json" });
  await context.close();
});
