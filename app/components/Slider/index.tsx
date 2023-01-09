import React from "react";
import styled from "styled-components";
import type { LinksFunction } from "@remix-run/node";

import stylesUrl from "~/styles/components/Slider.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

const SlideContainer = styled.div`
  width: 100%;
`;

const Sslider = styled.input`
  appearance: none;
  width: 100%;
  height: 15px;
  border-radius: 5px;
  background: ${(props) => props.theme.colors.lightGray};
  opacity: 0.7;
  transition: opacity 0.2s;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.4);
  user-select: none;
  margin: 0;
  border: none;

  &:focus {
    outline: none;
  }

  &:hover {
    opacity: 1; /* Fully shown on mouse-over */
  }

  &::-webkit-slider-thumb {
    appearance: none;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: ${(props) => props.theme.colors.white};
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: ${(props) => props.theme.colors.white};
    cursor: pointer;
  }
`;

const Slider: React.FC<{
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (newValue: number) => void;
  onRelease: (newValue: number) => void;
}> = ({ min, max, step, value, onChange, onRelease }) => {
  const parseOnChangeValue: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const newValue = e && e.target && e.target.value;

    if (newValue) {
      const newNumber = parseFloat(newValue);
      onChange(newNumber);
    }
  };

  // React.TouchEvent<HTMLInputElement> | React.MouseEvent<HTMLInputElement, MouseEvent>
  const parseOnFinishValue = (
    e:
      | React.TouchEvent<HTMLInputElement>
      | React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    const newValue = e && e.target && (e.target as HTMLInputElement).value;

    if (newValue) {
      const newNumber = parseFloat(newValue);
      onRelease(newNumber);
    }
  };

  return (
    <SlideContainer>
      <Sslider
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={parseOnChangeValue}
        onMouseUp={parseOnFinishValue}
        onTouchEnd={parseOnFinishValue}
      />
    </SlideContainer>
  );
};

export default Slider;
