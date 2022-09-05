import { renderToString } from "react-dom/server";
import { RemixServer } from "remix";
import type { EntryContext } from "remix";
import { ServerStyleSheet } from "styled-components";

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  return new Promise<Response>((resolve, reject) => {
    const sheet = new ServerStyleSheet();

    let markup = renderToString(
      sheet.collectStyles(
        <RemixServer context={remixContext} url={request.url} />
      )
    );

    const styles = sheet.getStyleTags();

    markup = markup.replace("__STYLES__", styles);

    responseHeaders.set("Content-Type", "text/html");

    const response = new Response("<!DOCTYPE html>" + markup, {
      status: responseStatusCode,
      headers: responseHeaders,
    });

    resolve(response);
  });
}
