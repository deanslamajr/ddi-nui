import type { LinksFunction } from "@remix-run/node";
import { Component, FC, Suspense, ReactNode } from "react";
import { useImage } from "react-image";

import { getCellImageUrl } from "~/utils/urls";
import { getClientVariable } from "~/utils/environment-variables";

import DynamicTextContainer, {
  links as dynamicTextContainerStylesUrl,
} from "~/components/DynamicTextContainer";

import stylesUrl from "~/styles/components/CellsThumb.css";

export const links: LinksFunction = () => {
  return [
    ...dynamicTextContainerStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
};

class ErrorBoundary extends Component<
  {
    children?: ReactNode;
  },
  { hasError: boolean }
> {
  public state: { hasError: boolean } = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <img
          className="base-cell-image"
          src={`${getClientVariable("ASSETS_URL_WITH_PROTOCOL")}/error.png`}
          alt="Cannot load image"
        />
      );
    }

    return this.props.children;
  }
}

const Image: FC<{
  imageUrl: string;
}> = ({ imageUrl }) => {
  const { src } = useImage({
    srcList: imageUrl,
  });

  return <img className="base-cell-image" src={src} />;
};

const CellsThumb: FC<{
  cell?: {
    caption: string;
    imageUrl: string;
    schemaVersion: number;
  };
  cellsCount: number;
}> = ({ cell, cellsCount }) => {
  if (cell) {
    const imageUrl =
      cell.schemaVersion === 1
        ? cell.imageUrl
        : getCellImageUrl(cell.imageUrl, cell.schemaVersion);

    return (
      <>
        {cellsCount > 1 && <div className="cells-count">{cellsCount}</div>}
        {cell.caption && (
          <DynamicTextContainer
            caption={cell.caption}
            fontRatio={16}
            isPreview
            captionCssPadding="0.2vw"
          />
        )}
        <ErrorBoundary>
          <Suspense
            fallback={
              <img
                className="base-cell-image"
                src={`${getClientVariable(
                  "ASSETS_URL_WITH_PROTOCOL"
                )}/loading.png`}
                alt="Loading image"
              />
            }
          >
            <Image imageUrl={imageUrl} />
          </Suspense>
        </ErrorBoundary>
      </>
    );
  }

  return null;
};

export default CellsThumb;
