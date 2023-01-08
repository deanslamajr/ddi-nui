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

import EmojiPicker, {
  links as emojiPickerStylesUrl,
} from "~/components/EmojiPicker";
import Modal, { links as modalStylesUrl } from "~/components/Modal";
import { MenuButton, links as buttonStylesUrl } from "~/components/Button";
import EmojiCanvas, {
  EmojiRefs,
  links as emojiCanvasStylesUrl,
} from "~/components/EmojiCanvas";

import { addEmoji, moveEmoji } from "~/contexts/ComicStudioState/actions";

import stylesUrl from "~/styles/routes/v2/s/comic/$comicUrlId/cell/$cellUrlId.css";

export const links: LinksFunction = () => {
  return [
    ...modalStylesUrl(),
    ...emojiPickerStylesUrl(),
    ...buttonStylesUrl(),
    ...emojiCanvasStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
};

/**
 * MAIN
 */
export default function CellStudioRoute() {
  const navigate = useNavigate();

  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);

  const params = useParams();
  const comicUrlId = params.comicUrlId!;
  const cellUrlId = params.cellUrlId!;

  const [comicStudioState, dispatch] = useComicStudioState();
  const cellState = getCellState(comicStudioState, cellUrlId);
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
          {cellState?.studioState && (
            <>
              <EmojiCanvas
                activeEmojiId={cellState.studioState.activeEmojiId}
                backgroundColor={cellState.studioState.backgroundColor}
                emojiConfigs={Object.values(cellState.studioState.emojis)}
                emojiRefs={emojiRefs.current}
                handleDragEnd={handleDragEnd}
              />
              <div>
                <MenuButton
                  accented
                  className="cell-studio-menu-button"
                  onClick={() => setShowEmojiPicker(true)}
                >
                  +
                </MenuButton>
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
      {showEmojiPicker && (
        <Modal
          header={null}
          footer={null}
          onCancelClick={() => setShowEmojiPicker(false)}
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
}

export const unstable_shouldReload = () => false;
