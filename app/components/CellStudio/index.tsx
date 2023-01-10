import React from "react";
import type { LinksFunction } from "@remix-run/node";
import { useParams, useNavigate } from "@remix-run/react";

import { DDI_APP_PAGES } from "~/utils/urls";
import { useComicStudioState } from "~/contexts/ComicStudioState";
import {
  redoCellUpdate,
  undoCellUpdate,
} from "~/contexts/ComicStudioState/actions";
import {
  getCellState,
  getNextCellChangeId,
  getPreviousCellChangeId,
} from "~/contexts/ComicStudioState/selectors";
import { addEmoji, moveEmoji } from "~/contexts/ComicStudioState/actions";

import EmojiPicker, {
  links as emojiPickerStylesUrl,
} from "~/components/EmojiPicker";
import EmojiCanvas, {
  EmojiRefs,
  links as emojiCanvasStylesUrl,
} from "~/components/EmojiCanvas";
import Modal, { links as modalStylesUrl } from "~/components/Modal";

import MainMenu, { links as mainMenuStylesUrl } from "./MainMenu";
import EmojiMenu, { links as emojiMenuStylesUrl } from "./EmojiMenu";
import CellMenu, { links as cellMenuStylesUrl } from "./CellMenu";
import SizeMenu, { links as sizeMenuStylesUrl } from "./SizeMenu";

import stylesUrl from "~/styles/components/CellStudio.css";

export const links: LinksFunction = () => {
  return [
    ...modalStylesUrl(),
    ...emojiPickerStylesUrl(),
    ...emojiCanvasStylesUrl(),
    ...mainMenuStylesUrl(),
    ...emojiMenuStylesUrl(),
    ...cellMenuStylesUrl(),
    ...sizeMenuStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
};

type Submenu = "MAIN" | "EMOJI" | "CELL" | "SIZE";

const CellStudio: React.FC<{}> = ({}) => {
  const navigate = useNavigate();

  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
  const [currentSubmenu, setCurrentSubmenu] = React.useState<Submenu>("MAIN");

  const params = useParams();
  const comicUrlId = params.comicUrlId!;
  const cellUrlId = params.cellUrlId!;

  const [comicStudioState, dispatch] = useComicStudioState();
  const cellState = getCellState(comicStudioState, cellUrlId);

  const totalEmojiCount = Object.values(
    cellState?.studioState?.emojis || {}
  ).length;

  const prevCellChangeId = getPreviousCellChangeId(comicStudioState, cellUrlId);
  const nextCellChangeId = getNextCellChangeId(comicStudioState, cellUrlId);

  const emojiRefs = React.useRef({} as EmojiRefs);

  const navigateToComicStudioPage = () => {
    const comicStudioPageUrl = DDI_APP_PAGES.comicStudio({
      comicUrlId,
    });
    navigate(comicStudioPageUrl, {
      state: { scroll: false },
    });
  };

  const handleDragEnd = ({
    xDiff,
    yDiff,
  }: {
    xDiff: number;
    yDiff: number;
  }) => {
    if (cellState?.studioState) {
      dispatch(
        moveEmoji({
          cellUrlId,
          emojiId: cellState.studioState.activeEmojiId,
          xDiff,
          yDiff,
        })
      );
    }
  };

  return (
    <>
      <Modal
        header={null}
        footer={null}
        onCancelClick={navigateToComicStudioPage}
        className="cell-studio-modal"
        fullHeight
      >
        <>
          {cellState?.studioState && totalEmojiCount !== 0 && (
            <>
              <EmojiCanvas
                activeEmojiId={cellState.studioState.activeEmojiId}
                backgroundColor={cellState.studioState.backgroundColor}
                emojiConfigs={Object.values(cellState.studioState.emojis)}
                emojiRefs={emojiRefs.current}
                handleDragEnd={handleDragEnd}
              />
              <div className="submenu-container">
                {currentSubmenu === "MAIN" ? (
                  <MainMenu
                    onAddButtonClick={() => setShowEmojiPicker(true)}
                    onEmojiButtonClick={() => setCurrentSubmenu("EMOJI")}
                    onCellButtonClick={() => setCurrentSubmenu("CELL")}
                    onSizeButtonClick={() => setCurrentSubmenu("SIZE")}
                  />
                ) : currentSubmenu === "EMOJI" ? (
                  <EmojiMenu
                    onBackButtonClick={() => setCurrentSubmenu("MAIN")}
                  />
                ) : currentSubmenu === "CELL" ? (
                  <CellMenu
                    onBackButtonClick={() => setCurrentSubmenu("MAIN")}
                  />
                ) : currentSubmenu === "SIZE" ? (
                  <SizeMenu
                    onBackButtonClick={() => setCurrentSubmenu("MAIN")}
                  />
                ) : null}
              </div>
            </>
          )}
          {prevCellChangeId && (
            <div className="nav-button top-right secondary large-icon">
              <button
                onClick={() =>
                  dispatch(undoCellUpdate({ cellUrlId, prevCellChangeId }))
                }
              >
                ↶
              </button>
            </div>
          )}
          {nextCellChangeId && (
            <div className="nav-button top-right large-icon">
              <button
                onClick={() =>
                  dispatch(redoCellUpdate({ cellUrlId, nextCellChangeId }))
                }
              >
                ↷
              </button>
            </div>
          )}
        </>
      </Modal>
      {(showEmojiPicker || totalEmojiCount === 0) && (
        <Modal
          header={null}
          footer={null}
          onCancelClick={
            totalEmojiCount > 0
              ? () => setShowEmojiPicker(false)
              : navigateToComicStudioPage
          }
          className="emoji-picker-modal"
          fullHeight
        >
          <EmojiPicker
            initialValue=""
            onSelect={(emoji) => {
              dispatch(addEmoji({ newEmoji: emoji, cellUrlId }));
              setShowEmojiPicker(false);
            }}
          />
        </Modal>
      )}
    </>
  );
};

export default CellStudio;
