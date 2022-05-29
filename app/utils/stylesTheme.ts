import { DefaultTheme } from "styled-components";

export const theme: DefaultTheme = {
  colors: {
    // https://coolors.co/fffaf9-f4364c-cececf-e7e7e7-464655
    white: "#FFFAF9",
    pink: "#FF4C7F",
    pinkTran: "#FF4C7F50",
    darkGray: "#CECECF",
    lightGray: "#E7E7E7",
    black: "#464655",
  },
  canvas: {
    width: 250,
    height: 250,
  },
  cell: {
    fullWidth: "257px",
    width: "300px",
  },
  layout: {
    width: 250,
    bottomPadding: 75,
  },
  padding: 7,
  fonts: "'Nunito', sans-serif",
  zIndex: {
    highest: 999,
    middle: 0,
    lowest: -999,
  },
};
