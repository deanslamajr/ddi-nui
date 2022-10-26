import isServerContext from "~/utils/isServerContext";

const getClientCookiesForFetch = (
  request?: Request
): {
  credentials?: RequestCredentials;
  headers?: HeadersInit;
} => {
  let headersFromClient: Headers | null = null;
  if (isServerContext()) {
    if (request === undefined) {
      throw new Error(
        "getClientCookiesForFetch() requires a `request` argument for server side use."
      );
    }
    return { headers: request.headers };
  }

  return {
    credentials: "include",
  };
};

export default getClientCookiesForFetch;
