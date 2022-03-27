import styled from "styled-components";

const UnstyledLink = styled.a`
  text-decoration: none;
  color: ${(props) => props.theme.colors.black};
  position: relative;
`;

export default UnstyledLink;
