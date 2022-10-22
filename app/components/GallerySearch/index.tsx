import React, { createContext, FC, useState } from "react";
import type { LinksFunction } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";

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
  const { showGallerySearchModal, setShowGallerySearchModal } =
    React.useContext(GallerySearchContext);

  return !showGallerySearchModal ? (
    <div className="nav-button top-right">
      <button
        onClick={() =>
          setShowGallerySearchModal && setShowGallerySearchModal(true)
        }
      >
        🕹️
      </button>
    </div>
  ) : null;
};

const GallerySearch: FC<{}> = ({}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { showGallerySearchModal, setShowGallerySearchModal } =
    React.useContext(GallerySearchContext);

  const [searchParams, setSearchParams] = useSearchParams();
  const onSearchEmoji = (emoji: string) => {
    setSearchParams({ [EMOJI_FILTER_QUERYSTRING]: emoji });
  };

  return (
    <>
      {showGallerySearchModal && (
        <Modal
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
