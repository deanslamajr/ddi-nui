import { FC, useState } from "react";
import type { LinksFunction } from "@remix-run/node";

import Modal, {
  CenteredContainer,
  MessageContainer,
  links as modalStylesUrl,
} from "~/components/Modal";
import { MenuButton, links as buttonStylesUrl } from "~/components/Button";
import EmojiPicker, {
  links as emojiPickerStylesUrl,
} from "~/components/EmojiPicker";

export const links: LinksFunction = () => {
  return [
    // { rel: "stylesheet", href: stylesUrl },
    ...emojiPickerStylesUrl(),
    ...modalStylesUrl(),
    ...buttonStylesUrl(),
  ];
};

const SearchModal: FC<{
  onSearchEmoji: (emoji: string) => void;
}> = ({ onSearchEmoji }) => {
  const [showModal, setShowModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  return (
    <>
      {!showModal && (
        <div className="nav-button top-right">
          <button onClick={() => setShowModal(true)}>🕹️</button>
        </div>
      )}
      {showModal && (
        <Modal
          header={<MessageContainer>Search</MessageContainer>}
          footer={
            <>
              <CenteredContainer>
                <MenuButton
                  onClick={() => {
                    setShowEmojiPicker(true);
                    setShowModal(false);
                  }}
                >
                  BY EMOJI
                </MenuButton>
              </CenteredContainer>
              <CenteredContainer>
                <MenuButton onClick={() => {}}>BY CAPTION</MenuButton>
              </CenteredContainer>
            </>
          }
          onCancelClick={() => setShowModal(false)}
        />
      )}
      {showEmojiPicker && (
        <EmojiPicker
          onCancel={() => {
            setShowModal(true);
            setShowEmojiPicker(false);
          }}
          onSelect={(emoji) => {
            onSearchEmoji(emoji);
            setShowModal(false);
            setShowEmojiPicker(false);
          }}
        />
      )}
    </>
  );
};

export default SearchModal;
