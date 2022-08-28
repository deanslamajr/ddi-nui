import { useRef } from "react";

const safeDocument = typeof document !== "undefined" ? document : false;

/**
 * from https://gist.github.com/reecelucas/2f510e6b8504008deaaa52732202d2da
 * Usage:
 * const [blockScroll, allowScroll] = useScrollBlock();
 */
export default () => {
  const scrollBlocked = useRef<undefined | boolean>();

  const blockScroll = () => {
    if (safeDocument === false) return;

    const { body } = safeDocument;

    if (!body || !body.style || scrollBlocked.current) return;

    const html = safeDocument.documentElement;

    const scrollBarWidth = window.innerWidth - html.clientWidth;
    const bodyPaddingRight =
      parseInt(
        window.getComputedStyle(body).getPropertyValue("padding-right")
      ) || 0;

    /**
     * 1. Fixes a bug in iOS and desktop Safari whereby setting
     *    `overflow: hidden` on the html/body does not prevent scrolling.
     * 2. Fixes a bug in desktop Safari where `overflowY` does not prevent
     *    scroll if an `overflow-x` style is also applied to the body.
     */
    html.style.position = "relative"; /* [1] */
    html.style.overflow = "hidden"; /* [2] */
    body.style.position = "relative"; /* [1] */
    body.style.overflow = "hidden"; /* [2] */
    body.style.paddingRight = `${bodyPaddingRight + scrollBarWidth}px`;

    scrollBlocked.current = true;
  };

  const allowScroll = () => {
    if (safeDocument === false) return;

    const { body } = safeDocument;

    if (!body || !body.style || !scrollBlocked.current) return;

    const html = safeDocument.documentElement;

    html.style.position = "";
    html.style.overflow = "";
    body.style.position = "";
    body.style.overflow = "";
    body.style.paddingRight = "";

    scrollBlocked.current = false;
  };

  return { blockScroll, allowScroll, isScrollBlocked: scrollBlocked };
};
