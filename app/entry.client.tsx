import { hydrateRoot } from "react-dom/client";

import { RemixBrowser } from "@remix-run/react";

import { CaptchaV3Provider } from "~/contexts/CaptchaV3";

import { GallerySearchProvider } from "~/components/GallerySearch";

hydrateRoot(
  document,
  <CaptchaV3Provider>
    <GallerySearchProvider>
      <RemixBrowser />
    </GallerySearchProvider>
  </CaptchaV3Provider>
);
