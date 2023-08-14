import React from "react";
import type { LinksFunction } from "@remix-run/node";
import { getClientVariable } from "~/utils/environment-variables";
import ReCAPTCHA from "react-google-recaptcha";

import { MenuButton, links as menuButtonStylesUrl } from "~/components/Button";
import Modal, {
  CenteredContainer,
  MessageContainer,
  links as modalStylesUrl,
} from "~/components/Modal";

export const links: LinksFunction = () => {
  return [...menuButtonStylesUrl(), ...modalStylesUrl()];
};

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
      shouldRenderCloseButtonOutsideHeader
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
            <MenuButton accented onClick={() => onRetryClick()}>
              TRY AGAIN
            </MenuButton>
          )}
        </CenteredContainer>
      }
      onCancelClick={onCancelClick}
    />
  );
};

export default PublishFailModal;
