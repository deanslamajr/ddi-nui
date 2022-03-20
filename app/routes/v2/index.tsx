import { useEffect } from "react";
import type { LinksFunction, LoaderFunction } from "remix";
import { json, useLoaderData } from "remix";
import styled from "styled-components";

import { DDI_API_ENDPOINTS, getCellImageUrl } from "~/utils/urls";

import stylesUrl from "~/styles/index.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

const doEnvVarTestLogs = () => {
  console.log("process.env.BASE_URL", process?.env?.BASE_URL);

  console.log(
    `1. process.env.CELL_IMAGES_URL:${process?.env?.CELL_IMAGES_URL}`
  );

  // console.log(
  //   "2. publicRuntimeConfig.CELL_IMAGES_URL",
  //   publicRuntimeConfig.CELL_IMAGES_URL
  // );

  // console.log("3. props.cellImagesUrl", cellImagesUrl);
};

// remove this, this is just to verify styled-components work
const Box = styled("div")`
  font-family: system-ui, sans-serif;
  line-height: 1.4;
  color: red;
`;

type Comic = {
  cellsCount: number;
  initialCell: {
    caption: string;
    imageUrl: string;
    order: number | null;
    schemaVersion: number;
    urlId: string;
  };
  updatedAt: string;
  urlId: string;
};

type LoaderData = { comics: Array<Comic>; hasMore: boolean };

export const loader: LoaderFunction = async () => {
  doEnvVarTestLogs();

  console.log("about to fetch from:", DDI_API_ENDPOINTS["getComics"]);

  const res = await fetch(DDI_API_ENDPOINTS["getComics"]);

  const data = await res.json();
  console.log("data", data);

  return json(data);
};

export default function IndexRoute() {
  useEffect(() => doEnvVarTestLogs(), []);

  const data = useLoaderData<LoaderData>();

  console.log("loader data", data);

  return (
    <Box>
      <div>{JSON.stringify(data)}</div>
      {data.comics.map(({ initialCell }) => (
        <img
          src={getCellImageUrl(initialCell.imageUrl, initialCell.schemaVersion)}
        />
      ))}
      {/* <ComicsContainer>
        {comics.map(({ cellsCount, initialCell, urlId }) => (
          // <Link key={urlId} href={`/comic/${urlId}`} passHref>
          <Link
            key={urlId}
            href={DDI_APP_PAGES.getComicPageUrl(urlId)}
            passHref
          >
            <UnstyledLink id={urlId} onClick={() => handleComicClick(urlId)}>
              <CellsThumb cell={initialCell} cellsCount={cellsCount} />
            </UnstyledLink>
          </Link>
        ))}
      </ComicsContainer> */}

      {/* {newerComicsExist && (
        <NavButton
          value="SHOW NEWER"
          cb={this.handleRefreshClick}
          position={TOP_RIGHT}
        />
      )}

      {this.props.hasMoreComics && (
        <ShowMoreButton
          value="SHOW MORE"
          cb={this.showMoreComics}
          position={BOTTOM_CENTER}
        />
      )}

      <CreateButton
        value="+"
        accented
        cb={this.navigateToNewOrDrafts}
        position={BOTTOM_RIGHT}
      /> */}
    </Box>
  );
}
