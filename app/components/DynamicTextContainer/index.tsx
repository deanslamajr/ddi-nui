import React from "react";
import styled from "styled-components";

import { phoneMax } from "~/components/breakpoints";

const MAX_WIDTH = 9999;
const MIN_WIDTH = 1;
const MAX_FONT_SIZE = 9999;
const MIN_FONT_SIZE = 1;

const Container = styled.div<{ fontSize: number }>`
  display: ${(props) => (props.fontSize ? "inherit" : "none")};
  font-size: ${(props) => props.fontSize}px;
  background: ${(props) => props.theme.colors.white};
  padding: 0.25vw;
  line-height: 1;
  overflow-wrap: break-word;

  ${phoneMax`
    padding: 1vw;
  `}
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
export class DynamicTextContainer extends React.Component<
  { fontRatio: number },
  {
    elemWidth: number | null;
    fontSize: number | null;
  }
> {
  state = {
    elemWidth: MIN_WIDTH,
    fontSize: MIN_FONT_SIZE,
  };

  container: HTMLDivElement | null = null;

  componentDidMount() {
    if (this.container) {
      this.setFontSize();
    }
  }

  componentDidUpdate(
    prevProps: { fontRatio: number },
    prevState: {
      elemWidth: number;
      fontSize: number;
    }
  ) {
    if (
      this.container &&
      (this.container.offsetWidth !== prevState.elemWidth ||
        this.props.fontRatio !== prevProps.fontRatio)
    ) {
      this.setFontSize();
    }
  }

  setFontSize = () => {
    const elemWidth = this.container?.offsetWidth || 0;
    const fontSize = calculateFontSize(elemWidth, this.props.fontRatio);

    this.setState({
      elemWidth,
      fontSize,
    });
  };

  render() {
    return (
      <Container
        fontSize={this.state.fontSize}
        ref={(container) => (this.container = container)}
      >
        {this.props.children}
      </Container>
    );
  }
}
