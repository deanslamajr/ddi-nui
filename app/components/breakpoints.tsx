import styled, {
  css,
  createGlobalStyle,
  CSSObject,
  DefaultTheme,
  Interpolation,
  InterpolationFunction,
  SimpleInterpolation,
  ThemeProps,
  ThemedStyledProps,
  FlattenInterpolation,
} from "styled-components";

export const tabletMax = <T extends {}>(
  cssRules:
    | CSSObject
    | TemplateStringsArray
    | InterpolationFunction<ThemedStyledProps<T, DefaultTheme>>,
  ...interpolations:
    | SimpleInterpolation[]
    | Array<Interpolation<ThemedStyledProps<T, DefaultTheme>>>
) => css`
  @media (max-width: 899px) {
    ${css(cssRules, ...interpolations)}
  }
`;

export const phoneMax = <T extends {}>(
  cssRules:
    | CSSObject
    | TemplateStringsArray
    | InterpolationFunction<ThemedStyledProps<T, DefaultTheme>>,
  ...interpolations:
    | SimpleInterpolation[]
    | Array<Interpolation<ThemedStyledProps<T, DefaultTheme>>>
) => css`
  @media (max-width: 599px) {
    ${css(cssRules, ...interpolations)}
  }
`;
