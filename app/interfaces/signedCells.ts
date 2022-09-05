export type SignedCells = {
  draftUrlId: string;
  filename: string;
  signData: {
    signedRequest: string;
    url: string;
  };
  urlId: string;
}[];
