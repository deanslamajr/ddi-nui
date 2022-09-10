import React from "react";
import { load, ReCaptchaInstance } from "recaptcha-v3";

import { getClientVariable } from "~/utils/environment-variables";

export type State = {
  isCaptchaV3Enabled: boolean;
  captchaV3Instance: null | ReCaptchaInstance;
};

const captchaV3SiteKey = getClientVariable("CAPTCHA_V3_SITE_KEY");

const CaptchaV3Context = React.createContext<State>({
  isCaptchaV3Enabled: Boolean(captchaV3SiteKey),
  captchaV3Instance: null,
});

const CaptchaV3Provider: React.FC<{}> = ({ children }) => {
  const [state, setState] = React.useState<State>({
    isCaptchaV3Enabled: Boolean(captchaV3SiteKey),
    captchaV3Instance: null,
  });

  // Run this once when the app initializes
  // on client.
  React.useEffect(() => {
    if (state.isCaptchaV3Enabled) {
      load(captchaV3SiteKey, {
        autoHideBadge: true,
      }).then((captchaV3Instance) => {
        setState({
          ...state,
          captchaV3Instance,
        });
      });
    }
  }, []);

  return (
    <CaptchaV3Context.Provider value={state}>
      {children}
    </CaptchaV3Context.Provider>
  );
};

function useCaptchaV3() {
  const context = React.useContext(CaptchaV3Context);
  if (context === undefined) {
    throw new Error(
      "useCaptchaV3Instance must be used within a CaptchaV3Provider"
    );
  }
  return context;
}

export { CaptchaV3Provider, useCaptchaV3 };
