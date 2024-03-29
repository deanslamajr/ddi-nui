import React from "react";
import type { LinksFunction } from "@remix-run/node";
import { FaCheck } from "react-icons/fa";
import Modal, {
  MessageContainer,
  links as modalStylesUrl,
} from "~/components/Modal";
import { links as menuButtonStylesUrl } from "~/components/Button";
import CellWithLoadSpinner, {
  links as cellWithLoadSpinnerStylesUrl,
} from "~/components/CellWithLoadSpinner";

import { deleteComic as removeComicAndCellsFromClientCache } from "~/utils/clientCache/comic";
import { CellFromClientCache } from "~/utils/clientCache/cell";
import { isDraftId } from "~/utils/draftId";
import { DDI_APP_PAGES } from "~/utils/urls";

import { useCaptchaV3 } from "~/contexts/CaptchaV3";

import { SignedCells } from "~/interfaces/signedCells";

import publishComicUpdate from "~/data/external/publishComicUpdate";

import uploadImages from "./uploadImages";
import PublishFailModal, {
  links as publishFailModalStylesUrl,
} from "./PublishFailModal";
import PublishPreviewCell from "./PublishPreviewCell";

import stylesUrl from "~/styles/components/PublishPreviewModal.css";

export const links: LinksFunction = () => {
  return [
    ...modalStylesUrl(),
    ...cellWithLoadSpinnerStylesUrl(),
    ...menuButtonStylesUrl(),
    ...publishFailModalStylesUrl(),
    { rel: "stylesheet", href: stylesUrl },
  ];
};

const PublishPreviewModal: React.FC<{
  cells: CellFromClientCache[];
  comicUrlId: string;
  initialCellUrlId: string;
  onCancelClick: () => void;
}> = ({ cells, comicUrlId, initialCellUrlId, onCancelClick }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [totalTasksCount, setTotalTasksCount] = React.useState(0);
  const [completedTasksCount, setCompletedTasksCount] = React.useState(0);
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

  const markTaskCompleted = () => {
    setCompletedTasksCount(
      (prevCompletedTaskCount) => prevCompletedTaskCount + 1
    );
  };

  const calculatePercentageCompleted = () => {
    return Math.round((completedTasksCount / totalTasksCount) * 100);
  };

  const publish = async (v2CaptchaToken?: string) => {
    setCompletedTasksCount(0); // reset completed before showing load spinner
    setIsLoading(true);

    let signedCells: SignedCells | undefined;
    // If the comic had a draftId at signing
    // this would be a new, non-draft comicUrlId
    let possiblyNewComicUrlId: string | undefined;

    const cellUrlIdsThatRequireImageUploads =
      getCellUrlIdsThatRequireImageUploads();

    // minimum number of "jobs" required to finish a publish
    // i.e. all jobs excluding uploads
    let totalJobsCount = 1;
    if (cellUrlIdsThatRequireImageUploads.length) {
      // if image uploading is required:
      // 1 + # of cells that require uploads
      totalJobsCount += 1 + cellUrlIdsThatRequireImageUploads.length;
    }
    setTotalTasksCount(totalJobsCount);

    try {
      if (cellUrlIdsThatRequireImageUploads.length) {
        const uploadImagesResponse = await uploadImages({
          captchaV3ContextState,
          cells,
          cellUrlIdsThatRequireImageUploads,
          comicUrlId,
          markTaskCompleted,
          onFail: onPublishFail,
          v2CaptchaToken,
        });

        // captcha fail case,
        // do not continue
        if (!uploadImagesResponse) {
          setIsLoading(false);
          return;
        }

        signedCells = uploadImagesResponse.signedCells;
        possiblyNewComicUrlId = uploadImagesResponse.comicUrlId;
      } else {
        possiblyNewComicUrlId = comicUrlId;
      }

      await publishComicUpdate({
        cells,
        comicUrlIdToUpdate: possiblyNewComicUrlId,
        initialCellUrlId,
        isPublishedComic: !isDraftId(comicUrlId),
        markTaskCompleted,
        signedCells,
      });

      //delete comic from client cache
      removeComicAndCellsFromClientCache(comicUrlId);

      // Router.pushRoute(`/comic/${possiblyNewComicUrlId}`);
      location.assign(DDI_APP_PAGES.comic(possiblyNewComicUrlId));
    } catch (e) {
      // @todo better logging
      console.error(e);

      onPublishFail(false);
      setIsLoading(false);
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
    <>
      <Modal
        shouldRenderCloseButtonOutsideHeader
        fullHeight
        header={
          isLoading ? undefined : (
            <MessageContainer>Publish this comic?</MessageContainer>
          )
        }
        footer={null}
        onCancelClick={onCancelClick}
      >
        <div className="cells-container">
          {isLoading ? (
            <CellWithLoadSpinner
              percentCompleted={calculatePercentageCompleted()}
            />
          ) : (
            cells.map((cell) => (
              <PublishPreviewCell key={cell.urlId} cell={cell} />
            ))
          )}
        </div>
        {!isLoading && (
          <div className="nav-button top-right accented">
            <button onClick={() => publish()}>
              <FaCheck size="2rem" />
            </button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default PublishPreviewModal;
