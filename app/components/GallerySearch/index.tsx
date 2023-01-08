import React, { createContext, FC, PropsWithChildren, useState } from "react";
import type { LinksFunction } from "@remix-run/node";
import { useNavigate, useSearchParams } from "@remix-run/react";
import classNames from "classnames";

import Modal, {
  CenteredContainer,
  MessageContainer,
  links as modalStylesUrl,
} from "~/components/Modal";
import { MenuButton, links as buttonStylesUrl } from "~/components/Button";
import EmojiPicker, {
  links as emojiPickerStylesUrl,
} from "~/components/EmojiPicker";

import { SEARCH_PARAMS } from "~/utils/constants";

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

export const GallerySearchProvider: FC<PropsWithChildren<{}>> = ({
  children,
}) => {
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
  const emojiFilters = searchParams.getAll(
    SEARCH_PARAMS.EMOJI_FILTER_QUERYSTRING
  );
  const captionFilters = searchParams.getAll(
    SEARCH_PARAMS.CAPTION_FILTER_QUERYSTRING
  );

  const isFilterActive = emojiFilters.length > 0 || captionFilters.length > 0;

  const { showGallerySearchModal, setShowGallerySearchModal } =
    React.useContext(GallerySearchContext);

  return !showGallerySearchModal ? (
    <div
      className={classNames(
        "nav-button",
        "top-right",
        "search",
        {
          accented: isFilterActive,
        },
        { "text-search": captionFilters.length > 0 }
      )}
    >
      <button
        onClick={() =>
          setShowGallerySearchModal && setShowGallerySearchModal(true)
        }
      >
        {emojiFilters.length > 0
          ? emojiFilters[0]
          : captionFilters.length > 0
          ? captionFilters[0]
          : "🔎"}
      </button>
    </div>
  ) : null;
};

const GallerySearch: FC<{}> = ({}) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const captionSearchValueFromUrl = searchParams.get(
    SEARCH_PARAMS.CAPTION_FILTER_QUERYSTRING
  );
  const emojiFilterValueFromUrl = searchParams.get(
    SEARCH_PARAMS.EMOJI_FILTER_QUERYSTRING
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
      { [SEARCH_PARAMS.EMOJI_FILTER_QUERYSTRING]: emoji },
      { state: { scroll: false } }
    );
  };

  const onCaptionSearchInput: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const value = e.target.value;
    setCaptionSearchValue(value);
  };

  const onCaptionSearchSubmit = () => {
    setSearchParams(
      { [SEARCH_PARAMS.CAPTION_FILTER_QUERYSTRING]: captionSearchValue },
      { state: { scroll: false } }
    );
  };

  const isFilterActive = Boolean(
    emojiFilterValueFromUrl || captionSearchValueFromUrl
  );

  const closeModal = () => {
    setShowEmojiPicker(false);
    setShowCaptionSearch(false);
    setShowGallerySearchModal && setShowGallerySearchModal(false);
  };

  return (
    <>
      {showGallerySearchModal && (
        <Modal
          className="emoji-picker-modal"
          fullHeight
          header={
            showEmojiPicker
              ? null
              : !showEmojiPicker &&
                !showCaptionSearch && (
                  <MessageContainer>Search</MessageContainer>
                )
          }
          footer={
            !showEmojiPicker && !showCaptionSearch ? (
              <>
                {isFilterActive && (
                  <CenteredContainer>
                    <MenuButton
                      accented
                      onClick={() => {
                        navigate("./", { state: { scroll: false } });
                        closeModal();
                        setCaptionSearchValue("");
                      }}
                    >
                      CLEAR:{" "}
                      {emojiFilterValueFromUrl || captionSearchValueFromUrl}
                    </MenuButton>
                  </CenteredContainer>
                )}
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
            closeModal();
          }}
        >
          {showEmojiPicker && (
            <EmojiPicker
              initialValue={emojiFilterValueFromUrl || ""}
              onSelect={(emoji) => {
                onSearchEmoji(emoji);
                closeModal();
              }}
            />
          )}
          {showCaptionSearch && (
            <div className="caption-search-container">
              <input
                className="caption-search-input"
                type="text"
                id="captionSearch"
                name={SEARCH_PARAMS.CAPTION_FILTER_QUERYSTRING}
                value={captionSearchValue || ""}
                onChange={onCaptionSearchInput}
                defaultValue={captionSearchValueFromUrl || ""}
              />
              <CenteredContainer>
                <MenuButton
                  accented
                  onClick={() => {
                    onCaptionSearchSubmit();
                    closeModal();
                  }}
                >
                  SEARCH CAPTIONS
                </MenuButton>
              </CenteredContainer>
            </div>
          )}
        </Modal>
      )}
    </>
  );
};

export default GallerySearch;
