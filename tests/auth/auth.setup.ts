import { test as setup, expect } from "@playwright/test";

const baseURL = process.env.APP_URL;
const authFile = "./playwright/.auth/user.json";

setup("authenticate", async ({ browser }) => {
  console.log("Authenticating...");
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

  await context.storageState({ path: authFile });
  await context.close();
});
