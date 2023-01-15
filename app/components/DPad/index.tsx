import React from "react";
import classNames from "classnames";
import {
  RxArrowUp,
  RxArrowLeft,
  RxArrowRight,
  RxArrowDown,
} from "react-icons/rx";
import type { LinksFunction } from "@remix-run/node";

import { MenuButton, links as buttonStylesUrl } from "~/components/Button";

import stylesUrl from "~/styles/components/DPad.css";

export const links: LinksFunction = () => {
  return [...buttonStylesUrl(), { rel: "stylesheet", href: stylesUrl }];
};

const DPad: React.FC<{
  horizontalActions?: (multiplier: number) => {
    onLeftClick: () => void;
    onRightClick: () => void;
  };
  verticalActions?: (multiplier: number) => {
    onUpClick: () => void;
    onDownClick: () => void;
  };
}> = ({ horizontalActions, verticalActions }) => {
  const [showChooseMultiplicationLevel, setShowChooseMultiplicationLevel] =
    React.useState(false);

  const [multiplier, setMultiplier] = React.useState<1 | 2 | 5 | 10>(1);

  return (
    <div className="d-pad">
      {!showChooseMultiplicationLevel ? (
        <>
          {verticalActions && (
            <MenuButton
              className="cell-studio-menu-button half-width"
              noSpinner
              onClick={verticalActions(multiplier).onUpClick}
            >
              <RxArrowUp />
            </MenuButton>
          )}
          <div className="button-row">
            {horizontalActions && (
              <MenuButton
                className="cell-studio-menu-button half-width"
                noSpinner
                onClick={horizontalActions(multiplier).onLeftClick}
              >
                <RxArrowLeft />
              </MenuButton>
            )}
            <MenuButton
              className="cell-studio-menu-button half-width"
              noSpinner
              onClick={() => setShowChooseMultiplicationLevel(true)}
            >
              {multiplier}x
            </MenuButton>
            {horizontalActions && (
              <MenuButton
                className="cell-studio-menu-button half-width"
                noSpinner
                onClick={horizontalActions(multiplier).onRightClick}
              >
                <RxArrowRight />
              </MenuButton>
            )}
          </div>
          {verticalActions && (
            <MenuButton
              className="cell-studio-menu-button half-width"
              noSpinner
              onClick={verticalActions(multiplier).onDownClick}
            >
              <RxArrowDown />
            </MenuButton>
          )}
        </>
      ) : (
        <>
          <MenuButton
            className={classNames("cell-studio-menu-button", {
              accented: multiplier === 1,
            })}
            noSpinner
            onClick={() => {
              setMultiplier(1);
              setShowChooseMultiplicationLevel(false);
            }}
          >
            1x
          </MenuButton>
          <MenuButton
            className={classNames("cell-studio-menu-button", {
              accented: multiplier === 2,
            })}
            noSpinner
            onClick={() => {
              setMultiplier(2);
              setShowChooseMultiplicationLevel(false);
            }}
          >
            2x
          </MenuButton>
          <MenuButton
            className={classNames("cell-studio-menu-button", {
              accented: multiplier === 5,
            })}
            noSpinner
            onClick={() => {
              setMultiplier(5);
              setShowChooseMultiplicationLevel(false);
            }}
          >
            5x
          </MenuButton>
          <MenuButton
            className={classNames("cell-studio-menu-button", {
              accented: multiplier === 10,
            })}
            noSpinner
            onClick={() => {
              setMultiplier(10);
              setShowChooseMultiplicationLevel(false);
            }}
          >
            10x
          </MenuButton>
        </>
      )}
    </div>
  );
};

export default DPad;
