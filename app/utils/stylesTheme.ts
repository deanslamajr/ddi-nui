import { DefaultTheme } from "styled-components";

export const theme: DefaultTheme = {
  colors: {
    // https://coolors.co/fffaf9-f4364c-cececf-e7e7e7-464655-575764
    white: "#FFFAF9",
    pink: "#FF4C7F",
    pinkTran: "#FF4C7F50",
    darkGray: "#CECECF",
    lightGray: "#E7E7E7",
    black: "#464655",
    lightBlack: "#575764",
  },
  canvas: {
    width: 250,
    height: 250,
  },
  cell: {
    fullWidth: "100%",
    width: "300px",
  },
  layout: {
    width: 300,
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
