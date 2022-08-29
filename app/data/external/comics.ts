import { DDI_API_ENDPOINTS } from "~/utils/urls";

import { StudioState } from "~/interfaces/studioState";

// mock data circa 16 July 2022
// {
//   "comicUpdatedAt": "2022-07-03T21:19:46.811Z",
//   "cells": [
//       {
//           "urlId": "Eqje8I-Jds",
//           "imageUrl": "fumZsAhdfL.png",
//           "order": null,
//           "schemaVersion": 4,
//           "studioState": {
//               "activeEmojiId": 1,
//               "backgroundColor": "#FFFAF9",
//               "currentEmojiId": 2,
//               "caption": "",
//               "emojis": {
//                   "1": {
//                       "emoji": "😄",
//                       "id": 1,
//                       "order": 1,
//                       "x": 100,
//                       "y": 100,
//                       "scaleX": 1,
//                       "scaleY": 1,
//                       "skewX": 0,
//                       "skewY": 0,
//                       "rotation": 0,
//                       "size": 100,
//                       "alpha": 0.5,
//                       "red": 125,
//                       "green": 0,
//                       "blue": 0,
//                       "opacity": 1
//                   }
//               }
//           },
//           "caption": "",
//           "previousCellUrlId": null
//       }
//   ],
//   "isActive": true,
//   "initialCellUrlId": "Eqje8I-Jds",
//   "title": "",
//   "urlId": "k_OpU2lqw",
//   "userCanEdit": true
// }

type ComicCellLegacy = {
  urlId: string;
  imageUrl: string;
  order: number | null;
  schemaVersion: number | null;
  studioState: StudioState | null;
  caption: string | null;
  previousCellUrlId: string | null;
};

export type ComicLegacy = {
  cells: ComicCellLegacy[];
  comicUpdatedAt: string;
  isActive: boolean;
  initialCellUrlId: string;
  title: string;
  urlId: string;
  userCanEdit: true;
};

export const get = async (comicUrlId: string): Promise<ComicLegacy | null> => {
  let comicFromApi: ComicLegacy;

  try {
    const response: Response = await fetch(
      DDI_API_ENDPOINTS.getComic(comicUrlId)
    );

    if (!response.ok) {
      // errorAttributes = {
      //   statusCode: response.status.toString(),
      //   url: response.url,
      //   statusText: response.statusText,
      // };
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    comicFromApi = await response.json();
  } catch (error: any) {
    // TODO better logging
    console.error(error);
    // newrelic.noticeError(error, {
    //   action: "getPreviousComics",
    //   newerOffset,
    //   ...errorAttributes,
    // });
    return null;
  }

  return comicFromApi;
};
