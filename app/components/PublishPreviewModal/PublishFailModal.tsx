import React from "react";
import { getClientVariable } from "~/utils/environment-variables";
import styled from "styled-components";
import ReCAPTCHA from "react-google-recaptcha";

import { PinkMenuButton } from "~/components/Button";
import Modal, { CenteredButtons, MessageContainer } from "~/components/Modal";

const PublishFailModalContainer = styled(Modal)`
  height: inherit;
  width: inherit;
`;

const PublishFailModal: React.FC<{
  hasFailedCaptcha: boolean;
  onRetryClick: (token?: string) => void;
  onCancelClick: () => void;
}> = ({ hasFailedCaptcha, onRetryClick, onCancelClick }) => {
  const message = hasFailedCaptcha
    ? ""
    : "There was an error while publishing :(";

  return (
    <PublishFailModalContainer onCancelClick={onCancelClick}>
      <MessageContainer>{message}</MessageContainer>
      <CenteredButtons>
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
      </CenteredButtons>
    </PublishFailModalContainer>
  );
};

export default PublishFailModal;
