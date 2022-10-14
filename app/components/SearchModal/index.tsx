import { FC, useState } from "react";
import type { LinksFunction } from "@remix-run/node";

import Modal, {
  CenteredContainer,
  MessageContainer,
  links as modalStylesUrl,
} from "~/components/Modal";
import { MenuButton, links as buttonStylesUrl } from "~/components/Button";

export const links: LinksFunction = () => {
  return [
    // { rel: "stylesheet", href: stylesUrl },
    ...modalStylesUrl(),
    ...buttonStylesUrl(),
  ];
};

const SearchModal: FC<{}> = ({}) => {
  const [showModal, setShowModal] = useState(false);

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
                <MenuButton onClick={() => {}}>BY EMOJI</MenuButton>
              </CenteredContainer>
              <CenteredContainer>
                <MenuButton onClick={() => {}}>BY CAPTION</MenuButton>
              </CenteredContainer>
            </>
          }
          onCancelClick={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default SearchModal;
