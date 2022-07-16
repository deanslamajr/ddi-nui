import {
  test,
  expect,
  type Page,
  type Locator,
  type JSHandle,
} from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("./gallery");
});

const getComicUrlId = async (locator: Locator): Promise<string | undefined> => {
  const element = await locator.elementHandle();
  return (await element?.getProperty("id"))?.evaluate((id) => id);
};

test.describe("Gallery Page", () => {
  test("clicking a comic should navigate to that comic", async ({ page }) => {
    const firstComicOnInitialGalleryLoad = await page.locator(
      ".comics-container a:first-child"
    );
    const lastComicOnInitialGalleryLoad = await page.locator(
      ".comics-container a:last-child"
    );

    const firstComicOnInitialGalleryLoadUrlId = await getComicUrlId(
      firstComicOnInitialGalleryLoad
    );
    const lastComicOnInitialGalleryLoadUrlId = await getComicUrlId(
      lastComicOnInitialGalleryLoad
    );

    await lastComicOnInitialGalleryLoad.click();

    await expect(page.url()).toContain(
      `/comic/${lastComicOnInitialGalleryLoadUrlId}`
    );

    await page.locator("text=GALLERY").click();

    const firstComicOnGalleryAfterReturn = await page.locator(
      ".comics-container a:first-child"
    );

    const firstComicOnGalleryAfterReturnUrlId = await getComicUrlId(
      firstComicOnGalleryAfterReturn
    );

    expect(firstComicOnGalleryAfterReturnUrlId).toEqual(
      lastComicOnInitialGalleryLoadUrlId
    );

    await page.locator("text=↑").click();

    await page.locator(`.${firstComicOnInitialGalleryLoadUrlId}`);
  });
});
