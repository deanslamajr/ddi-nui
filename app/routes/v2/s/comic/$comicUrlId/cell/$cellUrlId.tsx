import React from "react";
import type { LinksFunction } from "@remix-run/node";
import { useParams, useNavigate } from "@remix-run/react";
import Modal, { links as modalStylesUrl } from "~/components/Modal";
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
// import { hasUndo } from "~/utils/studioStateMachine";

import CellStudio, {
  links as cellStudioStylesUrl,
} from "~/components/CellStudio";
import EmojiPicker, {
  links as emojiPickerStylesUrl,
} from "~/components/EmojiPicker";

import stylesUrl from "~/styles/routes/v2/s/comic/$comicUrlId/cell/$cellUrlId.css";

export const links: LinksFunction = () => {
  return [
    ...cellStudioStylesUrl(),
    ...modalStylesUrl(),
    ...emojiPickerStylesUrl(),
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

  const navigateToComicStudioPage = () => {
    const comicStudioPageUrl = DDI_APP_PAGES.comicStudio({
      comicUrlId,
    });
    navigate(comicStudioPageUrl, {
      state: { scroll: false },
    });
  };

  return (
    <>
      <Modal
        header={null}
        footer={null}
        onCancelClick={navigateToComicStudioPage}
        className="cell-studio-modal"
      >
        <>
          {cellState?.studioState && (
            <CellStudio
              cellStudioState={cellState.studioState}
              cellUrlId={cellUrlId}
              onShowEmojiPickerButtonClick={() => setShowEmojiPicker(true)}
            />
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
              // onSearchEmoji(emoji);
              setShowEmojiPicker(false);
            }}
          />
        </Modal>
      )}
    </>
  );
}

export const unstable_shouldReload = () => false;
