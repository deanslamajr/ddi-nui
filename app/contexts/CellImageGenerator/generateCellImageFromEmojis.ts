import shortid from "shortid";

import { theme } from "~/utils/stylesTheme";
import { generateCellImage as createCellImageFromKonva } from "~/utils/konva";
import { S3_ASSET_FILETYPE } from "~/utils/constants";
import { StudioStateImageData } from "~/interfaces/studioState";
import { EmojiConfigSerialized } from "~/models/emojiConfig";

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
  backgroundColor: string | null;
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
  studioStateImageData: StudioStateImageData,
  domIdKey: number | string,
  filename?: string
) => {
  const cellImageElementId = `${CELL_IMAGE_ID}-${domIdKey}`;
  let cellImageElement = document.getElementById(cellImageElementId);

  // Only create the element if it doesn't already exist
  // Reuse existing element to avoid overloading DOM
  if (!cellImageElement) {
    cellImageElement = document.createElement("div");
    cellImageElement.hidden = true;
    cellImageElement.id = cellImageElementId;
    document.body.appendChild(cellImageElement);
  }

  const { file, url } = await generateCellImageFromEmojis({
    emojis: studioStateImageData.emojis || {},
    backgroundColor:
      studioStateImageData.backgroundColor === null
        ? null // opt out of a background e.g. for emoji icons
        : studioStateImageData?.backgroundColor || theme.colors.white,
    filename,
    htmlElementId: cellImageElementId,
  });

  return { file, url };
};
