import React from "react";
import styled from "styled-components";
import { LinksFunction } from "remix";

import Cell, { links as cellStylesUrl } from "~/components/Cell";
import Modal, {
  CenteredContainer,
  MessageContainer,
  links as modalStylesUrl,
} from "~/components/Modal";
import { PinkMenuButton } from "~/components/Button";

import { theme } from "~/utils/stylesTheme";
import { SCHEMA_VERSION } from "~/utils/constants";
import {
  CellFromClientCache,
  deleteComic as removeComicAndCellsFromClientCache,
} from "~/utils/clientCache";
import { isDraftId } from "~/utils/draftId";
import { DDI_APP_PAGES } from "~/utils/urls";

import { useCaptchaV3 } from "~/contexts/CaptchaV3";

import { SignedCells } from "~/interfaces/signedCells";

import publishComicUpdate from "~/data/external/publishComicUpdate";

import uploadImages from "./uploadImages";
import PublishFailModal from "./PublishFailModal";

import stylesUrl from "~/styles/components/PublishPreviewModal.css";

export const links: LinksFunction = () => {
  return [
    ...cellStylesUrl(),
    ...modalStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
};

const StudioCell = styled(Cell)<{ widthOverride: number }>`
  margin: 0 auto;
  width: ${(props) => props.widthOverride}px;
`;

const PublishPreviewModal: React.FC<{
  cells: CellFromClientCache[];
  comicUrlId: string;
  initialCellUrlId: string;
  onCancelClick: () => void;
}> = ({ cells, comicUrlId, initialCellUrlId, onCancelClick }) => {
  const [showPublishFailModal, setShowPublishFailModal] = React.useState(false);
  const [hasFailedCaptcha, setHasFailedCaptcha] = React.useState(false);

  const captchaV3ContextState = useCaptchaV3();

  const getCellUrlIdsThatRequireImageUploads = () => {
    return cells
      .filter(({ hasNewImage }) => hasNewImage)
      .map(({ urlId }) => urlId);
  };

  const onPublishFail = (isCaptchaFail: boolean) => {
    setHasFailedCaptcha(isCaptchaFail);
    setShowPublishFailModal(true);
  };

  const publish = async (v2CaptchaToken?: string) => {
    let signedCells: SignedCells | undefined;
    // If the comic had a draftId at signing
    // this would be a new, non-draft comicUrlId
    let possiblyNewComicUrlId: string | undefined;
    // minimum number of "jobs" required to finish a publish
    // i.e. all jobs excluding uploads
    let totalJobsCount = 1;

    const cellUrlIdsThatRequireImageUploads =
      getCellUrlIdsThatRequireImageUploads();

    try {
      if (cellUrlIdsThatRequireImageUploads.length) {
        // if image uploading is required:
        // 1 + # of cells that require uploads
        totalJobsCount += 1 + cellUrlIdsThatRequireImageUploads.length;

        // this.props.showSpinner(totalJobsCount)

        const uploadImagesResponse = await uploadImages({
          captchaV3ContextState,
          cells,
          cellUrlIdsThatRequireImageUploads,
          comicUrlId,
          onFail: onPublishFail,
          v2CaptchaToken,
        });

        // captcha fail case,
        // do not continue
        if (!uploadImagesResponse) {
          return;
        }

        signedCells = uploadImagesResponse.signedCells;
        possiblyNewComicUrlId = uploadImagesResponse.comicUrlId;
      } else {
        // this.props.showSpinner(totalJobsCount);
        possiblyNewComicUrlId = comicUrlId;
      }

      await publishComicUpdate({
        cells,
        comicUrlIdToUpdate: possiblyNewComicUrlId,
        initialCellUrlId,
        isPublishedComic: !isDraftId(comicUrlId),
        signedCells,
      });

      // this.props.markJobAsFinished();

      //delete comic from client cache
      removeComicAndCellsFromClientCache(comicUrlId);

      // Router.pushRoute(`/comic/${possiblyNewComicUrlId}`);
      location.assign(DDI_APP_PAGES.comic(possiblyNewComicUrlId));
    } catch (e) {
      // @todo better logging
      console.error(e);

      // this.props.hideSpinner();
      onPublishFail(false);
    }
  };

  const retryPublish = (token?: string) => {
    publish(token);
    setShowPublishFailModal(false);
    setHasFailedCaptcha(false);
  };

  return showPublishFailModal ? (
    <PublishFailModal
      hasFailedCaptcha={hasFailedCaptcha}
      onRetryClick={(token?: string) => retryPublish(token)}
      onCancelClick={() => {
        setShowPublishFailModal(false);
        setHasFailedCaptcha(false);
        onCancelClick();
      }}
    />
  ) : (
    <Modal
      header={<MessageContainer>Publish this comic?</MessageContainer>}
      footer={
        <CenteredContainer>
          <PinkMenuButton onClick={() => publish()}>PUBLISH</PinkMenuButton>
        </CenteredContainer>
      }
      onCancelClick={onCancelClick}
    >
      <div className="cells-container">
        {cells.map((cell) => (
          <div className="cell-container" key={cell.imageUrl}>
            <StudioCell
              cellWidth={theme.cell.width}
              imageUrl={cell.imageUrl!}
              isImageUrlAbsolute={Boolean(cell.hasNewImage)}
              schemaVersion={cell.schemaVersion || SCHEMA_VERSION}
              caption={cell.studioState?.caption}
              widthOverride={theme.layout.width}
              removeBorders
            />
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default PublishPreviewModal;
