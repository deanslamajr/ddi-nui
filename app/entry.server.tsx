import { renderToString } from "react-dom/server";
import { RemixServer } from "remix";
import type { EntryContext } from "remix";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  console.log("handleRequest request.url", request.url);
  // const requestPathWithPrefixRemoved = request.url.replace("v2", "");
  // console.log("requestPathWithPrefixRemoved", requestPathWithPrefixRemoved);
  // const markup = renderToString(
  //   <RemixServer context={remixContext} url={requestPathWithPrefixRemoved} />
  // );
  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  responseHeaders.set("Content-Type", "text/html");

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
