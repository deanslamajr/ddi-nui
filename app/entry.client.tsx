import { hydrate } from "react-dom";
import { RemixBrowser } from "@remix-run/react";

import { CaptchaV3Provider } from "~/contexts/CaptchaV3";

import { GallerySearchProvider } from "~/components/GallerySearch";

hydrate(
  <CaptchaV3Provider>
    <GallerySearchProvider>
      <RemixBrowser />
    </GallerySearchProvider>
  </CaptchaV3Provider>,
  document
);
