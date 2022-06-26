import { Comic } from "~/interfaces/comic";

const sortComics = (comics: Comic[]): Comic[] => {
  const comicUrlIdsForFilteringDuplicates: string[] = [];
  return comics
    .slice() // to avoid mutating the array from the next line's in-place sort
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .filter((comic) => {
      if (!comicUrlIdsForFilteringDuplicates.includes(comic.urlId)) {
        comicUrlIdsForFilteringDuplicates.push(comic.urlId);
        return true;
      }
      return false;
    });
};

export default sortComics;
