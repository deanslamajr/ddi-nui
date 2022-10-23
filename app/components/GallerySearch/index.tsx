import React, { createContext, FC, useState } from "react";
import type { LinksFunction } from "@remix-run/node";
import { useNavigate, useSearchParams } from "@remix-run/react";

import Modal, {
  CenteredContainer,
  MessageContainer,
  links as modalStylesUrl,
} from "~/components/Modal";
import { MenuButton, links as buttonStylesUrl } from "~/components/Button";
import EmojiPicker, {
  links as emojiPickerStylesUrl,
} from "~/components/EmojiPicker";
import {
  EMOJI_FILTER_QUERYSTRING,
  CAPTION_FILTER_QUERYSTRING,
} from "~/components/ShowMore";

import stylesUrl from "~/styles/components/GallerySearch.css";

export const links: LinksFunction = () => {
  return [
    ...emojiPickerStylesUrl(),
    ...modalStylesUrl(),
    ...buttonStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
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
  const [searchParams, setSearchParams] = useSearchParams();
  const captionSearchValueFromUrl = searchParams.get(
    CAPTION_FILTER_QUERYSTRING
  );

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCaptionSearch, setShowCaptionSearch] = useState(false);
  const [captionSearchValue, setCaptionSearchValue] = useState(
    captionSearchValueFromUrl || ""
  );
  const { showGallerySearchModal, setShowGallerySearchModal } =
    React.useContext(GallerySearchContext);

  const onSearchEmoji = (emoji: string) => {
    setSearchParams(
      { [EMOJI_FILTER_QUERYSTRING]: emoji },
      { state: { scroll: false } }
    );
  };

  const onCaptionSearchInput: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const value = e.target.value;
    console.log(value);
    setCaptionSearchValue(value);
  };

  const onCaptionSearchSubmit = () => {
    setSearchParams(
      { [CAPTION_FILTER_QUERYSTRING]: captionSearchValue },
      { state: { scroll: false } }
    );
  };

  return (
    <>
      {showGallerySearchModal && (
        <Modal
          className="emoji-picker-modal"
          header={
            !showEmojiPicker &&
            !showCaptionSearch && <MessageContainer>Search</MessageContainer>
          }
          footer={
            !showEmojiPicker && !showCaptionSearch ? (
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
                  <MenuButton onClick={() => setShowCaptionSearch(true)}>
                    BY CAPTION
                  </MenuButton>
                </CenteredContainer>
              </>
            ) : !showCaptionSearch ? null : undefined // Show modal footer for caption search but not for emoji search
          }
          onCancelClick={() => {
            setShowEmojiPicker(false);
            setShowCaptionSearch(false);
            setShowGallerySearchModal && setShowGallerySearchModal(false);
          }}
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
          {showCaptionSearch && (
            <div className="caption-search-container">
              <input
                className="caption-search-input"
                type="text"
                id="captionSearch"
                name={CAPTION_FILTER_QUERYSTRING}
                value={captionSearchValue}
                onChange={onCaptionSearchInput}
                // defaultChecked
                // hidden
              />
              <CenteredContainer>
                <MenuButton
                  accented
                  onClick={() => {
                    onCaptionSearchSubmit();
                    setShowGallerySearchModal &&
                      setShowGallerySearchModal(false);
                    setShowCaptionSearch(false);
                  }}
                >
                  SEARCH CAPTIONS
                </MenuButton>
              </CenteredContainer>
              {/* <button
                disabled={!captionSearchValue}
                onClick={() => {
                  onCaptionSearchSubmit();
                  setShowGallerySearchModal && setShowGallerySearchModal(false);
                  setShowCaptionSearch(false);
                }}
                value="SEARCH"
              /> */}
            </div>
          )}
        </Modal>
      )}
    </>
  );
};

export default GallerySearch;
