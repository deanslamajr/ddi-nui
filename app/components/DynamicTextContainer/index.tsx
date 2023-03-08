import React from "react";
import classnames from "classnames";
import type { LinksFunction } from "@remix-run/node";

import stylesUrl from "~/styles/components/DynamicTextContainer.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

const MAX_WIDTH = 9999;
const MIN_WIDTH = 1;
const MAX_FONT_SIZE = 9999;
const MIN_FONT_SIZE = 1;

function calculateFontSize(elemWidth: number, fontRatio: number) {
  const width =
    elemWidth > MAX_WIDTH
      ? MAX_WIDTH
      : elemWidth < MIN_WIDTH
      ? MIN_WIDTH
      : elemWidth;
  const fontBase = width / fontRatio;
  const fontSize =
    fontBase > MAX_FONT_SIZE
      ? MAX_FONT_SIZE
      : fontBase < MIN_FONT_SIZE
      ? MIN_FONT_SIZE
      : fontBase;
  return Math.round(fontSize);
}

// Adapted from https://github.com/bond-agency/react-flowtype/blob/master/src/index.js
const DynamicTextContainer: React.FC<{
  caption: string | undefined;
  captionCssWidth?: string;
  fontRatio: number;
  isPreview?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}> = ({ captionCssWidth, caption, fontRatio, isPreview, onClick }) => {
  const [fontSize, setFontSize] = React.useState<null | number>(null);
  const container = React.useRef<HTMLDivElement>(null);
  const isMountedVal = React.useRef(1);

  React.useEffect(() => {
    isMountedVal.current = 1;
    if (container) {
      const elemWidth = container.current?.offsetWidth || 0;
      const newFontSize = calculateFontSize(elemWidth, fontRatio);
      if (isMountedVal.current) {
        setFontSize(newFontSize);
      }
    }
    return () => {
      isMountedVal.current = 0;
    };
  }, [container.current?.offsetWidth, isMountedVal.current]);

  const captionPadding = "0.25vw";

  const fontSizeStyles: React.CSSProperties = {
    display: fontSize ? undefined : "none",
    fontSize: fontSize ? `${fontSize}px` : "inherit",
    padding: captionPadding,
    width: `calc(${captionCssWidth || "100%"} - (2 * ${captionPadding}))`,
  };

  const captionWithBreaks = caption
    ? caption.split("\n").map((item) => {
        return (
          <span key={item}>
            {item}
            <br />
          </span>
        );
      })
    : [null];

  return (
    <div
      onClick={onClick}
      className={classnames("dynamic-text-container", { preview: isPreview })}
      style={fontSizeStyles}
      ref={container}
    >
      {isPreview ? captionWithBreaks[0] : captionWithBreaks}
    </div>
  );
};

export default DynamicTextContainer;
