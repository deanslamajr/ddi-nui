import React from "react";
import styled from "styled-components";

import Modal, { CenteredButtons, MessageContainer } from "~/components/Modal";
import { MenuButton, PinkMenuButton } from "~/components/Button";

const HomeModal = styled(Modal)`
  width: 315px;
  height: inherit;
`;

type Props = {
  isComicDirty: boolean;
  onCancelClick: () => void;
  onDeleteClick: () => void;
  onPublishClick: () => void;
};

const ComicActionsModal: React.FC<Props> = ({
  isComicDirty,
  onCancelClick,
  onDeleteClick,
  onPublishClick,
}) => {
  const [currentView, setCurrentView] = React.useState<
    "MAIN" | "DELETE_WARNING"
  >("MAIN");

  return (
    <HomeModal onCancelClick={onCancelClick}>
      {currentView === "MAIN" && (
        <>
          <CenteredButtons>
            <MenuButton onClick={() => setCurrentView("DELETE_WARNING")}>
              DELETE
            </MenuButton>
          </CenteredButtons>
          {isComicDirty && (
            <CenteredButtons>
              <PinkMenuButton onClick={() => onPublishClick()}>
                PUBLISH
              </PinkMenuButton>
            </CenteredButtons>
          )}
        </>
      )}
      {currentView === "DELETE_WARNING" && (
        <>
          <MessageContainer>
            Are you sure you want to delete this comic?
          </MessageContainer>
          <CenteredButtons>
            <MenuButton onClick={onDeleteClick}>DELETE</MenuButton>
          </CenteredButtons>
        </>
      )}
    </HomeModal>
  );
};

export default ComicActionsModal;

// export default class ComicActionsModal extends React.Component {
//   state = {
//     currentView: MAIN,
//   };

//   renderDeleteWarning = () => {
//     return (
//       <React.Fragment>
//         <MessageContainer>
//           Are you sure you want to delete this comic?
//         </MessageContainer>
//         <CenteredButtons>
//           <MenuButton onClick={this.props.onDeleteClick}>DELETE</MenuButton>
//         </CenteredButtons>
//       </React.Fragment>
//     );
//   };

//   renderMain = () => {
//     return (
//       <React.Fragment>
//         <CenteredButtons>
//           <MenuButton
//             onClick={() => this.setState({ currentView: DELETE_WARNING })}
//           >
//             DELETE
//           </MenuButton>
//         </CenteredButtons>
//         {this.props.isComicDirty && (
//           <CenteredButtons>
//             <PinkMenuButton onClick={() => this.props.onPublishClick()}>
//               PUBLISH
//             </PinkMenuButton>
//           </CenteredButtons>
//         )}
//       </React.Fragment>
//     );
//   };

//   views = {
//     [MAIN]: this.renderMain,
//     [DELETE_WARNING]: this.renderDeleteWarning,
//   };

// render() {
//   return (
//     <HomeModal onCancelClick={this.props.onCancelClick}>
//       {this.views[this.state.currentView]()}
//     </HomeModal>
//   );
// }
// }
