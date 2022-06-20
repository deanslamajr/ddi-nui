import React from "react";
import styled, { css } from "styled-components";

import { phoneMax } from "~/components/breakpoints";

const MAX_WIDTH = 9999;
const MIN_WIDTH = 1;
const MAX_FONT_SIZE = 9999;
const MIN_FONT_SIZE = 1;

type ContainerProps = { fontSize: number | null; isPreview?: boolean };

const Container = styled.div<ContainerProps>`
  display: ${(props) => (props.fontSize ? "inherit" : "none")};
  font-size: ${(props) => (props.fontSize ? `${props.fontSize}px` : "inherit")};
  background: ${(props) => props.theme.colors.white};
  padding: 0.25vw;
  line-height: 1;
  overflow-wrap: break-word;

  ${phoneMax`
    padding: 1vw;
  `}

  ${(props) =>
    props.isPreview
      ? css<ContainerProps>`
          z-index: ${props.theme.zIndex.highest};
          position: absolute;
          bottom: 0.1rem;
          left: 0.1rem;
          right: 0.1rem;

          opacity: 0.75;
          background-color: ${props.theme.colors.white};
          color: ${props.theme.colors.black};

          user-select: none;
          cursor: pointer;
          overflow: hidden;

          white-space: nowrap;
          text-overflow: ellipsis;
        `
      : ""}
`;

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
export const DynamicTextContainer: React.FC<{
  fontRatio: number;
  isPreview?: boolean;
}> = ({ children, fontRatio, isPreview }) => {
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

  return (
    <Container fontSize={fontSize} isPreview={isPreview} ref={container}>
      {children}
    </Container>
  );
};
