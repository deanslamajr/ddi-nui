import React from "react";
import { getClientVariable } from "~/utils/environment-variables";
import ReCAPTCHA from "react-google-recaptcha";

import { PinkMenuButton } from "~/components/Button";
import Modal, { CenteredContainer, MessageContainer } from "~/components/Modal";

const PublishFailModal: React.FC<{
  hasFailedCaptcha: boolean;
  onRetryClick: (token?: string) => void;
  onCancelClick: () => void;
}> = ({ hasFailedCaptcha, onRetryClick, onCancelClick }) => {
  const message = hasFailedCaptcha
    ? ""
    : "There was an error while publishing :(";

  return (
    <Modal
      header={
        message ? <MessageContainer>{message}</MessageContainer> : undefined
      }
      footer={
        <CenteredContainer>
          {hasFailedCaptcha ? (
            <ReCAPTCHA
              sitekey={getClientVariable("CAPTCHA_V2_SITE_KEY")}
              onChange={(token: string | null) => {
                onRetryClick(token || undefined);
              }}
            />
          ) : (
            <PinkMenuButton onClick={() => onRetryClick()}>
              TRY AGAIN
            </PinkMenuButton>
          )}
        </CenteredContainer>
      }
      onCancelClick={onCancelClick}
    />
  );
};

export default PublishFailModal;
