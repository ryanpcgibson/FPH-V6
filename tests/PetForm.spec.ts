import { test, expect } from "@playwright/test";

const baseURL = process.env.APP_URL;
const familyId = process.env.TEST_FAMILY_ID;
// Use authenticated state for all tests
test.use({ storageState: "./playwright/.auth/user.json" });

test.describe("Pet Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}/app/family/${familyId}/pet/add`);
  });

  test("creates a new pet with all fields", async ({ page }) => {
    // debug statement to output the html of form
    await page.getByTestId("pet-name-input").fill("Test Pet");
    await page.getByTestId("start-date-input").fill("01/01/2024");
    await page
      .getByTestId("pet-description-input")
      .fill("Test pet description");
    await page.getByTestId("create-pet-button").click();

    await expect(page).toHaveURL(`/app/family/${process.env.TEST_FAMILY_ID}`);
    await expect(page.getByText("Test Pet")).toBeVisible();
  });

  test("shows validation error for short name", async ({ page }) => {
    // Try submitting with 1-character name
    await page.fill('input[placeholder="Pet Name"]', "A");
    await page.click('button:text("Create")');

    // Check for validation message
    await expect(
      page.getByText("Pet name must be at least 2 characters.")
    ).toBeVisible();
  });

  test("can edit existing pet", async ({ page }) => {
    // First create a pet
    await page.fill('input[placeholder="Pet Name"]', "Edit Test Dog");
    await page.fill('input[placeholder="YYYY-MM-DD"]', "2024-01-01");
    await page.click('button:text("Create")');

    // Navigate to edit page (you'll need to get the pet ID somehow)
    // This might require a custom API call or data-testid to find the pet
    await page.click("text=Edit Test Dog");

    // Edit name
    await page.fill('input[placeholder="Pet Name"]', "Updated Dog Name");

    // Click Done (saves automatically due to debounce)
    await page.click('button:text("Done")');

    // Verify update
    await expect(page.getByText("Updated Dog Name")).toBeVisible();
  });

  test("can delete pet", async ({ page }) => {
    // First create a pet
    await page.fill('input[placeholder="Pet Name"]', "Delete Test Dog");
    await page.fill('input[placeholder="YYYY-MM-DD"]', "2024-01-01");
    await page.click('button:text("Create")');

    // Navigate to edit page
    await page.click("text=Delete Test Dog");

    // Set up dialog handler
    page.once("dialog", (dialog) => dialog.accept());

    // Click delete and confirm
    await page.click('button:text("Delete")');

    // Verify pet is gone
    await expect(page.getByText("Delete Test Dog")).not.toBeVisible();
  });

  test("can connect pet to moment", async ({ page }) => {
    // Create pet first
    await page.fill('input[placeholder="Pet Name"]', "Connection Test Dog");
    await page.fill('input[placeholder="YYYY-MM-DD"]', "2024-01-01");
    await page.click('button:text("Create")');

    // Navigate to edit page
    await page.click("text=Connection Test Dog");

    // Assuming you have a test moment already created
    // Find and click the connect button for the test moment
    await page.getByRole("combobox", { name: "Moments" }).click();
    await page.getByText("Test Moment").click();

    // Verify connection (the moment should appear in connected list)
    await expect(page.getByText("Test Moment")).toBeVisible();
  });
});
