import newrelic from "newrelic";
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
    const url = new URL(request.url);
    const path = url.pathname;

    newrelic.startWebTransaction(path, async () => {
      const nrTransaction = newrelic.getTransaction();

      const sheet = new ServerStyleSheet();

      let markup = newrelic.startSegment("renderToString", true, () => {
        return renderToString(
          sheet.collectStyles(
            <RemixServer context={remixContext} url={request.url} />
          )
        );
      });

      const styles = sheet.getStyleTags();

      markup = markup.replace("__STYLES__", styles);

      responseHeaders.set("Content-Type", "text/html");

      const response = new Response("<!DOCTYPE html>" + markup, {
        status: responseStatusCode,
        headers: responseHeaders,
      });

      const attributes = {
        pathname: path,
        search: url.search,
        responseStatusCode,
      };
      newrelic.addCustomAttributes(attributes);

      nrTransaction.end();

      resolve(response);
    });
  });
}
