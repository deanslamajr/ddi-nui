import { useEffect } from "react";
import type { LinksFunction, LoaderFunction } from "remix";
import { json, useLoaderData } from "remix";
import styled from "styled-components";

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

const Box = styled("div")`
  font-family: system-ui, sans-serif;
  line-height: 1.4;
  color: red;
`;

type LoaderData = { tacos: string[] };

export const loader: LoaderFunction = async () => {
  doEnvVarTestLogs();

  const { data } = await Promise.resolve({ data: {} }); // fetch.get(DDI_API_ENDPOINTS['getComics']);

  console.log("data", data);

  return json(data);
};

export default function IndexRoute() {
  useEffect(() => doEnvVarTestLogs(), []);

  const data = useLoaderData<LoaderData>();

  return (
    <Box>
      {JSON.stringify(data)}
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
