import React from "react";
import https from "https";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { MenuButton, links as buttonStylesUrl } from "~/components/Button";
import { DDI_APP_PAGES, DDI_API_ENDPOINTS } from "~/utils/urls";
import { createNewCell } from "~/utils/clientCache/cell";
import getClientCookies from "~/utils/getClientCookiesForFetch";
import { getIsDebugProdCell, useDebuggerState } from "~/contexts/DebuggerState";
import isServerContext from "~/utils/isServerContext";

import stylesUrl from "~/styles/routes/v2/gallery/comic/$comicUrlId/cell/$cellUrlId.css";

export const links: LinksFunction = () => {
  return [...buttonStylesUrl(), { rel: "stylesheet", href: stylesUrl }];
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const url = new URL(request.url);
  const isDebugProdCell = getIsDebugProdCell(url.searchParams);
  const crossEnvOptions = isDebugProdCell
    ? isServerContext()
      ? {
          agent: new https.Agent({
            rejectUnauthorized: false,
          }),
        }
      : { credentials: "omit" }
    : undefined;

  const cellUrlId = params.cellUrlId;

  const cellDataResponse = await fetch(
    DDI_API_ENDPOINTS.getCell(cellUrlId!, isDebugProdCell),
    crossEnvOptions
      ? (crossEnvOptions as unknown as any)
      : getClientCookies(request)
  );

  if (!cellDataResponse.ok) {
    if (cellDataResponse.status === 404) {
      throw new Error(`404: Could not find cell with cellUrlId:${cellUrlId}`);
    }
    throw new Error(`HTTP error! Status: ${cellDataResponse.status}`);
  }

  const cellData = await cellDataResponse.json();

  return json(cellData);
};

export default function ComicViewRoute() {
  const cellData = useLoaderData();
  const navigate = useNavigate();
  const params = useParams();
  const cellUrlId = params.cellUrlId!;
  const comicUrlId = params.comicUrlId!;

  const navigateToAddCellFromDuplicate = () => {
    const newCell = createNewCell({
      initialStudioState: cellData.studioState,
    });

    navigate(
      DDI_APP_PAGES.cellStudio({
        comicUrlId: newCell.comicUrlId,
        cellUrlId: newCell.urlId,
      }),
      {
        state: { scroll: false },
      }
    );
  };

  React.useEffect(() => {
    const cellElement = document.getElementById(cellUrlId);
    cellElement?.scrollIntoView();
  }, []);

  return (
    <div>
      <MenuButton
        className="cell-action-button"
        onClick={() =>
          navigate(DDI_APP_PAGES.comic(comicUrlId) + "#" + cellUrlId, {
            state: { scroll: false },
          })
        }
      >
        BACK TO COMIC
      </MenuButton>
      <MenuButton
        accented
        className="cell-action-button"
        onClick={() => navigateToAddCellFromDuplicate()}
      >
        COPY CELL
      </MenuButton>
    </div>
  );
}
