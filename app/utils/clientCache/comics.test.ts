import store from "store2";

import { getCache } from "./";
import { doesComicUrlIdExist, getComicsCache } from "./comics";

describe("clientCache/comics", () => {
  let ddiCache;

  beforeEach(() => {
    store.isFake(true);
    ddiCache = getCache();
    ddiCache({});
  });

  describe("getComics", () => {
    xit("should return the currently cached comics datastructure", () => {
      // const actual = getComics();
      // expect(actual).toStrictEqual(comics);
    });

    describe("if `comics` field doesnt exist on client cache", () => {
      it("should return null", () => {
        const actual = getComicsCache();
        expect(actual).toBe(null);
      });
    });
  });

  describe("doesComicUrlIdExist", () => {
    it("should return false if cellUrlId doesnt exist in cache", () => {
      expect(doesComicUrlIdExist("shouldNotExist")).toBe(false);
    });

    xit("should return true if cellUrlId exists in cache", () => {
      const mockComicUrlId = "someId";

      // expect(doesComicUrlIdExist(mockComicUrlId)).toBe(true);
    });

    describe("if cache does not exist", () => {
      it("should return false", () => {
        store("", null);
        expect(doesComicUrlIdExist("shouldNotExist")).toBe(false);
      });
    });

    describe("if cache does not have `cells` field", () => {
      xit("should return false", () => {
        store("", {});
        expect(doesComicUrlIdExist("shouldNotExist")).toBe(false);
      });
    });
  });
});
