import React from "react";
import type { LinksFunction } from "@remix-run/node";

import stylesUrl from "~/styles/components/Slider.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

const Slider: React.FC<{
  min: number;
  max: number;
  step?: number;
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
    <div className="slider-container">
      <input
        className="slider"
        type="range"
        min={min}
        max={max}
        step={step || "any"}
        value={value}
        onChange={parseOnChangeValue}
        onMouseUp={parseOnFinishValue}
        onTouchEnd={parseOnFinishValue}
      />
    </div>
  );
};

export default Slider;
