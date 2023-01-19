import React from "react";
import type { LinksFunction } from "@remix-run/node";
import styled from "styled-components";
import { useParams } from "@remix-run/react";
import { GiResize } from "react-icons/gi";
import cloneDeep from "fast-clone";

import { EMOJI_CONFIG } from "~/utils/constants";
import { theme } from "~/utils/stylesTheme";

import { EmojiConfigSerialized } from "~/models/emojiConfig";

import { useComicStudioState } from "~/contexts/ComicStudioState";
import { resizeEmoji } from "~/contexts/ComicStudioState/actions";
// import { getEmojiSize } from "~/contexts/ComicStudioState/selectors";

import { MenuButton, links as buttonStylesUrl } from "~/components/Button";
import Slider, { links as sliderStylesUrl } from "~/components/Slider";
import DPad, { links as dPadStylesUrl } from "~/components/DPad";
import EmojiCanvas, {
  links as emojiCanvasStylesUrl,
} from "~/components/EmojiCanvas";

import { BackMenuButton } from "./MainMenu";

import stylesUrl from "~/styles/components/CellStudio.css";

export const links: LinksFunction = () => {
  return [
    ...emojiCanvasStylesUrl(),
    ...buttonStylesUrl(),
    ...sliderStylesUrl(),
    ...dPadStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
};

const SliderContainer = styled.div`
  width: 100%;
  padding: 0.5rem 0 1.5rem;
`;

const Label = styled.span`
  margin: 0.1rem auto;
  display: flex;
  justify-content: center;
  user-select: none;
`;

const SizeMenu: React.FC<{
  activeEmojiId: number;
  emojiConfigs: Record<string, EmojiConfigSerialized>;
  handleDragEnd: (args: { xDiff: number; yDiff: number }) => void;
  backgroundColor: string;
  onBackButtonClick: () => void;
}> = ({
  activeEmojiId,
  backgroundColor,
  emojiConfigs,
  handleDragEnd,
  onBackButtonClick,
}) => {
  const params = useParams();
  const cellUrlId = params.cellUrlId!;

  const [state, setState] = React.useState<{
    emojiSize: number;
    localEmojiConfigs: EmojiConfigSerialized[];
  }>(() => {
    const localEmojiConfigs = Object.values(emojiConfigs);
    const activeEmoji = emojiConfigs[activeEmojiId];
    return {
      emojiSize: activeEmoji.size,
      localEmojiConfigs,
    };
  });
  // const [activeEmoji] = React.useState(emojiConfigs[activeEmojiId]);

  const resizeLocalEmoji = (newSize: number): void => {
    const clonedEmojiConfigs = cloneDeep(state.localEmojiConfigs);
    const clonedActiveEmoji = clonedEmojiConfigs.find(
      (e) => e.id === activeEmojiId
    ); //clonedEmojiConfigs[activeEmojiId];
    if (!clonedActiveEmoji) {
      return;
    }
    clonedActiveEmoji.size = newSize;
    setState({ emojiSize: newSize, localEmojiConfigs: clonedEmojiConfigs });
  };

  const [comicStudioState, dispatch] = useComicStudioState();
  const saveAndGoBack = () => {
    dispatch(
      resizeEmoji({
        newSize: state.emojiSize,
        cellUrlId,
        shouldSaveChange: true,
      })
    );
    onBackButtonClick();
  };

  // const emojiSize = getEmojiSize(comicStudioState, cellUrlId);

  return (
    <>
      <EmojiCanvas
        activeEmojiId={activeEmojiId}
        backgroundColor={backgroundColor}
        emojiConfigs={state.localEmojiConfigs}
        handleDragEnd={handleDragEnd}
      />
      <BackMenuButton onBackButtonClick={saveAndGoBack} />
      {state.emojiSize !== null ? (
        <SliderContainer>
          <Label>
            <GiResize color={theme.colors.pink} size="2rem" />
          </Label>
          <Slider
            min={EMOJI_CONFIG.MIN_SIZE}
            max={EMOJI_CONFIG.MAX_SIZE}
            step={10}
            value={state.emojiSize}
            onChange={
              (value) => resizeLocalEmoji(value)
              // dispatch(
              //   resizeEmoji({
              //     newSize: value,
              //     cellUrlId,
              //     shouldSaveChange: false,
              //   })
              // )
            }
            onRelease={
              (value) => resizeLocalEmoji(value)
              // dispatch(
              //   resizeEmoji({
              //     newSize: value,
              //     cellUrlId,
              //     shouldSaveChange: true,
              //   })
              // )
            }
          />
          <DPad
            horizontalActions={(multiplier) => ({
              onLeftClick: () => {
                let newValue = state.emojiSize - multiplier;
                if (newValue <= 0) {
                  newValue = 0;
                }
                resizeLocalEmoji(newValue);
              },
              // dispatch(
              //   resizeEmoji({
              //     newSize: emojiSize - multiplier,
              //     cellUrlId,
              //     shouldSaveChange: true,
              //   })
              // ),
              onRightClick: () =>
                resizeLocalEmoji(state.emojiSize + multiplier),
              // dispatch(
              //   resizeEmoji({
              //     newSize: emojiSize + multiplier,
              //     cellUrlId,
              //     shouldSaveChange: true,
              //   })
              // ),
            })}
          />
        </SliderContainer>
      ) : (
        <MenuButton className="cell-studio-menu-button">ERROR!!!</MenuButton>
      )}
    </>
  );
};

export default SizeMenu;
