import type { LinksFunction, LoaderFunction } from "remix";
import { json, Link, useLoaderData } from "remix";

import ShowMore from "~/components/ShowMore";
import { ComicsContainer } from "~/components/ComicsContainer";
import { CellsThumb } from "~/components/CellsThumb";
import UnstyledLink from "~/components/UnstyledLink";

import {
  DDI_API_ENDPOINTS,
  DDI_APP_PAGES,
  getCellImageUrl,
} from "~/utils/urls";

import stylesUrl from "~/styles/index.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

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

type LoaderData = {
  comics: Array<Comic>;
  cursor: string | null;
  hasMore: boolean;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const offset = url.searchParams.getAll("o");

  console.log("offset", offset);

  const res = await fetch(
    DDI_API_ENDPOINTS["getComics"](offset.length > 0 ? offset[0] : undefined)
  );

  const data = await res.json();
  console.log("data", data);

  return json({
    ...data,
    cursor: data.hasMore ? data.cursor : null,
  });
};

export default function IndexRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      {/* <div>{JSON.stringify(data)}</div>
      {data.comics.map(({ initialCell }) => (
        <img
          src={getCellImageUrl(initialCell.imageUrl, initialCell.schemaVersion)}
        />
      ))} */}
      <ComicsContainer>
        {data.comics.map(({ cellsCount, initialCell, urlId }) => (
          <UnstyledLink key={urlId} href={DDI_APP_PAGES.getComicPageUrl(urlId)}>
            <CellsThumb cell={initialCell} cellsCount={cellsCount} />
          </UnstyledLink>
        ))}
      </ComicsContainer>

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
      <ShowMore offset={data.cursor} />
    </div>
  );
}
