import { test, expect, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("localhost/v2/gallery");
});

test.describe("Gallery Page", () => {
  test("clicking a comic should navigate to that comic", async ({ page }) => {
    // Click first comic in gallery
    const firstComicOnGallery = await page.locator(
      ".comics-container a:first-child"
    );

    const element = await firstComicOnGallery.elementHandle();
    const id = await element?.getProperty("id");

    await firstComicOnGallery.click();

    // Make sure the list only has one todo item.
    await expect(page.url()).toContain(`/comic/${id}`);
  });
});
