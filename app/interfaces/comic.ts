export type Comic = {
  cellsCount: number;
  initialCell: {
    caption: string;
    imageUrl: string;
    order: number | null;
    schemaVersion: number;
    urlId: string;
  };
  updatedAt: string;
  urlId: string;
};
