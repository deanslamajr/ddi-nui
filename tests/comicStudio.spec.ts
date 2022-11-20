import {
  test,
  expect,
  type Page,
  type Locator,
  type JSHandle,
} from "@playwright/test";

test.describe("Comic Studio Page", () => {
  test.skip("handles page load with uninitialized client cache (e.g. first time visiting app)", async ({
    page,
  }) => {});

  test.skip("(NOT SURE IF THIS IS POSSIBLE) if comicUrlId does not exist in url, redirect to gallery page", async ({
    page,
  }) => {});

  test.skip("if can't hydrate comic from cache (i.e. comicUrlId is not cached yet), redirect to a new cell on the cell studio page", async ({
    page,
  }) => {});

  test.describe("if CAN hydrate from client cache (there is an entry for comicUrlId)", () => {});

  test.describe("if CAN`T hydrate from client cache (there is NO entry for comicUrlId)", () => {
    test.describe("if CAN`T hydrate from network request (comicUrlId does not exist in DB)", () => {
      test.skip("if can't hydrate comic from cache (i.e. comicUrlId is not real), redirect to a new cell on the cell studio page", async ({
        page,
      }) => {});
    });

    test.describe("if CAN hydrate from network request", () => {
      test.describe("if user is not authorized to edit comic", () => {
        test.skip("redirect to a new cell on the cell studio page", async ({
          page,
        }) => {});
      });
    });
  });
});
