import styled from "styled-components";

import { tabletMax } from "../breakpoints";

export const ComicsContainer = styled.div`
  display: grid;
  grid-gap: 1px;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: auto;

  ${tabletMax`
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  `}
`;

export const UnstyledLink = styled.a`
  text-decoration: none;
  color: ${(props) => props.theme.colors.black};
  position: relative;
  aspect-ratio: 1;
`;
