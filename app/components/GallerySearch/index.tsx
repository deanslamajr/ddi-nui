import React, { createContext, FC, useState } from "react";
import type { LinksFunction } from "@remix-run/node";
import { useSearchParams, useNavigate } from "@remix-run/react";

import Modal, {
  CenteredContainer,
  MessageContainer,
  links as modalStylesUrl,
} from "~/components/Modal";
import { MenuButton, links as buttonStylesUrl } from "~/components/Button";
import EmojiPicker, {
  links as emojiPickerStylesUrl,
} from "~/components/EmojiPicker";
import { EMOJI_FILTER_QUERYSTRING } from "~/components/ShowMore";

export const links: LinksFunction = () => {
  return [...emojiPickerStylesUrl(), ...modalStylesUrl(), ...buttonStylesUrl()];
};

const GallerySearchContext = createContext<{
  showGallerySearchModal: boolean;
  setShowGallerySearchModal: null | React.Dispatch<
    React.SetStateAction<boolean>
  >;
}>({
  showGallerySearchModal: false,
  setShowGallerySearchModal: null,
});

export const GallerySearchProvider: FC<{}> = ({ children }) => {
  const [showGallerySearchModal, setShowGallerySearchModal] = useState(false);

  return (
    <GallerySearchContext.Provider
      value={{ showGallerySearchModal, setShowGallerySearchModal }}
    >
      {children}
    </GallerySearchContext.Provider>
  );
};

export const GallerySearchNavButton: FC<{}> = ({}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const emojiFilters = searchParams.getAll(EMOJI_FILTER_QUERYSTRING);

  // console.log("emojiFilters", emojiFilters);
  const isFilterActive = emojiFilters.length > 0;

  const { showGallerySearchModal, setShowGallerySearchModal } =
    React.useContext(GallerySearchContext);

  return !showGallerySearchModal ? (
    <>
      {isFilterActive && (
        <div className="nav-button top-right secondary">
          <button
            onClick={() =>
              navigate(".", {
                state: { scroll: false },
              })
            }
          >
            🔝
          </button>
        </div>
      )}
      <div className="nav-button top-right">
        <button
          onClick={() =>
            setShowGallerySearchModal && setShowGallerySearchModal(true)
          }
        >
          {isFilterActive ? emojiFilters[0] : "🕹️"}
        </button>
      </div>
    </>
  ) : null;
};

const GallerySearch: FC<{}> = ({}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { showGallerySearchModal, setShowGallerySearchModal } =
    React.useContext(GallerySearchContext);

  const [searchParams, setSearchParams] = useSearchParams();
  const onSearchEmoji = (emoji: string) => {
    setSearchParams(
      { [EMOJI_FILTER_QUERYSTRING]: emoji },
      { state: { scroll: false } }
    );
  };

  return (
    <>
      {showGallerySearchModal && (
        <Modal
          className="emoji-picker-modal"
          header={
            !showEmojiPicker && <MessageContainer>Search</MessageContainer>
          }
          footer={
            !showEmojiPicker ? (
              <>
                <CenteredContainer>
                  <MenuButton
                    onClick={() => {
                      setShowEmojiPicker(true);
                    }}
                  >
                    BY EMOJI
                  </MenuButton>
                </CenteredContainer>
                <CenteredContainer>
                  <MenuButton onClick={() => {}}>BY CAPTION</MenuButton>
                </CenteredContainer>
              </>
            ) : null
          }
          onCancelClick={() =>
            setShowGallerySearchModal && setShowGallerySearchModal(false)
          }
        >
          {showEmojiPicker && (
            <EmojiPicker
              onCancel={() => {
                setShowGallerySearchModal && setShowGallerySearchModal(false);
                setShowEmojiPicker(false);
              }}
              onSelect={(emoji) => {
                onSearchEmoji(emoji);
                setShowGallerySearchModal && setShowGallerySearchModal(false);
                setShowEmojiPicker(false);
              }}
            />
          )}
        </Modal>
      )}
    </>
  );
};

export default GallerySearch;
