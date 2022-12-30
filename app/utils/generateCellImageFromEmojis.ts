import shortid from "shortid";

import { theme } from "~/utils/stylesTheme";
import { generateCellImage as createCellImageFromKonva } from "~/utils/konva";

import { S3_ASSET_FILETYPE } from "~/utils/constants";

import type { CellFromClientCache } from "~/utils/clientCache";

import { EmojiConfigSerialized } from "~/interfaces/studioState";

const CELL_IMAGE_ID = "CELL_IMAGE_ID";

function generateFilename() {
  return `${shortid.generate()}.png`;
}

export const generateCellImageFromEmojis = async ({
  emojis,
  backgroundColor,
  filename = generateFilename(),
  htmlElementId,
}: {
  backgroundColor: string;
  emojis: Record<string, EmojiConfigSerialized>;
  filename?: string;
  htmlElementId: string;
}) => {
  const blob = await createCellImageFromKonva(
    emojis,
    backgroundColor,
    htmlElementId
  );
  const file = new File([blob], filename, {
    type: S3_ASSET_FILETYPE,
  });
  const url = URL.createObjectURL(file);

  return {
    file,
    url,
  };
};

export const generateCellImage = async (
  cell: CellFromClientCache,
  filename?: string
) => {
  const cellImageElement = document.createElement("div");
  cellImageElement.hidden = true;
  const cellImageElementId = `${CELL_IMAGE_ID}-${cell.urlId}`;
  cellImageElement.id = cellImageElementId;
  document.body.appendChild(cellImageElement);

  const { file, url } = await generateCellImageFromEmojis({
    emojis: cell.studioState?.emojis || {},
    backgroundColor: cell.studioState?.backgroundColor || theme.colors.white,
    filename,
    htmlElementId: cellImageElementId,
  });

  cell.imageUrl = url;

  return { file, url };
};
