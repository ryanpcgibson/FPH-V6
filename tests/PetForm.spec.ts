import { test, expect } from "@playwright/test";
import { generateTestId, randDate } from "./testUtils";
import { VALIDATION_MESSAGES } from "../src/constants/validationMessages";
import { format } from "date-fns";
import { DATE_FORMATS } from "../src/lib/utils";

const baseURL = process.env.APP_URL;
const familyId = process.env.TEST_FAMILY_ID;
// Use authenticated state for all tests
test.use({ storageState: "./playwright/.auth/user.json" });

test.describe("Pet Form", () => {
  // test.beforeEach(async ({ page }) => {
  // });

  // const petName = "pet-5uo1n0";
  const petName = generateTestId("pet");
  const startDate = randDate();
  const updatedPetName = `${petName} Updated`;
  const updatedStartDate = randDate();
  let petId;

  test("creates a new pet with all fields", async ({ page }) => {
    await page.goto(`${baseURL}/app/family/${familyId}/pet/add`);

    await page.getByTestId("pet-name-input").fill(petName);
    await page
      .getByTestId("start-date-input")
      .fill(format(startDate, DATE_FORMATS.US));
    await page
      .getByTestId("pet-description-input")
      .fill("Test pet description");
    await page.getByTestId("create-pet-button").click();

    await expect(page).toHaveURL(`/app/family/${process.env.TEST_FAMILY_ID}`);

    await expect(page.getByText(petName)).toBeVisible();
  });

  test("shows validation error for short name", async ({ page }) => {
    await page.goto(`${baseURL}/app/family/${familyId}/pet/add`);

    // Try submitting with 1-character name
    await page.fill('input[placeholder="Pet Name"]', "A");
    await page.click('button:text("Create")');

    // Check for validation message
    await expect(
      page.getByText(VALIDATION_MESSAGES.PET.NAME_MIN_LENGTH)
    ).toBeVisible();
  });

  test("can edit existing pet", async ({ page }) => {
    await page.goto(`${baseURL}/app/family/${familyId}`);
    const petElement = page.locator(`[data-entity-id]`, {
      has: page.getByText(petName),
    });
    const petId = await petElement.getAttribute("data-entity-id");
    await page.goto(`${baseURL}/app/family/${familyId}/pet/${petId}/edit`);

    await page.fill('input[placeholder="Pet Name"]', updatedPetName);
    await page.fill(
      `input[placeholder="${DATE_FORMATS.PLACEHOLDER}"]`,
      format(updatedStartDate, DATE_FORMATS.US)
    );
    await page.click('button:text("Done")');

    // Verify update
    await expect(page.getByText(updatedPetName)).toBeVisible();
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
