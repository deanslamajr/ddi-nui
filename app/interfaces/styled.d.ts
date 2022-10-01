// import original module declarations
import "styled-components";

// and extend them!
declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      white: string;
      pink: string;
      pinkTran: string;
      darkGray: string;
      lightGray: string;
      black: string;
      lightBlack: string;
    };
    canvas: {
      width: number;
      height: number;
    };
    cell: {
      fullWidth: string;
      width: string;
    };
    layout: {
      width: number;
      bottomPadding: number;
    };
    padding: number;
    fonts: string;
    zIndex: {
      highest: number;
      middle: number;
      lowest: number;
    };
  }
}
