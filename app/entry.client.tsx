import { hydrate } from "react-dom";
import { RemixBrowser } from "remix";

import { CaptchaV3Provider } from "~/contexts/CaptchaV3";

hydrate(
  <CaptchaV3Provider>
    <RemixBrowser />
  </CaptchaV3Provider>,
  document
);
